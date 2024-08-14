import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInfos from "../components/user/UserInfos";

const ForYouPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("vihackapp-username") || "New User";

  const handleNavigate = (path) => {
    navigate(path);
  };

  const loginPrompt = (
    <div className="text-center my-4">
      <p className="text-gray-600 mb-2">
        Log in for a more personalized experience
      </p>
      <button
        onClick={() => navigate("/auth")}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Log In
      </button>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50 p-4">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4 text-center">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          {username}
        </h2>
        {username === "New User" && loginPrompt}
        <UserInfos clickToNavigate={handleNavigate} />
      </div>
    </div>
  );
};

export default ForYouPage;
