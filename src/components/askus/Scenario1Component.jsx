import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function Scenario1Component({ handleStageChanging }) {
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
}
