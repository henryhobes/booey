"use client";

import { UseCaseQuestion } from "@/types";

interface EmojiScaleQuestionProps {
  question: UseCaseQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function EmojiScaleQuestion({
  question,
  value,
  onChange,
}: EmojiScaleQuestionProps) {
  const options = question.options ?? [];
  const icons = question.icons ?? [];

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
          <span className="label-text-alt text-base-content/60 whitespace-normal break-words">
            {question.helperText}
          </span>
        </label>
      )}

      <div
        className="flex justify-between gap-2 mt-2"
        role="radiogroup"
        aria-label={question.label}
      >
        {options.map((option, i) => {
          const isSelected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option)}
              className={`flex-1 flex flex-col items-center gap-1 p-2 min-h-[48px] rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                isSelected
                  ? "bg-primary/10 ring-2 ring-primary"
                  : "hover:bg-accent/50"
              }`}
            >
              {icons[i] && (
                <span className="text-3xl md:text-4xl">{icons[i]}</span>
              )}
              <span
                className={`text-xs md:text-sm text-center leading-tight ${
                  isSelected ? "font-bold text-primary" : "opacity-70"
                }`}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
