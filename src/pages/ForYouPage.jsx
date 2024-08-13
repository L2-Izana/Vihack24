import React from "react";
import { useNavigate } from "react-router-dom";
import UserInfos from "../components/user/UserInfos";

const ForYouPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50 p-4">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4 text-center">
          Personal Settings
        </h2>
        <UserInfos clickToNavigate={handleNavigate} />
      </div>
    </div>
  );
};

export default ForYouPage;
