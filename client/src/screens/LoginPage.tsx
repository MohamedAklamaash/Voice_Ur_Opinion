import React from "react";
import { Theme } from "../App";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DummyLogo from "../assets/DummyLogo.jpeg";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setProfileUrl } from "../store/UserSlice";

type Props = {
  setstepPageCount: (num: number) => void;
  stepPageCount: number;
  primaryTheme: Theme;
};

const LoginPage = ({
  setstepPageCount,
  stepPageCount,
  primaryTheme,
}: Props) => {
  const navigate = useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userName = urlParams.get("name");
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    setLoading(true);

    if (image === "") {
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "qyde2sjh");
      setLoading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duhkiwuqq/image/upload",
        data
      );

      const imageUrl = response?.data?.secure_url;
      setUrl(imageUrl);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
      setError("Error uploading image. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];

    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024); // Convert to MB
      const allowedExtensions = ["png", "jpeg", "jpg", "webp"];

      if (fileSizeInMB > 2) {
        setError("File size should be less than 2MB");
      } else {
        const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
        if (fileExtension && allowedExtensions.includes(fileExtension)) {
          setFile(selectedFile);
          setError(null);
        } else {
          setError("Invalid file type. Allowed types: png, jpeg, jpg, webp");
        }
      }
    }
  };

  return (
    <div className="flex items-center min-h-screen justify-center flex-col relative">
      {loading && (
        <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      )}

      <div className="relative mb-10">
        {image === "" ? (
          <img
            src={DummyLogo}
            className="w-36 h-36 rounded-full mb-4"
            alt="Dummy Logo"
          />
        ) : (
          <img
            src={url}
            className="w-36 h-36 rounded-full mb-4"
            alt="User's Profile"
          />
        )}
        <input
          type="file"
          accept=".png,.jpeg,.jpg,.mkv,.svg"
          id="fileInput"
          className="hidden"
          onChange={(event: any) => {
            const selectedFile = event.target.files[0];
            if (selectedFile && selectedFile.type.startsWith("image/")) {
              setImage(selectedFile);
            } else {
              setError("Please select a valid image file.");
            }
          }}
        />
        <label
          htmlFor="fileInput"
          className="absolute bottom-0 right-0 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        >
          <span className="text-lg text-black rounded-full p-4">+</span>
        </label>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="bg-blue-500 text-white px-10 py-4 font-poppins text-xl rounded-full mt-4 mb-10 cursor-pointer"
        onClick={() => uploadImage()}
        disabled={loading}
      >
        Upload Image
      </button>
      <button
        className="rounded-full bg-primary-indigo px-10 cursor-pointer w-4/6 text-xl py-4 mb-10 font-montserrat"
        onClick={() => {
          setstepPageCount(stepPageCount + 1);
          if (url !== "") {
            dispatch(setProfileUrl(url));
          }
          navigate(`/home?userName=${userName}?profileUrl=${url}`);
        }}
      >
        Welcome{" "}
        <span className="text-primary-success font-bold font-roboto">
          {userName?.charAt(0).toLocaleUpperCase() + userName?.slice(1)}
        </span>
      </button>
    </div>
  );
};

export default LoginPage;
