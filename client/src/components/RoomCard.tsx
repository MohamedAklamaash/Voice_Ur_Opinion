import DummyLogo from "../assets/DummyLogo.jpeg";

type Props = {
  title: string;
  owner: string;
};

//view specific details of the card in the Component
//This card lies in the Main Home

const RoomCard = ({ title, owner }: Props) => {
  return (
    <div className="mb-10 mt-3 flex items-center justify-center shadow-2xl p-5 ">
      <div className="grid grid-cols-4  gap-4">
        <div className="col-span-2">
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
          <span className="font-poppins text-lg">{owner}</span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
