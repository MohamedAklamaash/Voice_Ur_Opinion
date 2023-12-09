import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPhoneNumber } from "../store/UserSlice";
import axios from "axios";
import { Theme } from "../App";
type Props = {
  setstepPageCount: (num: number) => void;
  stepPageCount: number;
  primaryTheme: Theme;
};

const GetOtpPage: React.FC<Props> = ({
  setstepPageCount,
  stepPageCount,
  primaryTheme,
}: Props) => {
  const navigate = useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const phoneNumber = urlParams.get("phoneNumber");
  const email = urlParams.get("email");

  const dispatch = useDispatch();
  dispatch(setPhoneNumber(phoneNumber));
  const [otp, setOtp] = useState<string>("");
  const otpInputs = useRef<HTMLInputElement | null>(null);

  const VerifyOtp = async () => {
    const {
      data: { success },
    } = await axios.post<{ success: boolean }>(
      `http://localhost:8001/Otp/verify-otp`,
      {
        email,
        otp,
      }
    );
    console.log(success);

    if (!success) {
      navigate("/signIn");
    }

    setstepPageCount(stepPageCount + 1);
    navigate("/enterName");
  };

  const handleOtpChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Allow only single-digit numeric input
      if (/^[0-9]$/.test(value)) {
        const newOtp = otp.split("");
        newOtp[index] = value;
        setOtp(newOtp.join(""));
      }

      // Move to the next input field
      if (index < 3 && otpInputs.current && otpInputs.current[index + 1]) {
        otpInputs.current[index + 1]?.focus();
      }
    };

  const handleKeyDown =
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      // Move to the previous input field on backspace
      if (e.key === "Backspace" && index > 0 && otpInputs.current) {
        otpInputs.current[index - 1]?.focus();
      }
    };

  return (
    <div className="min-h-screen">
      <section className="flex items-center justify-center max-md:mt-[40%] md:mt-[6%]">
        <section className="mb-10 mt-[10%]">
          <h1 className="font-poppins text-lg">
            Enter the OTP Sent To Your Number
          </h1>
        </section>
      </section>
      <section className="flex items-start justify-center gap-2">
        {[...Array(4)].map((_, index) => (
          <input
            key={index}
            type="text"
            value={otp[index] || ""}
            name={`otp-${index}`}
            maxLength={1}
            alt={`otp-inp-unit-${index}`}
            className={`w-12 h-10 ${
              primaryTheme === "dark"
                ? "bg-primary-white text-primary-black-700"
                : "bg-primary-black-700 text-primary-white"
            } p-3 text-center`}
            onChange={handleOtpChange(index)}
            onKeyDown={handleKeyDown(index)}
            ref={(input) => (otpInputs.current = input)}
          />
        ))}
      </section>
      <section className=" mt-10 ml-[40%] ">
        <button
          className="rounded-full bg-primary-indigo px-10 py-4 mb-10 font-montserrat"
          onClick={() => {
            VerifyOtp();
          }}
        >
          Next {`->`}
        </button>
      </section>
    </div>
  );
};

export default GetOtpPage;
