import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Features() {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleClickHowItWorks = () => {
    setShowHowItWorks(!showHowItWorks);
    console.log(showHowItWorks);
  };

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
            <button onClick={handleClickHowItWorks}>
              <p className="text-blue-800 font-bold mb-4">How It Works</p>
            </button>
            {showHowItWorks && (
              <p className="text-blue-950 mb-4">
                Our system utilizes a blend of Machine Learning models to
                provide you with personalized meal recommendations. We start
                with K-Nearest Neighbors (KNN) to analyze your preferences, then
                employ advanced Deep Learning techniques in Natural Language
                Processing (NLP), including Named Entity Recognition (NER),
                BERT, and vectorization, to understand your needs in depth.
                Finally, we refine our model using Reinforcement Learning to
                ensure spot-on suggestions every time.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
