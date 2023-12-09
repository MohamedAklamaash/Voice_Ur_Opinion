import PhoneIcon from "@mui/icons-material/Phone";
import { Icon } from "@mui/material";
import { Theme } from "../App";
import { useState } from "react";
import MailIcon from "@mui/icons-material/Mail";
import PhoneComponent from "../components/PhoneComponent";
import MailComponent from "../components/MailComponent";

type Props = {
  setstepPageCount: (num: number) => void;
  stepPageCount: number;
  primaryTheme: Theme;
};

type Component = "mail" | "phone";

const SignInpage = ({
  setstepPageCount,
  stepPageCount,
  primaryTheme,
}: Props) => {
  const [component, setcomponent] = useState<Component>("phone");

  return (
    <div className="min-h-screen">
      <section className=" absolute top-[30%] right-[28%] space-x-10 ">
        <Icon
          component={PhoneIcon}
          className={`${
            primaryTheme === "dark" ? " text-white " : " text-primary-black-700"
          } cursor-pointer`}
          onClick={() => {
            setcomponent("phone");
          }}
          fontSize="large"
        />
        <Icon
          component={MailIcon}
          className={`${
            primaryTheme === "dark" ? " text-white " : " text-primary-black-700"
          } cursor-pointer`}
          onClick={() => {
            setcomponent("mail");
          }}
          fontSize="large"
        />
      </section>
      {component === "phone" ? (
        <PhoneComponent
          setstepPageCount={setstepPageCount}
          stepPageCount={stepPageCount}
          primaryTheme={primaryTheme}
        />
      ) : (
        <MailComponent
          setstepPageCount={setstepPageCount}
          stepPageCount={stepPageCount}
          primaryTheme={primaryTheme}
        />
      )}
    </div>
  );
};

export default SignInpage;
