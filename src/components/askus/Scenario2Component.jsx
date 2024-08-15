import {
  FaSmile,
  FaMeh,
  FaFrown,
  FaDollarSign,
  FaChevronRight,
} from "react-icons/fa";

import axios from "axios";

const levelIcons = {
  1: <FaFrown className="text-red-500" />,
  2: <FaMeh className="text-yellow-500" />,
  3: <FaSmile className="text-green-500" />,
  4: <FaSmile className="text-yellow-300" />,
  5: <FaSmile className="text-yellow-400" />,
};

const budgetIcons = {
  1: <FaDollarSign className="text-yellow-100" />,
  2: <FaDollarSign className="text-yellow-200" />,
  3: <FaDollarSign className="text-yellow-300" />,
  4: <FaDollarSign className="text-yellow-400" />,
  5: <FaDollarSign className="text-yellow-500" />,
};

export default function Scenario2Component({ handleStageChanging }) {
  const handleRecommendClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // Check if the browser supports SpeechRecognition
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US"; // Set the language
        recognition.interimResults = false; // We want final results only
        recognition.maxAlternatives = 1; // Number of alternative transcriptions to return

        recognition.onstart = () => {
          console.log("Speech recognition started");
        };
        recognition.onresult = (event) => {
          console.log("onresult event:", event); // Log the entire event object
          if (event.results.length > 0) {
            const transcript = event.results[0][0].transcript;
            console.log(transcript);
            axios.get("http://locahost:5000/api/get-ner", {
              params: {
                user_prompt: transcript,
              },
            });
            console.log("Transcript:", transcript);
          } else {
            console.log("No speech recognized");
          }
        };
        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
          console.log("Speech recognition ended");
        };

        axios
          .get("http://localhost:5000/api/fetch-nearby-restaurants", {
            params: {
              latitude: latitude,
              longitude: longitude,
            },
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            // Handle error
            console.error("There was an error making the request!", error);
          });
      });
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-lg mx-auto">
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
      </form>

      <div>
        <button id="start">Start Recording</button>
        <div id="result"></div>
        <script src="test_voice.js"></script>
      </div>
    </div>
  );
}
