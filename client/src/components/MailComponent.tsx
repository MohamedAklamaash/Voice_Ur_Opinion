import { Theme } from "../App";
import MailIcon from "@mui/icons-material/Mail";
import { Icon } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
type Props = {
  setstepPageCount: (num: number) => void;
  stepPageCount: number;
  primaryTheme: Theme;
};

const MailComponent = ({
  setstepPageCount,
  stepPageCount,
  primaryTheme,
}: Props) => {
  const [email, setemail] = useState("");
  const navigate = useNavigate();
  const handleEmail = async () => {
    if (email === "") {
      return;
    }
    const { data } = await axios.post(`http://localhost:8001/Otp/send-otp`, {
      email,
    });

    setstepPageCount(stepPageCount + 1);
    navigate(`/getUrOtp?email=${email}`);
  };
  return (
    <div className=" shadow-2xl md:mt-[10%] max-md:mt-[40%] mx-auto">
      <section className=" shadow-2xl flex items-center justify-center flex-col">
        <section className=" flex flex-col">
          <h1 className=" font-poppins text-4xl text-center mb-10 font-bold ">
            Enter Your Mail <Icon component={MailIcon} fontSize="large" />
          </h1>
          <input
            type="text"
            onChange={(e) => {
              setemail(e.target.value);
            }}
            placeholder="email@gmail.com"
            className={`${
              primaryTheme === "dark"
                ? " bg-primary-white text-primary-black-700"
                : " bg-primary-black-700 text-primary-white"
            } px-10 py-4 rounded-full mb-4`}
          />
          <button
            className=" rounded-full bg-primary-indigo px-10 py-4 mb-10 font-montserrat font-bold "
            onClick={handleEmail}
          >
            Send Otp {"->"}
          </button>
        </section>
        <section>
          <h1 className="mb-10 ml-10 tracking-widest font-poppins text-blue-500">
            By entering your maik id, you’re agreeing to our Terms of Service
            and Privacy Policy. Thanks!
          </h1>
        </section>
      </section>
    </div>
  );
};

export default MailComponent;
