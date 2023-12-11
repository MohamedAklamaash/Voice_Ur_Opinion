import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { useState } from "react";
import SignInpage from "./pages/SignInpage";
import GetOtpPage from "./screens/GetOtpPage";
import NamePage from "./screens/NamePage";
import LoginPage from "./screens/LoginPage";
import MainHome from "./screens/MainScreen/MainHome";
import { useSelector } from "react-redux";
export type Theme = "light" | "dark";

const App = () => {
  const [primaryTheme, setprimaryTheme] = useState<Theme>("dark");
  const [stepPageCount, setstepPageCount] = useState<number>(0);
  const { userName, userProfileUrl } = useSelector((state: any) => state.user);

  return (
    <div
      className={`${
        primaryTheme === "dark"
          ? "bg-primary-black-700 text-primary-white"
          : "bg-primary-white text-primary-black-700 "
      }  w-full  `}
      style={{ overflowY: "auto" }}
    >
      <Router>
        <Navbar
          name={userName}
          imgSrc={userProfileUrl}
          setprimaryTheme={setprimaryTheme}
          primaryTheme={primaryTheme}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                stepPageCount={stepPageCount}
                setstepPageCount={setstepPageCount}
              />
            }
          />
          <Route
            path="/signIn"
            element={
              <SignInpage
                setstepPageCount={setstepPageCount}
                stepPageCount={stepPageCount}
                primaryTheme={primaryTheme}
              />
            }
          />
          <Route
            path="/getUrOtp"
            element={
              <GetOtpPage
                setstepPageCount={setstepPageCount}
                stepPageCount={stepPageCount}
                primaryTheme={primaryTheme}
              />
            }
          />
          <Route
            path="/enterName"
            element={
              <NamePage
                stepPageCount={stepPageCount}
                setstepPageCount={setstepPageCount}
                primaryTheme={primaryTheme}
              />
            }
          />
          <Route
            path="/loginPage"
            element={
              <LoginPage
                stepPageCount={stepPageCount}
                setstepPageCount={setstepPageCount}
                primaryTheme={primaryTheme}
              />
            }
          />
          <Route
            element={<MainHome primaryTheme={primaryTheme} />}
            path="/home"
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
