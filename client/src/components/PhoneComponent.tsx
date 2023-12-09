import { Theme } from "../App";
import PhoneIcon from "@mui/icons-material/Phone";
import { Icon } from "@mui/material";
import indianFlag from "../assets/IndianFlag.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type Props = {
  setstepPageCount: (num: number) => void;
  stepPageCount: number;
  primaryTheme: Theme;
};

const PhoneComponent = ({
  setstepPageCount,
  stepPageCount,
  primaryTheme,
}: Props) => {
  const navigate = useNavigate();
  const [phoneNumber, setphoneNumber] = useState<string>("");
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState<boolean>(false);

  const validatePhoneNumber = (number: string) => {
    // Check if the phone number has exactly 10 digits and contains only numeric characters
    const isValid = /^\d{10}$/.test(number);
    setIsValidPhoneNumber(isValid);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setphoneNumber(value);
    validatePhoneNumber(value);
  };

  const handleNextClick = () => {
    if (isValidPhoneNumber) {
      setstepPageCount(stepPageCount + 1);
      navigate(`/getUrOtp?phoneNumber=${phoneNumber}`);
    }
  };

  return (
    <div>
      <section className="mt-[70px] shadow-2xl w-[50%] max-md:w-[79%] mx-auto py-10 px-10">
        <section className="flex items-center justify-center mb-10 mt-10">
          <h1 className="font-poppins text-lg">Enter your phone number</h1>
          <Icon
            component={PhoneIcon}
            fontSize="large"
            className={`${
              primaryTheme === "dark"
                ? "text-primary-Darkred"
                : "text-primary-black-700"
            }`}
          />
        </section>
        <section className="flex items-center justify-center flex-col">
          <div className="flex items-center justify-center mb-10 mt-10 space-x-4">
            <img src={indianFlag} alt="Flag" className="w-10 h-10" />
            <input
              type="tel"
              className={`${
                primaryTheme === "dark"
                  ? "bg-primary-white text-primary-black-700"
                  : "bg-primary-black-700 text-primary-white"
              } px-6 py-3 rounded-lg tracking-wider`}
              onChange={handlePhoneNumberChange}
              placeholder="123-4567-8901"
            />
          </div>
          <button
            className={`rounded-full bg-primary-indigo px-10 py-4 mb-10 font-montserrat ${
              isValidPhoneNumber ? "" : "cursor-not-allowed opacity-50"
            }`}
            onClick={handleNextClick}
            disabled={!isValidPhoneNumber}
          >
            Next {`->`}
          </button>
          <p className="mb-10 tracking-widest font-poppins text-blue-500">
            By entering your number, you’re agreeing to our Terms of Service and
            Privacy Policy. Thanks!
          </p>
          {!isValidPhoneNumber && (
            <p className="text-red-500">
              Please enter a valid 10-digit number.
            </p>
          )}
        </section>
      </section>
    </div>
  );
};

export default PhoneComponent;
