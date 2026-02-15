"use client";

import { useState, useTransition } from "react";
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

function UseCaseCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-xl" aria-hidden="true">
      <div className="card-body">
        <div className="skeleton h-12 w-12 mb-3"></div>
        <div className="skeleton h-6 w-3/4 mb-2"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-5/6"></div>
      </div>
    </div>
  );
}

export default function UseCaseGrid({ useCases }: UseCaseGridProps) {
  const [activeCategory, setActiveCategory] = useState<UseCaseCategory | "all">("all");
  const [isPending, startTransition] = useTransition();

  const filteredUseCases =
    activeCategory === "all"
      ? useCases
      : useCases.filter((uc) => uc.category === activeCategory);

  function handleFilterChange(category: UseCaseCategory | "all") {
    startTransition(() => {
      setActiveCategory(category);
    });
  }

  return (
    <>
      <CategoryFilter
        activeCategory={activeCategory}
        onFilterChange={handleFilterChange}
      />

      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading use cases">
          {[...Array(6)].map((_, i) => (
            <UseCaseCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredUseCases.length === 0 ? (
        <div className="text-center py-16" role="status">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold mb-2">No use cases yet</h3>
          <p className="text-base-content/70 mb-6">
            We don&apos;t have any tools in this category yet, but check back soon!
          </p>
          <button
            onClick={() => handleFilterChange("all")}
            className="btn btn-primary hover:scale-105 transition-transform focus:ring-2 focus:ring-primary focus:outline-none"
          >
            View All Tools
          </button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="AI tools"
        >
          {filteredUseCases.map((useCase) => (
            <Link
              key={useCase.id}
              href={`/use/${useCase.id}`}
              role="listitem"
              aria-label={`Try ${useCase.title}: ${useCase.description}`}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer group focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <div className="card-body">
                <div className="text-5xl mb-3" aria-hidden="true">{useCase.icon}</div>
                <h3 className="card-title text-lg md:text-xl text-base-content group-hover:text-primary transition-colors whitespace-normal break-words">
                  {useCase.title}
                </h3>
                <p className="text-base-content/70 line-clamp-2">
                  {useCase.description}
                </p>
                <div className="card-actions mt-4">
                  <span className="badge badge-outline">{useCase.category}</span>
                </div>
                <div className="mt-2 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                  Try it →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
