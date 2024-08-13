import { FaSearch, FaQuestionCircle, FaCalendarAlt } from "react-icons/fa";

export default function Features() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaSearch className="text-yellow-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Ask Us</h3>
            <p className="text-gray-600 mb-4">
              Tell us what you're in the mood for, and we’ll find the perfect
              meal for you.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaQuestionCircle className="text-yellow-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Get Suggestions</h3>
            <p className="text-gray-600 mb-4">
              Receive personalized meal suggestions based on your preferences
              and dietary needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaCalendarAlt className="text-yellow-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Plan Your Meals</h3>
            <p className="text-gray-600 mb-4">
              Plan your meals for the day or week and enjoy stress-free meal
              planning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
