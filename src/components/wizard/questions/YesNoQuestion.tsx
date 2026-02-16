"use client";

import { UseCaseQuestion } from "@/types";

interface YesNoQuestionProps {
  question: UseCaseQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function YesNoQuestion({
  question,
  value,
  onChange,
}: YesNoQuestionProps) {
  const options = question.options ?? [];
  const descriptions = question.descriptions ?? [];

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
        className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2"
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
              className={`rounded-xl p-6 min-h-[80px] text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                isSelected
                  ? "bg-primary text-primary-content font-bold"
                  : "bg-accent text-primary border-2 border-accent hover:border-primary/30 hover:bg-accent/80"
              }`}
            >
              <div className="text-lg font-medium">{option}</div>
              {descriptions[i] && (
                <div
                  className={`text-sm mt-1 ${
                    isSelected ? "text-primary-content/80" : "opacity-60"
                  }`}
                >
                  {descriptions[i]}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
