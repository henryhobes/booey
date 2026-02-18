"use client";

import { useRef, useCallback } from "react";

interface CategoryPillsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (category: string) => {
      onSelect(category);
    },
    [onSelect],
  );

  const allCategories = ["All", ...categories];

  return (
    <div className="bg-base-100 border-b border-base-200">
      <div
        ref={scrollRef}
        className="mx-auto max-w-4xl lg:max-w-6xl flex gap-2 overflow-x-auto md:flex-wrap md:overflow-x-visible px-4 py-3 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        role="tablist"
        aria-label="Filter by category"
      >
        {allCategories.map((category) => {
          const isSelected = category === selected;
          return (
            <button
              key={category}
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleSelect(category)}
              className={`shrink-0 md:shrink rounded-full px-5 md:px-4 min-h-[48px] md:min-h-[40px] text-base md:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary whitespace-nowrap ${
                isSelected
                  ? "bg-primary text-primary-content font-bold"
                  : "bg-accent text-base-content border-2 border-accent hover:border-primary/30 hover:bg-accent/80"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
