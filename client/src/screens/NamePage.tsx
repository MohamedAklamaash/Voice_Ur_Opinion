import { Theme } from "../App";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserName } from "../store/UserSlice";
type Props = {
  setstepPageCount: (num: number) => void;
  stepPageCount: number;
  primaryTheme: Theme;
};

const NamePage = ({ stepPageCount, setstepPageCount, primaryTheme }: Props) => {
  const navigate = useNavigate();
  const [userName, setuserName] = useState<string>("");
  const dispatch = useDispatch();
  return (
    <div className=" min-h-screen">
      <section className=" flex items-center justify-center flex-col md:mt-[10%] max-md:mt-[40%] ">
        <label htmlFor="name" className=" font-poppins text-lg mb-10">
          🤔 What’s your full name?
        </label>
        <input
          id="name"
          placeholder="Enter Your name"
          className={`${
            primaryTheme === "dark"
              ? "bg-primary-white text-primary-black-700"
              : "bg-primary-black-700 text-primary-white"
          } px-6 py-4 rounded-lg text0lg font-montserrat w-[40%]`}
          onChange={(e) => {
            setuserName(e.target.value);
          }}
        />
        <button
          className=" rounded-full mt-10 bg-primary-indigo px-10 py-4 mb-10 font - montserrat "
          onClick={() => {
            setstepPageCount(stepPageCount + 1);
            dispatch(setUserName(userName));
            navigate(`/loginPage?name=${userName}`);
          }}
        >
          Next {`->`}
        </button>
      </section>
    </div>
  );
};

export default NamePage;
