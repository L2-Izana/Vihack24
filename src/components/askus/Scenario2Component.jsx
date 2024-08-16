import { FaChevronRight } from "react-icons/fa";
import { levelIcons, budgetIcons } from "./icon.js";
import { fetchNearbyRestaurant } from "../../utils/location_fetching.js";
import recordAndSendTranscript from "../../utils/voice_recording.js";

export default function Scenario2Component({ handleStageChanging }) {
  const handleRecommendClick = async () => {
    try {
      const result = await recordAndSendTranscript();
      console.log("Result from server:", result);
      const data = await fetchNearbyRestaurant();
      console.log(data);
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-lg mx-auto">
      <div className="mt-6">
        <button
          type="button"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-lg flex items-center justify-center"
          onClick={handleRecommendClick}
        >
          <span>Recommend</span>
          <FaChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
}

// Optional (in case our model does not work good)
const UserForm = () => {
  return (
    <div>
      {" "}
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
      </form>
    </div>
  );
};
