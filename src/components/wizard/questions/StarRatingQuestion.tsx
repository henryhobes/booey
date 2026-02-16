"use client";

import { useState } from "react";
import { UseCaseQuestion } from "@/types";

interface StarRatingQuestionProps {
  question: UseCaseQuestion;
  value: number;
  onChange: (value: number) => void;
}

export default function StarRatingQuestion({
  question,
  value,
  onChange,
}: StarRatingQuestionProps) {
  const maxStars = question.max ?? 5;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleClick = (starIndex: number) => {
    // Tap same star to deselect
    if (value === starIndex) {
      onChange(0);
    } else {
      onChange(starIndex);
    }
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text text-lg font-medium whitespace-normal break-words">
          {question.label}
          {question.required && <span className="text-error ml-1">*</span>}
        </span>
      </label>

      {question.helperText && (
        <label className="label pt-0">
          <span className="label-text-alt text-base-content/70 whitespace-normal break-words">
            {question.helperText}
          </span>
        </label>
      )}

      <div
        className="flex justify-center gap-2 mt-4"
        role="radiogroup"
        aria-label={question.label}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {Array.from({ length: maxStars }, (_, i) => {
          const starNum = i + 1;
          const isFilled =
            hoverIndex !== null ? starNum <= hoverIndex : starNum <= value;
          return (
            <button
              key={starNum}
              type="button"
              role="radio"
              aria-checked={value === starNum}
              aria-label={`${starNum} star${starNum > 1 ? "s" : ""}`}
              onClick={() => handleClick(starNum)}
              onMouseEnter={() => setHoverIndex(starNum)}
              className="min-h-[48px] min-w-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition-transform hover:scale-110"
            >
              <span
                className={`text-3xl md:text-4xl transition-colors ${
                  isFilled ? "text-warning" : "text-base-300 opacity-50"
                }`}
              >
                ★
              </span>
            </button>
          );
        })}
      </div>

      {value > 0 && (
        <div className="text-center mt-2 text-base opacity-60">
          {value} of {maxStars}
        </div>
      )}
    </div>
  );
}
