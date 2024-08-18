// voiceRecording.js
import axios from "axios";
import { NGROK_URL_BACKEND_URL } from "./ngrok_url";

axios.defaults.headers.common["Authorization"] =
  "Bearer 2knRKVCJLyGdMVwnxu6c7VN9d8o_4ouHeJmhZ7TuT1xruLu5e";
axios.defaults.headers.post["Content-Type"] = "application/json";

const recordAndSendTranscript = async () => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Stop automatically after detecting silence
      recognition.interimResults = false; // Only get final results
      recognition.lang = "en-US"; // Set language

      recognition.onresult = async (event) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = lastResult[0].transcript;

        try {
          const response = await axios.get(
            `${NGROK_URL_BACKEND_URL}api/get-restaurant-recommendations`,
            {
              headers: {
                "ngrok-skip-browser-warning": "69420",
              },
              params: { transcript: transcript },
            }
          );
          resolve(response.data);
        } catch (error) {
          console.error("Error sending transcript to server:", error);
          reject(error);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        reject(event.error);
      };

      recognition.onend = () => {
        console.log("Speech recognition service disconnected");
      };

      recognition.start();
      console.log("Speech recognition started");
    } else {
      alert("Your browser does not support speech recognition.");
      reject(new Error("Speech recognition not supported"));
    }
  });
};

export default recordAndSendTranscript;
