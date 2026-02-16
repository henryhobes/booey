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

  return (
    <div
      className={`fixed bottom-[calc(64px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-50 md:hidden bg-base-100/95 backdrop-blur-sm p-3 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-[calc(100%+64px+env(safe-area-inset-bottom,0px))]"
      }`}
      aria-hidden={!visible}
    >
      <Link
        href="/explore"
        className="btn btn-secondary btn-block text-lg min-h-[56px] focus:ring-2 focus:ring-secondary focus:outline-none"
        tabIndex={visible ? 0 : -1}
      >
        Explore Tools →
      </Link>
    </div>
  );
}
