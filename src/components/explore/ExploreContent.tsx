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

function UseCaseCard({ uc }: { uc: UseCase }) {
  return (
    <Link
      href={`/use/${uc.id}`}
      aria-label={`Try ${uc.title}: ${uc.description}`}
      className="flex items-start gap-4 p-4 rounded-2xl bg-base-200 hover:bg-base-300 lg:hover:shadow-md lg:motion-safe:hover:-translate-y-0.5 motion-safe:transition-all min-h-[64px] focus:ring-2 focus:ring-primary focus:outline-none"
    >
      <span className="text-[32px] leading-none shrink-0" aria-hidden="true">
        {uc.icon}
      </span>
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-base-content leading-tight">
          {uc.title}
        </h3>
        <p className="text-base text-base-content/70 line-clamp-2 mt-0.5">
          {uc.description}
        </p>
        <span className="badge badge-accent text-base-content mt-1.5">
          {uc.categoryLabel}
        </span>
      </div>
    </Link>
  );
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

      <div className="mx-auto max-w-4xl lg:max-w-6xl px-4 py-8">
        {/* Featured Section */}
        {filteredFeatured.length > 0 && (
          <section className="mb-10 lg:mb-12 lg:rounded-2xl lg:bg-base-200/50 lg:p-6 lg:-mx-2">
            <h2 className="text-xl font-bold text-primary mb-4">Featured</h2>
            {/* Mobile: horizontal scroll strip */}
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory lg:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {filteredFeatured.map((uc) => (
                <Link
                  key={uc.id}
                  href={`/use/${uc.id}`}
                  aria-label={`Try ${uc.title}`}
                  className="snap-start shrink-0 w-32 card bg-base-200 border border-accent shadow-md hover:shadow-lg transition-shadow focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <div className="card-body p-3 items-center text-center">
                    <span className="text-3xl" aria-hidden="true">
                      {uc.icon}
                    </span>
                    <h3 className="text-sm font-bold leading-tight mt-2">
                      {uc.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            {/* Desktop: featured grid cards */}
            <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {filteredFeatured.map((uc) => (
                <Link
                  key={uc.id}
                  href={`/use/${uc.id}`}
                  aria-label={`Try ${uc.title}: ${uc.description}`}
                  className="card bg-base-100 border border-accent shadow-md hover:shadow-lg motion-safe:hover:-translate-y-0.5 motion-safe:transition-all focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <div className="card-body p-5 items-center text-center gap-2">
                    <span className="text-4xl" aria-hidden="true">
                      {uc.icon}
                    </span>
                    <h3 className="text-base font-bold leading-tight">
                      {uc.title}
                    </h3>
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {uc.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Tools Section */}
        <section id="all-tools">
          <h2 className="text-xl font-bold text-primary mb-4">
            {selectedCategory === "All" ? "All Tools" : selectedCategory}
          </h2>
          {filteredUseCases.length === 0 ? (
            <p className="text-base text-base-content/70 py-8 text-center">
              No tools in this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="All tools">
              {filteredUseCases.map((uc) => (
                <div key={uc.id} role="listitem">
                  <UseCaseCard uc={uc} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
