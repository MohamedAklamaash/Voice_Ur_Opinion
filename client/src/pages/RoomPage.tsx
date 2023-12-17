import React, { useEffect, useState, FC, useCallback, useRef } from "react";
import { Theme } from "../App";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../sockets/socket";
import DummyLogo from "../assets/DummyLogo.jpeg";

// get specific details of the room component
type Props = {
  primaryTheme: Theme;
};

//need to properly update about the person whether joined and should be properly render out the page
//this component doesn't look nizz w.r.t the ui
//need to add how many users are there in that specific page
//what if we create this as a dialog box?
//need to add a green dialog to know that they are active
//added fc don't know how that works
//this is the component where all the main logic takes place
//need to implement in search functionality with that .includes() method

const RoomPage: FC<Props> = ({ primaryTheme }: Props) => {
  const speakerRef = useRef([]);
  const { id } = useParams();
  const [roomData, setroomData] = useState({});
  const [userData, setuserData] = useState([]);
  const navigate = useNavigate();
  const { userName, email, userProfileUrl } = useSelector(
    (state) => state.user
  );

  const [userAlreadyInRoom, setuserAlreadyInRoom] = useState<boolean>(false);
  const getRoomDetails = useCallback(async () => {
    const {
      data: { data, userData },
    } = await axios.get(`http://localhost:8001/room/getRoomDetails/${id}`);
    setroomData(data);
    if (data?.speakers.includes(userName)) {
      setuserAlreadyInRoom(true);
    }
    setuserData(userData);
  }, []);

  const leaveTheRoom = async () => {
    await axios.put(`http://localhost:8001/room/leaveRoom/${id}`, {
      email,
    });
  };

  const joinRoom = async () => {
    await axios.put(`http://localhost:8001/room/joinRoom/${id}`, {
      email,
    });
    window.location.reload();
  };

  useEffect(() => {
    getRoomDetails();
  }, []);
  console.log(userData);

  const deleteARoom = async () => {
    if (userName === roomData?.owner) {
      await axios.delete(`http://localhost:8001/room/deleteARoom/${id}`);
    }
  };

  if (roomData?.owner === undefined) {
    return (
      <div className=" min-h-screen bg-black">
        <div className=" fixed top-0 text-4xl bottom-0 right-0 left-0 flex items-center justify-center">
          Loading..
        </div>
      </div>
    );
  }

  const isUserInTheRoom = () => {
    if (roomData?.speakers.includes(userName)) {
      setuserAlreadyInRoom(true);
    }
  };

  socket.emit("joinedUser", { userName, email });

  socket.on("userJoined", (data) => {});

  return (
    <React.Fragment>
      <div className=" min-h-screen p-10 ">
        <div className=" relative mt-10 md:flex items-center justify-end gap-10 p-7 mb-10 ">
          {roomData?.owner === userName ? (
            <>
              <button className="font-roboto text-lg font-bold bg-primary-indigo px-6 py-4 rounded-xl">
                Update the Room
              </button>
              <button
                className=" font-roboto text-lg font-bold bg-primary-Darkred px-6 py-4 rounded-xl"
                onClick={() => {
                  deleteARoom();
                }}
              >
                <Link
                  to={`http://localhost:5173/home?userName=${userName}&?profileUrl=${userProfileUrl}`}
                >
                  Delete The Room{" "}
                </Link>
              </button>
            </>
          ) : (
            <>
              <button className="font-roboto text-lg font-bold bg-primary-indigo px-6 py-4 rounded-xl">
                {userAlreadyInRoom === true ? (
                  <span
                    onClick={() => {
                      leaveTheRoom();
                    }}
                  >
                    <Link
                      to={`http://localhost:5173/home?userName=${userName}&?profileUrl=${userProfileUrl}`}
                    >
                      Leave The Room{" "}
                    </Link>
                  </span>
                ) : (
                  <span
                    onClick={() => {
                      joinRoom();
                    }}
                  >
                    Join Room
                  </span>
                )}
              </button>
            </>
          )}
        </div>
        {/*    need to update the component below      */}
        <main className=" p-10 grid grid-cols-2 max-md:grid-cols-1 ">
          <h1 className=" text-indigo-700 font-bold font-montserrat text-3xl ">
            {roomData?.owner}
          </h1>
          <h1 className=" font-bold text-3xl ">{roomData?.title}</h1>
        </main>
        <h1 className=" p-10 text-4xl font-bold">Speakers:</h1>
        <main className=" p-10  grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1  ">
          {userData.map((user, index) => {
            return (
              <div
                key={index}
                className="flex items-center flex-col justify-between "
              >
                <img
                  src={user?.userProfileUrl || DummyLogo}
                  alt="User Profile"
                  className="rounded-full w-[100px] h-[100px] cursor-pointer p-4"
                />
                <audio
                  autoPlay
                  ref={(instance: HTMLAudioElement) => {}}
                  controls
                ></audio>
                <button>{"Mute"}</button>
                <h1 className=" font-roboto text-2xl font-semibold text-primary-pink-500 mb-10  ">
                  {user?.name.length > 10 ? user.name.split("") : user.name}
                </h1>
              </div>
            );
          })}
        </main>
      </div>
    </React.Fragment>
  );
};

export default RoomPage;
