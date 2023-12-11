import PersonIcon from "@mui/icons-material/Person";
import DummyLogo from "../assets/DummyLogo.jpeg";
import { Icon } from "@mui/material";

type Props = {
  title: string;
  roomCreater1: string;
  roomCreator2: string;
  onlineCount: number;
};

const RoomCard = ({
  title,
  roomCreater1,
  roomCreator2,
  onlineCount,
}: Props) => {
  return (
    <div className="mb-10 mt-3 flex items-center justify-center shadow-2xl p-5 ">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4">
          <h1 className="font-montserrat font-semibold  text-2xl text-primary-indigo ">
            {title}
          </h1>
        </div>
        <div className="col-span-1">
          <img
            src={DummyLogo}
            alt="DummtLogo"
            className="rounded-full w-32 h-32 object-scale-down  "
          />
          <span className="font-poppins text-lg">{roomCreater1}</span>
        </div>
        <div className="col-span-1">
          <img
            src={DummyLogo}
            alt="DummtLogo"
            className="rounded-full w-32 h-32 object-scale-down"
          />
          <span className="font-poppins text-lg">{roomCreator2}</span>
        </div>
        <div className=" flex items-center justify-start ">
          <Icon component={PersonIcon} fontSize="medium" />
          <p className=" text-lg">{onlineCount}</p>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
