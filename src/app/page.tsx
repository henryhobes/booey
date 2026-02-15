import Link from "next/link";
import HowItWorks from "@/components/landing/HowItWorks";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import StickyCTA from "@/components/landing/StickyCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-base-100">
      {/* Hero Section */}
      <section className="hero min-h-[70vh] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-base-content">
              Get things done faster. No tech skills needed.
            </h1>
            <p className="py-6 text-lg md:text-xl text-base-content/70 max-w-xl mx-auto">
              Pick a tool, answer a few simple questions, and get your result in
              seconds.
            </p>
            <div id="hero-cta">
              <Link
                href="/explore"
                className="btn btn-primary btn-lg text-lg min-h-[56px] px-8 hover:scale-105 transition-transform focus:ring-2 focus:ring-primary focus:outline-none"
              >
                Explore Tools →
              </Link>
            </div>
            <p className="text-base mt-5 text-base-content/60">
              ✓ Free to use &nbsp; ✓ No signup required &nbsp; ✓ Works on any
              device
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Second CTA */}
      <section className="py-16 md:py-24 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-base-content">
            Ready to try?
          </h2>
          <Link
            href="/explore"
            className="btn btn-primary btn-lg text-lg min-h-[56px] px-8 hover:scale-105 transition-transform focus:ring-2 focus:ring-primary focus:outline-none"
          >
            Explore Tools →
          </Link>
          <p className="text-base text-base-content/60 mt-5">
            No account needed — try your first tool right now
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Sticky mobile CTA */}
      <StickyCTA />
    </div>
  );
}
