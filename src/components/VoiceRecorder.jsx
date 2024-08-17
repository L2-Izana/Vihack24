import React, { useState, useRef, useEffect } from "react";

const SpeechToText = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Stop automatically after detecting silence
      recognitionRef.current.interimResults = false; // Only get final results
      recognitionRef.current.lang = "en-US"; // Set language

      recognitionRef.current.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        setTranscript(lastResult[0].transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition service disconnected");
        setRecording(false);
      };
    } else {
      alert("Your browser does not support speech recognition.");
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      console.log("Speech recognition started");
      setRecording(true);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        {recording ? "Recording..." : "Start Recording"}
      </button>
      {transcript && <p>Transcription: {transcript}</p>}
    </div>
  );
};

export default SpeechToText;
