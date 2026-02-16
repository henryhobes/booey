"use client";

import { UseCaseQuestion } from "@/types";

interface ImageSelectQuestionProps {
  question: UseCaseQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function ImageSelectQuestion({
  question,
  value,
  onChange,
}: ImageSelectQuestionProps) {
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
          <span className="label-text-alt text-base-content/70 whitespace-normal break-words">
            {question.helperText}
          </span>
        </label>
      )}

      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2"
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
              className={`rounded-xl p-4 min-h-[48px] flex flex-col items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                isSelected
                  ? "bg-primary text-primary-content font-bold"
                  : "bg-accent text-base-content border-2 border-accent hover:border-primary/30 hover:bg-accent/80"
              }`}
            >
              {icons[i] && (
                <span className="text-3xl md:text-4xl">{icons[i]}</span>
              )}
              <span className="text-base text-center">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
