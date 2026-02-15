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
      className={`fixed bottom-20 left-0 right-0 z-50 md:hidden bg-base-100/95 backdrop-blur-sm border-t border-base-300 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <Link
        href="/explore"
        className="btn btn-primary btn-block text-lg min-h-[56px] focus:ring-2 focus:ring-primary focus:outline-none"
        tabIndex={visible ? 0 : -1}
      >
        Explore Tools →
      </Link>
    </div>
  );
}
