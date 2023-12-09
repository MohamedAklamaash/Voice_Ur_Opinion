import { useNavigate } from "react-router-dom";
interface Props {
  setstepPageCount: (num: number) => void;
  stepPageCount: number;
}
const Home = ({ stepPageCount, setstepPageCount }: Props) => {
  const navigate = useNavigate();
  return (
    <div className=" min-h-screen mx-auto mt-[10%] ">
      <section className=" md:w-[40%] max-md:w-[60%] flex flex-col shadow-2xl justify-center items-center max-md:mt-[10%] md:ml-[30%] max-md:ml-[24%] ">
        <h1 className=" font-poppins text-xl mb-10 text-center">
          Voice Your Opinion 🔥
        </h1>
        <h1 className=" tracking-wider mb-10 ml-10 mr-10 ">
          We’re working hard to get Voice Your Opinion ready for everyone! While
          we wrap up the finishing youches, we’re adding people gradually to
          make sure nothing breaks :)
        </h1>
        <button
          className=" rounded-full bg-primary-indigo px-10 py-4 mb-10 font - montserrat "
          onClick={() => {
            setstepPageCount(stepPageCount + 1);
            navigate("/signIn");
          }}
        >
          Get your username {`->`}
        </button>
        <a
          className=" mb-10 tracking-widest font-poppins cursor-pointer text-blue-500 "
          onClick={() => {
            navigate("/signIn");
          }}
        >
          Have an invite text?SignIn
        </a>
      </section>
    </div>
  );
};

export default Home;
