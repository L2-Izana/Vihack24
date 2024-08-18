import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Features() {
  const navigate = useNavigate();

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={() => navigate("ask-us")}>
              <FaSearch className="text-yellow-600 text-5xl mb-4 mx-auto" />
            </button>
            <h3 className="text-xl font-semibold mb-2">Ask Us</h3>
            <p className="text-gray-600 mb-4">
              Tell us what you're in the mood for, and we’ll find the perfect
              meal for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
