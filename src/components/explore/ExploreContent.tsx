"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CategoryPills from "./CategoryPills";

interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: string;
  categoryLabel: string;
}

interface ExploreContentProps {
  allUseCases: UseCase[];
  featuredUseCases: UseCase[];
  categories: string[];
}

export default function ExploreContent({
  allUseCases,
  featuredUseCases,
  categories,
}: ExploreContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredUseCases = useMemo(
    () =>
      selectedCategory === "All"
        ? allUseCases
        : allUseCases.filter((uc) => uc.categoryLabel === selectedCategory),
    [allUseCases, selectedCategory],
  );

  const filteredFeatured = useMemo(
    () =>
      selectedCategory === "All"
        ? featuredUseCases
        : featuredUseCases.filter((uc) => uc.categoryLabel === selectedCategory),
    [featuredUseCases, selectedCategory],
  );

  return (
    <>
      <CategoryPills
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-8">
          Explore Tools
        </h1>

        {/* Featured Section */}
        {filteredFeatured.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-base-content mb-4">⭐ Featured</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {filteredFeatured.map((uc) => (
                <Link
                  key={uc.id}
                  href={`/use/${uc.id}`}
                  aria-label={`Try ${uc.title}`}
                  className="snap-start shrink-0 w-44 card bg-base-200 shadow-md hover:shadow-lg transition-shadow focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <div className="card-body p-4 items-center text-center">
                    <span className="text-4xl" aria-hidden="true">
                      {uc.icon}
                    </span>
                    <h3 className="text-base font-bold leading-tight mt-2">
                      {uc.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Tools Section */}
        <section>
          <h2 className="text-xl font-bold text-base-content mb-4">
            {selectedCategory === "All" ? "All Tools" : selectedCategory}
          </h2>
          {filteredUseCases.length === 0 ? (
            <p className="text-base text-base-content/60 py-8 text-center">
              No tools in this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="All tools">
              {filteredUseCases.map((uc) => (
                <Link
                  key={uc.id}
                  href={`/use/${uc.id}`}
                  role="listitem"
                  aria-label={`Try ${uc.title}: ${uc.description}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-base-200 hover:bg-base-300 transition-colors min-h-[64px] focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <span className="text-[32px] leading-none shrink-0" aria-hidden="true">
                    {uc.icon}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-base-content leading-tight">
                      {uc.title}
                    </h3>
                    <p className="text-base text-base-content/70 line-clamp-1 mt-0.5">
                      {uc.description}
                    </p>
                    <span className="badge badge-outline mt-1.5">
                      {uc.categoryLabel}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
