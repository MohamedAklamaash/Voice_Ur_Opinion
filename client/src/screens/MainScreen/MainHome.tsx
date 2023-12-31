import { Theme } from "../../App";
import { useState, useEffect } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Icon } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RoomCard from "../../components/RoomCard";
import StartRoomOverlay from "../../components/StartRoomOverlay";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
type Props = {
  primaryTheme: Theme;
};

// get all public rooms and display it in the Main Home Page -- done

//need to implement searching option in the main home component --done

const MainHome = ({ primaryTheme }: Props) => {
  const [searchVoiceRooms, setsearchVoiceRooms] = useState<string>("");
  const [showModal, setshowModal] = useState<boolean>(false);
  const [publicRooms, setpublicRooms] = useState([]);

  const { userName, phoneNumber, email, userProfileUrl } = useSelector(
    (state) => state.user
  );

  if (userName === "") {
    window.location.href = "/";
  }

  const activateUser = async () => {
    const { data } = await axios.post(
      `http://localhost:8001/userActivation/activateUser`,
      {
        name: userName,
        email,
        userProfileUrl,
        phoneNumber,
      }
    );
  };
  const getAllPublicRooms = async () => {
    const {
      data: { data },
    } = await axios.get(`http://localhost:8001/room/getAllRooms`);
    setpublicRooms(data);
  };

  useEffect(() => {
    getAllPublicRooms();
  }, []);
  useEffect(() => {
    activateUser();
  }, []);

  useEffect(() => {
    if (searchVoiceRooms === "") {
      getAllPublicRooms();
    } else {
      const filteredData = publicRooms.filter((pub) =>
        pub.title.includes(searchVoiceRooms)
      );
      setpublicRooms(filteredData);
    }
  }, [searchVoiceRooms]);

  return (
    <div className=" min-h-screen mt-2">
      <section className=" md:flex items-center justify-around p-2 ">
        <main className=" mt-3 flex justify-center items-center md:gap-10 gap-2 mb-3 max-md:block ">
          <div className="mb-3">
            <h1 className=" font-poppins text-2xl">All Voice Rooms</h1>
            <hr className=" w-[100px] mb-1 bg-primary-indigo h-1" />
          </div>
          <div className=" flex items-center max-w-3xl justify-between  ">
           
            <input
              type="text"
              placeholder="Search for Rooms"
              className={`${
                primaryTheme === "dark"
                  ? " bg-primary-white text-primary-black-700"
                  : "bg-primary-black-700 text-primary-white"
              } px-7 py-4 rounded-full `}
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
      <div className=" grid md:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 justify-center items-center md:ml-[8%] max-md:ml-[20%] mr-[10%] gap-10 cursor-pointer ">
        {publicRooms.map((obj, index) => {
          return (
            <div key={index} className=" flex justify-center items-center">
              <Link to={`/room/${obj._id}`}>
                <RoomCard title={obj?.title} owner={obj?.roomCreater1} />
              </Link>
            </div>
          );
        })}
      </div>
      {/*     Need to create a optimum overlay for a mobile device   */}
      <div className="relative">
        {showModal && (
          <StartRoomOverlay
            setshowModal={setshowModal}
            showModal={showModal}
            primaryTheme={primaryTheme}
          />
        )}
      </div>
    </div>
  );
};

export default MainHome;
