"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StickyCTA() {
  const [heroHidden, setHeroHidden] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const heroBtn = document.getElementById("hero-cta");
    const footer = document.querySelector("footer");
    const nav = document.querySelector(".mobile-bottom-nav");
    let cleanupResize: (() => void) | undefined;

    // Measure nav height
    if (nav) {
      const updateHeight = () => setNavHeight(nav.getBoundingClientRect().height);
      updateHeight();
      // Re-measure on resize (nav height can change)
      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(nav);
      // Cleanup resize observer in the return function below
      cleanupResize = () => resizeObserver.disconnect();
    }

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
      cleanupResize?.();
    };
  }, []);

  const visible = heroHidden && !footerVisible;

  return (
    <div
      className={`fixed left-0 right-0 z-50 md:hidden bg-base-100/95 backdrop-blur-sm px-4 pb-3 pt-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-[200%]"
      }`}
      style={{ bottom: `${navHeight}px` }}
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
