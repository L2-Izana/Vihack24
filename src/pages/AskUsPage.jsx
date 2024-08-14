import React from "react";
import BackgroundImageSrc from "../assets/media/askus-backgroundimg.jpg";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSmile,
  FaMeh,
  FaFrown,
  FaDollarSign,
  FaChevronRight,
} from "react-icons/fa";

export default function AskUsPage() {
  const [isScenario1, setIsScenario1] = useState(true);

  const handleStageChanging = () => {
    setIsScenario1(!isScenario1);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-gray-800 p-6 sm:p-8 md:p-12 overflow-hidden"
      style={{
        backgroundImage: `url(${BackgroundImageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          We’d Love to Hear From You!
        </h1>
        {isScenario1 ? (
          <Scenari1Component handleStageChanging={handleStageChanging} />
        ) : (
          <Scenario2Component />
        )}
      </div>
    </div>
  );
}

const levelIcons = {
  1: <FaFrown className="text-red-500" />,
  2: <FaMeh className="text-yellow-500" />,
  3: <FaSmile className="text-green-500" />,
  4: <FaSmile className="text-yellow-300" />,
  5: <FaSmile className="text-yellow-400" />,
};

const budgetIcons = {
  1: <FaDollarSign className="text-yellow-100" />,
  2: <FaDollarSign className="text-yellow-200" />,
  3: <FaDollarSign className="text-yellow-300" />,
  4: <FaDollarSign className="text-yellow-400" />,
  5: <FaDollarSign className="text-yellow-500" />,
};

const Scenario2Component = ({ handleStageChanging }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Please answer the following questions:
      </h2>

      <form className="space-y-6">
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Budget level</label>
          <div className="flex items-center justify-between mb-2">
            {Object.keys(budgetIcons).map((level) => (
              <div key={level} className="text-center">
                <div>{budgetIcons[level]}</div>
              </div>
            ))}
          </div>
          <input
            type="range"
            min="1"
            max="5"
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Mood</label>
          <div className="flex items-center justify-between mb-2">
            {Object.keys(levelIcons).map((level) => (
              <div key={level} className="text-center">
                <div>{levelIcons[level]}</div>
              </div>
            ))}
          </div>
          <input
            type="range"
            min="1"
            max="5"
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Food type</label>
          <select className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4">
            <option value="">Select food type</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="halal">Halal</option>
            <option value="kosher">Kosher</option>
            <option value="paleo">Paleo</option>
          </select>
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-lg flex items-center justify-center"
            onClick={handleStageChanging}
          >
            <span>Recommend</span>
            <FaChevronRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

const Scenari1Component = ({ handleStageChanging }) => {
  const navigate = useNavigate();
  return (
    <div>
      <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">
        What would you like?
      </p>
      <div className="space-y-4">
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-lg sm:text-xl"
          onClick={() => navigate("/ask-us/home")}
        >
          Home cooked meal
        </button>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-lg sm:text-xl"
          onClick={() => navigate("/ask-us/restaurant")}
        >
          Restaurant dining
        </button>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-lg sm:text-xl flex items-center justify-center"
          onClick={handleStageChanging}
        >
          <span className="flex items-center">
            Let us decide for you <FaSearch className="text-yellow-400 ml-2" />
          </span>
        </button>
      </div>
    </div>
  );
};
