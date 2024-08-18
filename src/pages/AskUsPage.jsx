import BackgroundImageSrc from "../assets/media/askus-backgroundimg.jpg";
import { useState } from "react";
import Scenario2Component from "../components/askus/Scenario2Component";

export default function AskUsPage() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleClickHowItWorks = () => {
    setShowHowItWorks(!showHowItWorks);
    console.log(showHowItWorks);
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
      <div className="bg-white bg-opacity-80 p-2 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          We’d Love to Hear From You!
        </h1>
        <Scenario2Component />
        <div className="text-center mt-4">
          <button onClick={handleClickHowItWorks}>
            <p className="text-blue-800 font-bold mb-4">How It Works</p>
          </button>

          {showHowItWorks && (
            <p className="text-blue-950 mb-4">
              Our system utilizes a blend of Machine Learning models to provide
              you with personalized meal recommendations. We start with
              K-Nearest Neighbors (KNN) to analyze your preferences, then employ
              advanced Deep Learning techniques in Natural Language Processing
              (NLP), including Named Entity Recognition (NER), BERT, and
              vectorization, to understand your needs in depth. Finally, we
              refine our model using Reinforcement Learning to ensure spot-on
              suggestions every time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
