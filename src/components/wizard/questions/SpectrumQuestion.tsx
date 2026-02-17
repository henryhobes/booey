"use client";

import { UseCaseQuestion } from "@/types";

interface SpectrumQuestionProps {
  question: UseCaseQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function SpectrumQuestion({
  question,
  value,
  onChange,
}: SpectrumQuestionProps) {
  const options = question.options ?? [];

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

      <div className="mt-4 px-2">
        {/* Gradient track — hidden on mobile where grid layout is used */}
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1.5 bg-gradient-to-r from-accent to-primary rounded-full" />

          <div
            className="relative grid grid-cols-2 md:flex md:justify-between gap-3"
            role="radiogroup"
            aria-label={question.label}
          >
            {options.map((option, i) => {
              const isSelected = value === option;
              const isAnchor = i === 0 || i === options.length - 1;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onChange(option)}
                  className="flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-xl p-1"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-primary text-primary-content scale-110 ring-2 ring-primary ring-offset-2 ring-offset-base-100"
                        : "bg-base-100 border-2 border-base-300 hover:border-primary/30"
                    }`}
                  >
                    <span className="text-base font-bold">{i + 1}</span>
                  </div>
                  <span
                    className={`text-base text-center leading-tight ${
                      isSelected
                        ? "font-bold text-primary"
                        : isAnchor
                          ? "font-medium"
                          : "opacity-60"
                    }`}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
