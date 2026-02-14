"use client";

import { useState } from "react";
import Link from "next/link";
import useCases from "@/data/use-cases.json";
import CategoryFilter from "@/components/CategoryFilter";
import type { UseCaseCategory } from "@/types";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<UseCaseCategory | "all">("all");

  const filteredUseCases =
    activeCategory === "all"
      ? useCases
      : useCases.filter((uc) => uc.category === activeCategory);

  return (
    <div className="bg-base-100">
      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold leading-tight text-base-content lg:text-6xl">
              AI tools for everyday life
            </h1>
            <p className="py-6 text-xl text-base-content/80 lg:text-2xl">
              Simple, guided tools that help you get things done. No tech skills needed, 
              no confusing prompts. Just answer a few questions and let AI do the work.
            </p>
            <Link 
              href="#use-cases" 
              className="btn btn-primary btn-lg text-lg"
            >
              Try one free — no account needed
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section id="use-cases" className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <h2 className="mb-12 text-center text-3xl font-bold text-base-content lg:text-4xl">
          What can Booey help you with?
        </h2>

        <CategoryFilter
          activeCategory={activeCategory}
          onFilterChange={setActiveCategory}
        />
        
        {filteredUseCases.length === 0 ? (
          <p className="text-center text-base-content/70 py-12">
            No use cases in this category yet. Try &ldquo;All&rdquo; to see everything!
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUseCases.map((useCase) => (
              <Link
                key={useCase.id}
                href={`/use/${useCase.id}`}
                className="card bg-base-100 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="card-body">
                  <div className="text-5xl mb-3">{useCase.icon}</div>
                  <h3 className="card-title text-xl text-base-content">
                    {useCase.title}
                  </h3>
                  <p className="text-base-content/70">
                    {useCase.description}
                  </p>
                  <div className="card-actions mt-4">
                    <span className="text-primary font-medium text-sm">
                      Try it →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Additional CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-base-content/70 mb-4">
            Pick any tool above to get started — no signup required for your first try
          </p>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="bg-base-200 py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-base-content">
            AI without the hassle
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Guided Questions</h3>
              <p className="text-base-content/70">
                Just answer simple questions. No need to craft the perfect prompt.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-base-content/70">
                Get helpful, personalized answers in seconds.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
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
