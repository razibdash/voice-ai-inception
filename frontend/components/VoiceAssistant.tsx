"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");

  const recognition =
    typeof window !== "undefined"
      ? new (window as any).webkitSpeechRecognition()
      : null;

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);

      const res = await axios.post("http://localhost:5000/api/ai/chat", {
        query: transcript,
      });

      speak(res.data.data);
    };
  }, []);

  const startListening = () => {
    setListening(true);
    recognition.start();
  };

  const speak = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;
    speechSynthesis.speak(speech);
  };

  return (
    <div className="p-5">
      <button
        onClick={startListening}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        🎤 {listening ? "Listening..." : "Start Talking"}
      </button>

      <p className="mt-4">You said: {text}</p>
    </div>
  );
}