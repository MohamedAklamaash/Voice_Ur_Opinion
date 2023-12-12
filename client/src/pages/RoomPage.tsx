import React, { useEffect, useState } from "react";
import { Theme } from "../App";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// get specific details of the room component
type Props = {
  primaryTheme: Theme;
};

//need to properly update about the person whether joined and should be properly render out the page
//this component doesn't look nizz w.r.t the ui
//need to add how many users are there in that specific page

const RoomPage = ({ primaryTheme }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setroomData] = useState({});
  const { userName, email } = useSelector((state) => state.user);
  const [userAlreadyInRoom, setuserAlreadyInRoom] = useState<boolean>(false);
  const getRoomDetails = async () => {
    const {
      data: { data },
    } = await axios.get(`http://localhost:8001/room/getRoomDetails/${id}`);
    setroomData(data);
    if (roomData?.speakers.includes(userName)) {
      setuserAlreadyInRoom(true);
    }
  };

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
  }, [id]);

  const deleteARoom = async () => {
    if (userName === roomData?.owner) {
      await axios.delete(`http://localhost:8001/room/deleteARoom/${id}`);
    }
  };

  if (roomData?.owner === undefined) {
    return (
      <div>
        <div className=" fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center">
          Loading..
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className=" min-h-screen">
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
                Delete the Room{" "}
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
                    Leave the Room
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
        <main className=" p-10 grid grid-cols-2 max-md:grid-cols-1 ">
          <h1 className=" text-indigo-700 font-bold font-montserrat text-3xl ">
            {roomData?.owner}
          </h1>
          <h1 className=" font-bold text-3xl ">{roomData?.title}</h1>
        </main>
        <h1 className=" p-10 text-4xl font-bold">Speakers:</h1>
        <main className=" p-10 flex items-center  ">
          {roomData.speakers.map((speaker: string, index: number) => {
            return (
              <div
                key={index}
                className=" grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1"
              >
                <h1 className=" font-roboto text-2xl font-semibold text-primary-pink-500 ">
                  {speaker}
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