import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Suggestions() {
  const navigate = useNavigate();
  return (
    <section id="suggestions" className="py-16 px-4 bg-yellow-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Today's Top Suggestions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaSearch className="text-yellow-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">
              Must-try restaurant today
            </h3>
            <p className="text-gray-600 mb-4">
              A brief description of this delicious restaurant suggestion for
              you.
            </p>
            <button
              onClick={() => navigate("/restaurant_detail/")}
              className="text-yellow-600 hover:text-yellow-400"
            >
              Check it out!
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaSearch className="text-yellow-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Home Cooked Meal</h3>
            <p className="text-gray-600 mb-4">
              A brief description of a delicious home cooked meal suggestion to
              inspire you.
            </p>
            <button
              onClick={() => navigate("/cook_recipe/")}
              className="text-yellow-600 hover:text-yellow-400"
            >
              Look it up!
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
