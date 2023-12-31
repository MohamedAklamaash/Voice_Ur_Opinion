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
  _id?: string;
  isMuted?: boolean;
}

/*
  1) P2P needs to be done only for the users that are online,
  2) Need to update the state of the ui without ever refreshing it,--done
  3) need to add a green btn for the users that are online
  4) Muting and unmuting info should be relied b/w the users that are online --done
  5) Need to take the ref of the audio element and share audio data b/t the devices
  6) need to add logout btn for a mobile device
  7) The Overlay component is not working in mobile devices
  8) Need to add React Helmet
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
  const roomUsersRef = useRef<User[]>();
  const [doesRoomExist, setdoesRoomExist] = useState<boolean>(true);
  const { userName, email, userProfileUrl } = useSelector(
    (state: {
      user: { userName: string; email: string; userProfileUrl?: string };
    }) => state.user
  );

  // these are the set of  vars that are responsibe for webRTC
  const { captureMedia } = useWebRtc();
  const connections = useRef<Record<string, RTCPeerConnection | null>>({});
  const localMediaStream = useRef<MediaStream | null>(null);
  const audioElements = useRef<Record<string, HTMLAudioElement>>({});
  const getRoomDetails = useCallback(async () => {
    try {
      const response = await axios.get<{
        data: RoomData;
        userData: User[];
        success: boolean;
      }>(`http://localhost:8001/room/getRoomDetails/${id}`);
      const { data, userData, success } = response.data;
      setRoomData(data);
      setdoesRoomExist(success);
      setUserAlreadyInRoom(data.speakers.includes(userName));
      setUserData(userData);
      localMediaStream.current = await captureMedia();
      userData.map((usr, index) => {
        if (usr._id && !connections.current[usr._id]) {
          connections.current[usr._id] = null;
        }
      });
      socket.emit(socketActions.ADD_PEER, { roomId: id, users: userData });
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

  // window.addEventListener("beforeunload", (event) => {
  //   const message = "Are you sure you want to leave?";
  //   event.returnValue = message; // Standard for most browsers
  //   return message; // For some older browsers
  // });

  useEffect(() => {
    roomUsersRef.current = userData;
  }, [userData]);

  if (!doesRoomExist) {
    window.location.href = `http://localhost:5173/home?userName=${userName}&?profileUrl=${userProfileUrl}`;
  }

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
      const response = await axios.put(
        `http://localhost:8001/room/joinRoom/${id}`,
        {
          email,
        }
      );

      const { userData } = response.data;

      socket.emit(socketActions.JOIN, { roomId: id, user: userData });

      const iceServers: RTCIceServer[] = [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
      ];

      if (
        userData._id !== null 
      ) {
        const peerConnection = new RTCPeerConnection({ iceServers });

        connections.current[userData._id] = peerConnection;

        peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          console.log(event);
          
          if (event.candidate) {
            console.log("Ice candidate:",event.candidate);
            
            socket.emit(socketActions.ICE_CANDIDATE, {
              iceCandidate: event.candidate,
              peerId: userData._id,
              roomId: id,
            });
          }
        };

        peerConnection.ontrack = ({ streams: [remoteStreams] }) => {
          const currUser = roomUsersRef.current?.find(
            (usr) => usr._id === userData._id
          );

          if (currUser) {
            // need to handle ontrack logic for the current user if needed
          }

          const audioElement = audioElements.current[userData._id];

          if (audioElement) {
            audioElement.srcObject = remoteStreams;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[userData._id]) {
                audioElements.current[userData._id].srcObject = remoteStreams;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 300);
          }
        };

        const offer: RTCSessionDescriptionInit =
          await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        localStorage.setItem("localDescription", JSON.stringify(offer));

        socket.emit(socketActions.RELAY_SDP, {
          sessionDescription: offer,
          peerId: userData._id,
          roomId: id,
        });

        localMediaStream.current
          .getTracks()
          .forEach((track: MediaStreamTrack) => {
            peerConnection.addTrack(track, localMediaStream.current);
          });
      }

      await getRoomDetails();
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
            return { ...u, isMuted: !u.isMuted }; // Toggling the mute status
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

  const existingUserLeftTheRoom = useCallback(
    ({ users }: { users: User[] }) => {
      setUserData(users);
    },
    []
  );

  const handleIceCandidate = ({
    iceCandidate,
    peerId,
  }: {
    iceCandidate: any;
    peerId: string;
  }) => {
    connections.current[peerId]?.addIceCandidate(iceCandidate);
  };

  const setRemoteMedia = async ({
    peerId,
    remoteSessionDescription,
  }: {
    peerId: string;
    remoteSessionDescription: RTCSessionDescription;
  }) => {
    connections.current[peerId]?.setRemoteDescription(
      new RTCSessionDescription(remoteSessionDescription)
    );
    if (remoteSessionDescription.type === "offer") {
      const connection = connections.current[peerId];

      const answer = await connection.createAnswer();
      connection.setLocalDescription(answer);

      socket.emit(ACTIONS.RELAY_SDP, {
        peerId,
        sessionDescription: answer,
      });
    }
  };

  // useEffect(()=>{
  //   return()=>{
  //     localMediaStream.current?.getTracks().forEach(track => {
  //       track.stop();
  //     });
  //   }
  // })

  const provideRef = ({
    audioInstance,
    userId,
  }: {
    audioInstance: HTMLAudioElement;
    userId: string;
  }) => {
    audioElements.current[userId] = audioInstance;
  };

  const userMuteInfo = useCallback(({ users }: { users: User[] }) => {
    setUserData(users);
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
  }, [joinRoom, socket, leaveTheRoom, toggleMute]);

  return (
    <>
      <div className="min-h-screen p-10">
        <div className=" relative mt-10 md:flex items-center justify-end gap-10 p-7 mb-10 ">
          {roomData?.owner === userName ? (
            <>
              <button className="font-roboto text-lg font-bold bg-primary-indigo px-6 py-4 mr-10 max-md:mb-[5%] rounded-xl">
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
                  ref={(instance: HTMLAudioElement) => {
                    // Need Specify the type for ref instance for audio transmission
                    provideRef({ audioInstance: instance, userId: user._id });
                  }}
                  className=" max-md:hidden "
                  controls
                />
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
