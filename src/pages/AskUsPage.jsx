import BackgroundImageSrc from "../assets/media/askus-backgroundimg.jpg";
import { useState } from "react";
import Scenario2Component from "../components/askus/Scenario2Component";
import Scenario1Component from "../components/askus/Scenario1Component";

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
          <Scenario1Component handleStageChanging={handleStageChanging} />
        ) : (
          <Scenario2Component />
        )}
      </div>
    </div>
  );
}
