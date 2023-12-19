import React, { useEffect, useState, FC, useCallback, useRef } from "react";
import { Theme } from "../App";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import MicOffIcon from "@mui/icons-material/MicOff";
import DummyLogo from "../assets/DummyLogo.jpeg";
import { Icon } from "@mui/material";
import { useWEBRTC } from "../hooks/useWEBRTC";
import { socket } from "../sockets/socket";
import { socketActions } from "../constants/Actions";
interface Props {
  primaryTheme: Theme;
}

interface RoomData {
  owner: string;
  title: string;
  speakers: string[];
}

interface User {
  name: string;
  userProfileUrl?: string;
}

const RoomPage: FC<Props> = ({ primaryTheme }: Props) => {
  const { id } = useParams<string>();
  const [roomData, setRoomData] = useState<RoomData>({
    owner: "",
    title: "",
    speakers: [],
  });

  const { capturemedia, muteClient, provideRef } = useWEBRTC();

  const [userData, setUserData] = useState<User[]>([]);
  const userRoomDetails = useRef({});
  const [userAlreadyInRoom, setUserAlreadyInRoom] = useState<boolean>(false);
  const [isUserMuted, setIsUserMuted] = useState<Record<string, boolean>>({});
  const { userName, email, userProfileUrl } = useSelector(
    (state: {
      user: { userName: string; email: string; userProfileUrl?: string };
    }) => state.user
  );

  const getRoomDetails = useCallback(async () => {
    try {
      const response = await axios.get<{ data: RoomData; userData: User[] }>(
        `http://localhost:8001/room/getRoomDetails/${id}`
      );
      const { data, userData } = response.data;
      setRoomData(data);
      setUserAlreadyInRoom(data.speakers.includes(userName));
      setUserData(userData);
      const storedIsUserMuted = sessionStorage.getItem("isUserMuted");
      const initialMuteState: Record<string, boolean> = storedIsUserMuted
        ? JSON.parse(storedIsUserMuted)
        : {};
      //await capturemedia();
      data.speakers.forEach((usr: string) => {
        initialMuteState[usr] = initialMuteState[usr] || false;
      });

      setIsUserMuted(initialMuteState);
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  }, [id, userName]);

  const leaveTheRoom = async () => {
    try {
      await axios.put(`http://localhost:8001/room/leaveRoom/${id}`, {
        email,
      });
      window.location.href = `http://localhost:5173/home?userName=${userName}&?profileUrl=${userProfileUrl}`;
    } catch (error) {
      console.error("Error leaving the room:", error);
    }
  };

  const joinRoom = async () => {
    try {
      await axios.put(`http://localhost:8001/room/joinRoom/${id}`, {
        email,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error joining the room:", error);
    }
  };

  useEffect(() => {
    getRoomDetails();
  }, []);

  useEffect(()=>{
    userRoomDetails.current = userData;
  },[userData]);

  useEffect(() => {
    sessionStorage.setItem("isUserMuted", JSON.stringify(isUserMuted));
  }, [isUserMuted]);

  const deleteARoom = useCallback(async () => {
    try {
      if (userName === roomData.owner) {
        await axios.delete(`http://localhost:8001/room/deleteARoom/${id}`);
      }
    } catch (error) {
      console.error("Error deleting the room:", error);
    }
  }, [userName, roomData, id]);

  const toggleMute = (targetUserName?: any) => {
    if (userName === roomData.owner || userName === targetUserName) {
      setIsUserMuted((prevIsUserMuted) => {
        const updatedState = {
          ...prevIsUserMuted,
          [targetUserName]: !prevIsUserMuted[targetUserName],
        };
        return updatedState;
      });
    }
  };

  return (
    <React.Fragment>
      <div className="min-h-screen p-10">
        <div className=" relative mt-10 md:flex items-center justify-end gap-10 p-7 mb-10 ">
          {roomData?.owner === userName ? (
            <>
              <button className="font-roboto text-lg font-bold bg-primary-indigo px-6 py-4 rounded-xl">
                Update the Room
              </button>
              <button
                className=" font-roboto text-lg font-bold bg-primary-Darkred px-6 py-4 rounded-xl"
                onClick={deleteARoom}
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
                  <span onClick={leaveTheRoom}>
                    <Link
                      to={`http://localhost:5173/home?userName=${userName}&?profileUrl=${userProfileUrl}`}
                    >
                      Leave The Room{" "}
                    </Link>
                  </span>
                ) : (
                  <span onClick={joinRoom}>Join Room</span>
                )}
              </button>
            </>
          )}
        </div>
        <main className=" p-10 grid grid-cols-2 max-md:grid-cols-1 ">
          <h1 className=" text-indigo-700 font-bold font-montserrat text-3xl ">
            {roomData?.owner}
          </h1>
          <h1 className=" font-bold text-3xl ">{roomData?.title}</h1>
        </main>
        <h1 className=" p-10 text-4xl font-bold">Speakers:</h1>{" "}
        <main className="p-10 grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1">
          {userData.map((user, index) => {
            socket.emit(socketActions.JOIN,{
              user,
              id
            })
            socket.on(socketActions.ADD_PEER,(data)=>{
              console.log(data);
            })
            return (
              <div
                key={index}
                className="flex items-center flex-col justify-between"
              >
                <img
                  src={user?.userProfileUrl || DummyLogo}
                  alt="User Profile"
                  className="rounded-full w-[100px] h-[100px] cursor-pointer p-4"
                />
                <audio
                  autoPlay
                  muted={isUserMuted[user?.name]}
                  ref={(instance: HTMLAudioElement) => {
                    provideRef({
                      audioInstance: instance,
                      clientId: user?._id,
                    });
                  }}
                  controls
                ></audio>
                <button
                  className="bg-blue-600 text-lg font-poppins rounded-full mt-2 mb-2 px-7 py-3"
                  onClick={() => toggleMute(user?.name)}
                >
                  {isUserMuted[user?.name] === true ? (
                    <Icon component={MicOffIcon} />
                  ) : (
                    <Icon component={MicOutlinedIcon} />
                  )}
                </button>
                <h1 className="font-roboto text-2xl font-semibold text-primary-pink-500 mb-10">
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
