"use client";

import { useState, useRef, useEffect } from "react";
import { UseCaseQuestion } from "@/types";

interface SelectQuestionProps {
  question: UseCaseQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function SelectQuestion({
  question,
  value,
  onChange,
}: SelectQuestionProps) {
  const options = question.options ?? [];
  const isPredefined = options.includes(value);
  const [isOtherMode, setIsOtherMode] = useState(
    value !== "" && !isPredefined,
  );
  const otherInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOtherMode) {
      otherInputRef.current?.focus();
    }
  }, [isOtherMode]);

  function selectOption(option: string) {
    setIsOtherMode(false);
    onChange(option);
  }

  function enterOtherMode() {
    setIsOtherMode(true);
    onChange("");
  }

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text text-lg font-medium whitespace-normal break-words">
          {question.label}
          {question.required && <span className="text-error ml-1">*</span>}
        </span>
      </label>

      <div
        className="flex flex-wrap gap-3"
        role="radiogroup"
        aria-label={question.label}
      >
        {options.map((option) => {
          const isSelected = !isOtherMode && value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => selectOption(option)}
              className={`rounded-full px-5 min-h-[48px] text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                isSelected
                  ? "bg-primary text-primary-content font-bold"
                  : "bg-accent text-primary border-2 border-accent hover:border-primary/30 hover:bg-accent/80"
              }`}
            >
              {option}
            </button>
          );
        })}

        {question.allowOther && (
          <button
            type="button"
            role="radio"
            aria-checked={isOtherMode}
            onClick={enterOtherMode}
            className={`rounded-full px-5 min-h-[48px] text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              isOtherMode
                ? "bg-primary text-primary-content font-bold"
                : "bg-accent text-primary border-2 border-accent hover:border-primary/30 hover:bg-accent/80"
            }`}
          >
            Other
          </button>
        )}
      </div>

      {isOtherMode && (
        <input
          ref={otherInputRef}
          type="text"
          className="input input-bordered input-lg w-full mt-3 text-lg"
          placeholder="Type your answer..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.helperText && (
        <label className="label">
          <span className="label-text-alt text-base-content/60 whitespace-normal break-words">
            {question.helperText}
          </span>
        </label>
      )}
    </div>
  );
}
