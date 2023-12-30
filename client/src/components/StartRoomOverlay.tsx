import { Theme } from "../App";
import EarthPic from "../assets/EarthPic.avif";
import FriendsPic from "../assets/Friends.jpg";
import LockPic from "../assets/Lock.jpg";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../sockets/socket";
import { socketActions } from "../constants/Actions";
type Props = {
  setshowModal: (showModel: boolean) => void;
  showModal: boolean;
  primaryTheme: Theme;
};

type Room = "social" | "public" | "private";

//create a room here in this component

const StartRoomOverlay = ({ setshowModal, showModal, primaryTheme }: Props) => {
  const [selectRoom, setselectRoom] = useState<Room>("social");
  const navigate = useNavigate();
  const [title, settitle] = useState<string>("");
  const { email } = useSelector((state) => state.user);
  const createARoom = async () => {
    const {
      data: { data },
    } = await axios.post("http://localhost:8001/room/createARoom", {
      email,
      title,
      roomType: selectRoom,
    });
    
    socket.emit(socketActions.JOIN, {  roomId: data._id,user: data }); //the data here is actually the data about the room
    navigate(`/room/${data._id}`);
  };

  return (
    <div
      className={`p-10 fixed max-md:inline-block top-0 bottom-0 left-0 right-0  flex items-center  justify-center ${
        primaryTheme === "dark" ? " bg-dialog-bg" : " bg-dialog-bg "
      }  `}
    >
      <div className=" absolute left-[81%] md:top-[10%] md:p-10 max-md:p-6 max-md:text-lg md:text-4xl max-md:top-[-3%] ">
        <button
          onClick={() => {
            setshowModal(!showModal);
          }}
          className={` ${
            primaryTheme === "dark"
              ? "text-primary-white bg-black rounded-xl p-4"
              : "text-primary-black-700 bg-white rounded-xl p-4"
          } `}
        >
          X
        </button>
      </div>
      <div
        className={`${
          primaryTheme === "dark"
            ? " text-primary-black-700"
            : " text-primary-white"
        } p-6 border-b-2 rounded-3xl `}
      >
        <h1
          className={` font-poppins text-3xl ${
            primaryTheme === "dark"
              ? "  text-gradient-violet font-bold text-4xl "
              : " text-primary-white font-bold font-montserrat text-3xl"
          } mb-8 `}
        >
          Enter the topic to be disscussed
        </h1>
        <input
          type="text"
          className={` w-[90%] rounded-full px-10 py-4 ${
            primaryTheme === "dark"
              ? " bg-primary-black-700 text-primary-white"
              : " bg-primary-white text-primary-black-700 "
          } `}
          onChange={(e) => {
            settitle(e.target.value);
          }}
        />
        <section className=" mt-5 flex flex-grow max-md:grid max-md:grid-cols-1 justify-between place-items-center gap-10">
          <main
            className={`flex items-center ${
              selectRoom === "social"
                ? " bg-secondary-black-600 p-6 rounded-lg "
                : ""
            }   justify-center flex-col cursor-pointer`}
            onClick={() => {
              setselectRoom("social");
            }}
          >
            <img
              src={FriendsPic}
              className=" md:w-40 md:h-40 max-md:w-32 max-md:h-28"
            />
            <span
              className={`${
                primaryTheme === "dark"
                  ? " text-primary-white font-bold"
                  : "  text-white text-xl font-bold"
              } font-roboto text-lg p-3 `}
            >
              Social
            </span>
          </main>
          <main
            className={`flex items-center ${
              selectRoom === "public"
                ? " bg-secondary-black-600 p-6 rounded-lg"
                : ""
            }   justify-center flex-col cursor-pointer`}
            onClick={() => {
              setselectRoom("public");
            }}
          >
            <img
              src={EarthPic}
              className=" md:w-40 md:h-40 max-md:w-32 max-md:h-28"
            />
            <span
              className={`${
                primaryTheme === "dark"
                  ? " text-primary-white font-bold"
                  : "text-white text-xl font-bold"
              } font-roboto text-lg p-3 `}
            >
              Public
            </span>
          </main>
          <main
            className={`flex items-center ${
              selectRoom === "private"
                ? "bg-secondary-black-600 p-6 rounded-lg"
                : ""
            }   justify-center flex-col cursor-pointer`}
            onClick={() => {
              setselectRoom("private");
            }}
          >
            <img
              src={LockPic}
              className=" md:w-40 md:h-40 max-md:w-32 max-md:h-28"
            />
            <span
              className={`${
                primaryTheme === "dark"
                  ? " text-primary-white font-bold"
                  : " text-white text-xl font-bold"
              } font-roboto text-lg p-3 `}
            >
              Private
            </span>
          </main>
        </section>
        <div className=" flex items-center justify-between flex-col cursor-pointer">
          <h1
            className={`${
              primaryTheme === "dark"
                ? " text-primary-white font-bold"
                : " text-primary-white font-bold"
            }  text-2xl font-poppins p-2`}
          >
            Start a room, open to everyone 😎
          </h1>
          <button
            className={` ${
              primaryTheme === "dark"
                ? " text-primary-white font-bold"
                : " text-primary-black-700 font-bold"
            }  bg-primary-success px-8 py-4 rounded-3xl font-poppins`}
            onClick={() => {
              createARoom();
            }}
          >
            Let's Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartRoomOverlay;
