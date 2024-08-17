import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTachometerAlt, FaCompass } from "react-icons/fa";

const BottomNavBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-md">
      <div className="flex justify-around py-2">
        <Link
          to="/for-you"
          className="flex flex-col items-center text-gray-600 hover:text-yellow-600"
        >
          <FaHome className="text-2xl" />
          <span className="text-xs">For You</span>
        </Link>
        <Link
          to="/dashboard"
          className="flex flex-col items-center text-gray-600 hover:text-yellow-600"
        >
          <FaTachometerAlt className="text-2xl" />
          <span className="text-xs">Dashboard</span>
        </Link>
        <Link
          to="/"
          className="flex flex-col items-center text-gray-600 hover:text-yellow-600"
        >
          <FaCompass className="text-2xl" />
          <span className="text-xs">Discover</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavBar;
