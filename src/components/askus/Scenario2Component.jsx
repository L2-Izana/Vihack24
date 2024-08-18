import { budgetIcons } from "./icon.js";
import { fetchNearbyRestaurant } from "../../utils/location_fetching.js";
import { FaChevronRight, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { cuisineOptions, foodTypeOptions } from "..//user/user_feature_options";

export default function Scenario2Component({ handleStageChanging }) {
  const [buttonState, setButtonState] = useState("default"); // 'default', 'recording', 'calculating', 'done'
  const navigate = useNavigate();
  const [showUserForm, setUserForm] = useState(true);
  const handleRecommendClick = async () => {
    try {
      const collectedData = localStorage.getItem("vihackapp-collected-data");
      console.log(collectedData);
      const parsedData = JSON.parse(collectedData);
      const budgetLevel = parsedData["budget"];
      const foodTypes = parsedData["foodTypes"];
      const cuisines = parsedData["cuisines"];
      setButtonState("calculating");
      // Fetch nearby restaurant recommendations
      const restaurantRecommendations = await fetchNearbyRestaurant(
        budgetLevel,
        foodTypes,
        cuisines
      );
      // Wait for 2 seconds before navigating
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Navigate with the recommendations
      navigate("/recommendations", {
        state: { recommendations: restaurantRecommendations },
      });
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
    } finally {
      setButtonState("done"); // Ensure button state is set to "done" after completion
    }
  };

  const closeUserForm = () => {
    setUserForm(!showUserForm);
  };
  return (
    <div className="p-4 rounded-lg shadow-md max-w-lg mx-auto">
      <button
        type="button"
        className={`w-full py-2 px-4 rounded-lg text-lg flex items-center justify-center font-semibold transition-all duration-300 ${
          buttonState === "default"
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : buttonState === "loading"
            ? "bg-yellow-500 text-white"
            : buttonState === "calculating"
            ? "bg-orange-500 text-white"
            : "bg-green-500 text-white"
        }`}
        onClick={handleRecommendClick}
        disabled={buttonState !== "default"}
      >
        {buttonState === "default" && (
          <>
            <span>Recommend</span>
            <FaChevronRight className="ml-2" />
          </>
        )}
        {buttonState === "recording" && (
          <>
            <FaSpinner className="animate-spin mr-2" />
            <span>Recording...</span>
          </>
        )}
        {buttonState === "calculating" && (
          <>
            <FaSpinner className="animate-spin mr-2" />
            <span>Calculating...</span>
          </>
        )}
        {buttonState === "done" && (
          <>
            <FaCheckCircle className="mr-2" />
            <span>Done!</span>
          </>
        )}
      </button>
      {showUserForm ? (
        <UserForm closeUserForm={closeUserForm} />
      ) : (
        <small className="text-red-500 mt-5">
          Your preferences are safely saved! Let's check out greate
          recommendations
        </small>
      )}
    </div>
  );
}

// Optional (in case our model does not work good)
const UserForm = ({ closeUserForm }) => {
  const { register, handleSubmit } = useForm();
  const [foodTypes, setFoodTypes] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [budget, setBudget] = useState(1); // Initialize budget state

  const onSubmit = async (data) => {
    try {
      const collectedData = JSON.stringify({
        ...data,
        budget,
        foodTypes,
        cuisines,
      });
      localStorage.setItem("vihackapp-collected-data", collectedData);
      closeUserForm();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold my-6">How are you today?</h2>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Favorite Food Types:
          </label>
          <div className="flex flex-wrap gap-4">
            {foodTypeOptions.map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  {...register("foodTypes")}
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    setFoodTypes((prev) =>
                      checked
                        ? [...prev, value]
                        : prev.filter((item) => item !== value)
                    );
                  }}
                  className="form-checkbox h-5 w-5 text-pink-500"
                />
                <span className="ml-2 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Favorite Cuisines:
          </label>
          <div className="flex flex-wrap gap-4">
            {cuisineOptions.map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  {...register("cuisines")}
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    setCuisines((prev) =>
                      checked
                        ? [...prev, value]
                        : prev.filter((item) => item !== value)
                    );
                  }}
                  className="form-checkbox h-5 w-5 text-purple-500"
                />
                <span className="ml-2 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 text-white font-bold py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-300 focus:ring-opacity-50"
        >
          Save Information
        </button>
      </form>
    </div>
  );
};
