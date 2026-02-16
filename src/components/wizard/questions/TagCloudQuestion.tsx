"use client";

import { useState, useRef, useEffect } from "react";
import { UseCaseQuestion } from "@/types";

interface TagCloudQuestionProps {
  question: UseCaseQuestion;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function TagCloudQuestion({
  question,
  value,
  onChange,
}: TagCloudQuestionProps) {
  const options = question.options ?? [];
  const maxSelections = question.maxSelections;
  const atCap = maxSelections !== undefined && value.length >= maxSelections;

  const [isOtherMode, setIsOtherMode] = useState(false);
  const [otherText, setOtherText] = useState("");
  const otherInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOtherMode) {
      otherInputRef.current?.focus();
    }
  }, [isOtherMode]);

  // Check if a value is a custom "other" entry (not in predefined options)
  const isOtherEntry = (v: string) => !options.includes(v);

  // Initialize other text from existing custom entries
  useEffect(() => {
    const customEntry = value.find(isOtherEntry);
    if (customEntry) {
      setIsOtherMode(true);
      setOtherText(customEntry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else if (!atCap) {
      onChange([...value, option]);
    }
  };

  const handleOtherToggle = () => {
    if (isOtherMode) {
      // Remove custom entry
      setIsOtherMode(false);
      onChange(value.filter((v) => !isOtherEntry(v)));
      setOtherText("");
    } else {
      setIsOtherMode(true);
    }
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    // Replace any existing custom entry with new text
    const withoutCustom = value.filter((v) => !isOtherEntry(v));
    if (text.trim()) {
      onChange([...withoutCustom, text.trim()]);
    } else {
      onChange(withoutCustom);
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
          <span className="label-text-alt text-base-content/60 whitespace-normal break-words">
            {question.helperText}
          </span>
        </label>
      )}

      {maxSelections && (
        <div className="text-sm opacity-60 mb-2">
          {value.length} of {maxSelections} selected
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-2" role="group" aria-label={question.label}>
        {options.map((option) => {
          const isSelected = value.includes(option);
          const isDisabled = !isSelected && atCap;
          return (
            <button
              key={option}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              disabled={isDisabled}
              onClick={() => handleToggle(option)}
              className={`rounded-full px-5 min-h-[48px] text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                isSelected
                  ? "bg-primary text-primary-content font-bold"
                  : isDisabled
                    ? "bg-base-200 text-base-content/30 cursor-not-allowed"
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
            role="checkbox"
            aria-checked={isOtherMode}
            onClick={handleOtherToggle}
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
          value={otherText}
          onChange={(e) => handleOtherTextChange(e.target.value)}
        />
      )}
    </div>
  );
}
