import { FaSearch } from "react-icons/fa";

export default function Suggestions() {
  return (
    <section id="suggestions" className="py-16 px-4 bg-yellow-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Today's Top Suggestions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaSearch className="text-yellow-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Recipe Name</h3>
            <p className="text-gray-600 mb-4">
              A brief description of this delicious meal suggestion to inspire
              you.
            </p>
            <a href="#" className="text-yellow-600 hover:underline">
              View Recipe
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaSearch className="text-yellow-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Recipe Name</h3>
            <p className="text-gray-600 mb-4">
              A brief description of this delicious meal suggestion to inspire
              you.
            </p>
            <a href="#" className="text-yellow-600 hover:underline">
              View Recipe
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaSearch className="text-yellow-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Recipe Name</h3>
            <p className="text-gray-600 mb-4">
              A brief description of this delicious meal suggestion to inspire
              you.
            </p>
            <a href="#" className="text-yellow-600 hover:underline">
              View Recipe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
