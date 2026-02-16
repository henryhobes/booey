'use client';

import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import booeyAnimation from '@/assets/booey-logo.json';

const LOADING_MESSAGES = [
  "Analyzing your answers...",
  "Crafting your personalized response...",
  "Thinking through the best approach...",
  "Putting the finishing touches...",
  "Almost there..."
];

function getReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getReducedMotion);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

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
          <Lottie
            animationData={booeyAnimation}
            loop={!prefersReducedMotion}
            autoplay={!prefersReducedMotion}
            className="w-[120px] sm:w-[160px]"
            aria-hidden="true"
          />
          <div aria-live="polite">
            <h2 className="text-2xl font-bold mt-6 mb-2">{LOADING_MESSAGES[messageIndex]}</h2>
          </div>
          <p className="text-lg text-base-content/70">This usually takes 10-15 seconds</p>
        </div>
      </div>
    </div>
  );
}
