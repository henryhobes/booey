'use client';

import { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  "Analyzing your answers...",
  "Crafting your personalized response...",
  "Thinking through the best approach...",
  "Putting the finishing touches...",
  "Almost there..."
];

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500); // Rotate every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center p-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <h2 className="text-2xl font-bold mt-6 mb-2">{LOADING_MESSAGES[messageIndex]}</h2>
          <p className="text-lg opacity-70">This usually takes 10-15 seconds</p>
        </div>
      </div>
    </div>
  );
}
