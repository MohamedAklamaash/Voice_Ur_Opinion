import { Icon } from "@mui/material";
import appLogo from "../assets/Logo.webp";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { NavigateFunction, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Theme } from "../App";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Link } from "react-router-dom";

type Props = {
  name: string;
  imgSrc: string;
  primaryTheme: Theme;
  setprimaryTheme: (theme: Theme) => void;
};
const Navbar = ({ name, imgSrc, setprimaryTheme, primaryTheme }: Props) => {
  const navigate: NavigateFunction = useNavigate();
  const [isMenuToggled, setisMenuToggled] = useState<boolean>(false);

  return (
    <div
      className={` p-4 top-0 shadow-2xl  w-full flex items-center justify-between`}
    >
      <nav className=" flex items-center justify-center">
        <img
          className=" rounded-full w-[100px] z-[1000] p-3 cursor-pointer "
          onClick={() => {
            navigate("/");
          }}
          src={appLogo}
          alt="Logo"
        />
        <h1
          className=" font-montserrat cursor-pointer text-gradient-violet font-bold text-2xl "
          onClick={() => {
            navigate("/");
          }}
        >
          Voice Ur Opinion{" "}
          <Icon className=" text-primary-white" component={KeyboardVoiceIcon} />{" "}
        </h1>
      </nav>
      <nav className=" flex items-center max-md:hidden ">
        <h1 className=" p-2  font-poppins  text-2xl font-bold text-gradient-violet hover:tracking-wider ">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </h1>
        <img
          src={`${imgSrc}`}
          alt="Profile Pic"
          className="w-[100px] h-[100px] rounded-full"
          onClick={() => {
            navigate(`/${imgSrc}`);
          }}
        />
        <div className=" p-4">
          {primaryTheme === "dark" ? (
            <Icon
              component={DarkModeIcon}
              fontSize="large"
              className=" cursor-pointer"
              onClick={() => setprimaryTheme("light")}
            />
          ) : (
            <Icon
              component={LightModeIcon}
              fontSize="large"
              className=" cursor-pointer"
              onClick={() => setprimaryTheme("dark")}
            />
          )}
        </div>
      </nav>
      <nav className=" max-md:block hidden ">
        {isMenuToggled ? (
          <div className=" bg-primary-indigo h-[100%] w-[100%px]  text-white">
            <p
              onClick={() => {
                setisMenuToggled(!isMenuToggled);
              }}
              className=" text-end text-4xl p-10 cursor-pointer"
            >
              X
            </p>
            <div className="">
              <h1 className=" p-2  font-poppins text-center tracking-wide text-lg font-bold text-white">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </h1>
              <Link to={`${imgSrc}`}
              target="_blank"
              >
                <img
                  src={`${imgSrc}`}
                  alt="Profile Pic"
                  className="w-[50px] h-[50px] rounded-full mx-auto "
                />
              </Link>
            </div>
            <div>
              {primaryTheme === "dark" ? (
                <div className=" flex space-x-4 justify-center items-center">
                  <h1>
                    {primaryTheme.charAt(0).toUpperCase() +
                      primaryTheme.slice(1)}
                  </h1>
                  <Icon
                    component={DarkModeIcon}
                    fontSize="large"
                    className=" cursor-pointer"
                    onClick={() => setprimaryTheme("light")}
                  />
                </div>
              ) : (
                <div className=" flex space-x-4 justify-center items-center">
                  <h1>
                    {primaryTheme.charAt(0).toUpperCase() +
                      primaryTheme.slice(1)}
                  </h1>
                  <Icon
                    component={LightModeIcon}
                    fontSize="large"
                    className=" cursor-pointer"
                    onClick={() => setprimaryTheme("dark")}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <Icon
            component={MenuIcon}
            className=" cursor-pointer"
            fontSize="large"
            onClick={() => {
              setisMenuToggled(!isMenuToggled);
            }}
          />
        )}
      </nav>
    </div>
  );
};

export default Navbar;
