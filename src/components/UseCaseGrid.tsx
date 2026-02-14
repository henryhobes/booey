"use client";

import { useState } from "react";
import Link from "next/link";
import CategoryFilter from "@/components/CategoryFilter";
import type { UseCaseCategory } from "@/types";

interface UseCaseCardData {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface UseCaseGridProps {
  useCases: UseCaseCardData[];
}

export default function UseCaseGrid({ useCases }: UseCaseGridProps) {
  const [activeCategory, setActiveCategory] = useState<UseCaseCategory | "all">("all");

  const filteredUseCases =
    activeCategory === "all"
      ? useCases
      : useCases.filter((uc) => uc.category === activeCategory);

  return (
    <>
      <CategoryFilter
        activeCategory={activeCategory}
        onFilterChange={setActiveCategory}
      />

      {filteredUseCases.length === 0 ? (
        <p className="text-center text-base-content/70 py-12">
          No use cases in this category yet. Try &ldquo;All&rdquo; to see everything!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUseCases.map((useCase) => (
            <Link
              key={useCase.id}
              href={`/use/${useCase.id}`}
              className="card bg-base-100 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 min-h-[44px]"
            >
              <div className="card-body">
                <div className="text-5xl mb-3">{useCase.icon}</div>
                <h3 className="card-title text-lg md:text-xl text-base-content">
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
    </>
  );
}
