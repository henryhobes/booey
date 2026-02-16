"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StickyCTA() {
  const [heroHidden, setHeroHidden] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const heroBtn = document.getElementById("hero-cta");
    const footer = document.querySelector("footer");

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroHidden(!entry.isIntersecting),
      { threshold: 0 }
    );

    const footerObserver = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    if (heroBtn) heroObserver.observe(heroBtn);
    if (footer) footerObserver.observe(footer);

    return () => {
      heroObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  const visible = heroHidden && !footerVisible;

  if (!visible) return null;

  return (
    <div className="px-4 pt-3 pb-1 border-b border-base-300/30">
      <Link
        href="/explore"
        className="btn btn-secondary btn-block text-lg min-h-[56px] text-white focus:ring-2 focus:ring-secondary focus:outline-none"
      >
        Explore Tools →
      </Link>
    </div>
  );
}
