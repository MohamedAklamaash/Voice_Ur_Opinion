import { Theme } from "../../App";
import { useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Icon } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RoomCard from "../../components/RoomCard";
import StartRoomOverlay from "../../components/StartRoomOverlay";

type Props = {
  primaryTheme: Theme;
};

const MainHome = ({ primaryTheme }: Props) => {
  const [searchVoiceRooms, setsearchVoiceRooms] = useState<string>("");
  const [showModal, setshowModal] = useState<boolean>(false);
  const objects = [
    {
      title: "Meeting Room",
      roomCreater1: "Alice",
      roomCreator2: "Bob",
      onlineCount: 15,
    },
    {
      title: "Conference Room A",
      roomCreater1: "Charlie",
      roomCreator2: "David",
      onlineCount: 8,
    },
    {
      title: "Game Night",
      roomCreater1: "Eve",
      roomCreator2: "Frank",
      onlineCount: 20,
    },
    {
      title: "Study Group",
      roomCreater1: "Grace",
      roomCreator2: "Hank",
      onlineCount: 12,
    },
  ];

  return (
    <div className=" min-h-screen mt-2">
      <section className=" md:flex items-center justify-around p-2 ">
        <main className=" flex justify-center items-center md:gap-10 gap-2">
          <div className="">
            <h1 className=" font-poppins text-2xl">All Voice Rooms</h1>
            <hr className=" w-[100px] mb-1 bg-primary-indigo h-1" />
          </div>
          <div>
            <Icon
              component={SearchIcon}
              fontSize="large"
              className=" absolute text-black mt-[10px] ml-[10px]"
            />
            <input
              type="text"
              placeholder="Search for Rooms"
              className={`${
                primaryTheme === "dark"
                  ? " bg-primary-white text-primary-black-700"
                  : "bg-primary-black-700 text-primary-white"
              } px-10 py-4 rounded-full `}
              onChange={(e) => {
                setsearchVoiceRooms(e.target.value);
              }}
            />
          </div>
        </main>
        <section className=" max-md:flex items-center justify-end">
          <button className=" bg-primary-success p-2 rounded-full">
            <Icon component={PersonAddIcon} fontSize="medium" />{" "}
            <span
              className=" font-poppins text-lg"
              onClick={() => {
                setshowModal(!showModal);
              }}
            >
              Start a Room
            </span>
          </button>
        </section>
      </section>
      <div className=" grid md:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 justify-center items-center md:ml-[8%] max-md:ml-[20%] cursor-pointer ">
        {objects.map((obj, index) => {
          return (
            <RoomCard
              title={obj.title}
              roomCreater1={obj.roomCreater1}
              roomCreator2={obj.roomCreator2}
              onlineCount={obj.onlineCount}
            />
          );
        })}
      </div>
      <div className=" relative">
        {showModal && (
          <StartRoomOverlay setshowModal={setshowModal} showModal={showModal} primaryTheme={primaryTheme} />
        )}
      </div>
    </div>
  );
};

export default MainHome;
