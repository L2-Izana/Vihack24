// voiceRecording.js
import axios from "axios";

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
            "http://localhost:5000/api/get-ner-voice-record",
            { params: { transcript: transcript } }
          );
          resolve(response.data); // Return the result
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
