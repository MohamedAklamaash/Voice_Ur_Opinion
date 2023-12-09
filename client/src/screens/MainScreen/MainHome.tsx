import { Theme } from "../../App";
type Props = {
  setstepPageCount: (num: number) => void;
  stepPageCount: number;
  primaryTheme: Theme;
};

const MainHome = ({ stepPageCount, setstepPageCount, primaryTheme }: Props) => {
  return <div className=" min-h-screen">MainHome</div>;
};

export default MainHome;
