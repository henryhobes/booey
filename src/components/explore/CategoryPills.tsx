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
    <div className="sticky top-0 z-30 bg-base-100/95 backdrop-blur-sm border-b border-base-200">
      <div
        ref={scrollRef}
        className="mx-auto max-w-4xl flex gap-2 overflow-x-auto px-4 py-3 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
              className={`shrink-0 rounded-full px-5 min-h-[48px] text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary whitespace-nowrap ${
                isSelected
                  ? "bg-primary text-primary-content font-bold"
                  : "border-2 border-base-300 text-base-content/60 hover:border-base-content/40 hover:text-base-content/80"
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
