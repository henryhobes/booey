"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Depends on id="hero-cta" in src/app/page.tsx hero section
    const heroBtn = document.getElementById("hero-cta");
    if (!heroBtn) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(heroBtn);
    return () => observer.disconnect();
  }, []);

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
