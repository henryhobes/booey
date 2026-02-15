import Link from "next/link";
import useCases from "@/data/use-cases.json";
import UseCaseGrid from "@/components/UseCaseGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PrivacySection from "@/components/landing/PrivacySection";
import TrustBadges from "@/components/landing/TrustBadges";

export default function Home() {
  // Strip sensitive data (systemPrompts) before passing to client component
  const useCaseCards = useCases.map(({ id, title, description, icon, category }) => ({
    id,
    title,
    description,
    icon,
    category,
  }));

  return (
    <div className="bg-base-100">
      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-base-content">
              Get things done faster, no tech skills needed
            </h1>
            <p className="py-6 text-lg md:text-xl lg:text-2xl text-base-content/80">
              Answer a few simple questions, and our smart assistant does the work. 
              No confusing prompts, no wrong answers — just helpful results in seconds.
            </p>
            <Link 
              href="#use-cases" 
              className="btn btn-primary btn-lg text-lg hover:scale-105 transition-transform focus:ring-2 focus:ring-primary focus:outline-none"
            >
              Try your first tool — free, no signup
            </Link>
            <p className="text-sm mt-4 text-base-content/60">
              ✓ No credit card  ✓ No installation  ✓ Works on any device
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section id="use-cases" className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        <h2 className="mb-12 text-center text-2xl md:text-3xl lg:text-4xl font-bold text-base-content">
          What can Booey help you with?
        </h2>

        <UseCaseGrid useCases={useCaseCards} />

        {/* Additional CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-base-content/70 mb-4">
            Pick any tool above to get started — no signup required for your first try
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        <TestimonialsSection />
      </section>

      {/* Privacy Section */}
      <section className="bg-base-200 py-12 md:py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
          <PrivacySection />
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <TrustBadges />
      </section>

      {/* Value Proposition Section */}
      <section className="bg-base-200 py-12 md:py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-2xl md:text-3xl font-bold text-base-content">
            Smart help, without the hassle
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Guided Questions</h3>
              <p className="text-base-content/70">
                Just answer simple questions. No need to craft the perfect prompt.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-base-content/70">
                Get helpful, personalized answers in seconds.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Private & Safe</h3>
              <p className="text-base-content/70">
                Your information stays private. No training on your data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
