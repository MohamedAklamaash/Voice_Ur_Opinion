import { useEffect, useState, FC, useCallback, useRef } from "react";
import { Theme } from "../App";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import MicOffIcon from "@mui/icons-material/MicOff";
import DummyLogo from "../assets/DummyLogo.jpeg";
import { Icon } from "@mui/material";
import { socket } from "../sockets/socket";
import { socketActions } from "../constants/Actions";
import { useWebRtc } from "../hooks/useWEBRTC";

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
  _id?: string; // Add an optional _id property
  isMuted?: boolean;
}

/*
  1) P2P needs to be done only for the users that are online,
  2) Need to update the state of the ui without ever refreshing it,--done
  3) need to add a green btn for the users that are online
  4) Muting and unmuting info should be relied b/w the users that are online
  5) Need to take the ref of the audio element and share audio data b/t the devices
  Note:
    -- UI must be updated properly when there is a change of state in the data of the existing users --done
*/

const RoomPage: FC<Props> = ({ primaryTheme }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [roomData, setRoomData] = useState<RoomData>({
    owner: "",
    title: "",
    speakers: [],
  });

  const [userData, setUserData] = useState<User[]>([]);
  const [userAlreadyInRoom, setUserAlreadyInRoom] = useState<boolean>(false);

  const { userName, email, userProfileUrl } = useSelector(
    (state: {
      user: { userName: string; email: string; userProfileUrl?: string };
    }) => state.user
  );

  // const { captureMedia } = useWebRtc();

  // const [audioStream, setaudioStream] = useState([]);
  // const audioRef = useRef();

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
      data.speakers.forEach((usr: string) => {
        initialMuteState[usr] = initialMuteState[usr] || false;
      });
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  }, [id, userName]);

  const leaveTheRoom = async () => {
    try {
      const {
        data: { userData },
      } = await axios.put(`http://localhost:8001/room/leaveRoom/${id}`, {
        email,
      });
      socket.emit(socketActions.LEAVE, { user: userData, roomId: id });
      window.location.href = `http://localhost:5173/home?userName=${userName}&?profileUrl=${userProfileUrl}`;
    } catch (error) {
      console.error("Error leaving the room:", error);
    }
  };

  const joinRoom = async () => {
    try {
      const {
        data: { userData },
      } = await axios.put(`http://localhost:8001/room/joinRoom/${id}`, {
        email,
      });
      socket.emit(socketActions.JOIN, { roomId: id, user: userData });

      window.location.reload();
    } catch (error) {
      console.error("Error joining the room:", error);
    }
  };

  useEffect(() => {
    getRoomDetails();
  }, [getRoomDetails]);

  const deleteARoom = useCallback(async () => {
    try {
      if (userName === roomData.owner) {
        await axios.delete(`http://localhost:8001/room/deleteARoom/${id}`);
      }
    } catch (error) {
      console.error("Error deleting the room:", error);
    }
  }, [userName, roomData, id]);

  const toggleMute = (user?: User) => {
    if (userName === roomData.owner || userName === user?.name) {
      setUserData((prevUserData) => {
        const updatedUserData = prevUserData.map((u) => {
          if (u.name === user?.name) {
            return { ...u, isMuted: !u.isMuted }; // Toggleing the mute status
          }
          return u;
        });
        return updatedUserData;
      });
    }
  };

  const newUserJoinded = useCallback(({ user }: { user: User }) => {
    setUserData((prev) => [...prev, user]);
  }, []);

  console.log(userData);

  const existingUserLeftTheRoom = useCallback(
    ({ users }: { users: User[] }) => {
      setUserData(users);
    },
    []
  );

  const userMuteInfo = useCallback(({ users }: { users: User[] }) => {
    console.log(users);
    // setUserData(users);
  }, []);

  useEffect(() => {
    socket.on(socketActions.JOIN, newUserJoinded);
    socket.on(socketActions.LEAVE, existingUserLeftTheRoom);
    socket.on(socketActions.MUTE_INFO, userMuteInfo);
    return () => {
      socket.off(socketActions.JOIN, newUserJoinded);
      socket.off(socketActions.LEAVE, existingUserLeftTheRoom);
      socket.off(socketActions.MUTE_INFO, userMuteInfo);
    };
  }, [
    joinRoom,
    socket,
    leaveTheRoom,
    userMuteInfo,
    toggleMute,
    newUserJoinded,
    existingUserLeftTheRoom,
    userMuteInfo,
  ]);

  return (
    <>
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
                      onClick={() => {}}
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
            // actually the obj properties of the room creator is different from the rest of the speakers in the room
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
                  muted={user?.isMuted}
                  ref={(instance: HTMLAudioElement | null) => {
                    // Specify the type for ref instance
                  }}
                  controls
                ></audio>
                <button
                  className="bg-blue-600 text-lg font-poppins rounded-full mt-2 mb-2 px-7 py-3"
                  onClick={() => {
                    socket.emit(socketActions.MUTE, {
                      roomId: id,
                      userId: user._id,
                    });
                    toggleMute(user);
                  }}
                >
                  {user?.isMuted === true ? (
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
    </>
  );
};

export default RoomPage;
