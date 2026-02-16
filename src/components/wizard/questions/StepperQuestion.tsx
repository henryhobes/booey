"use client";

import { useState } from "react";
import { UseCaseQuestion } from "@/types";

interface StepperQuestionProps {
  question: UseCaseQuestion;
  value: number;
  onChange: (value: number) => void;
}

export default function StepperQuestion({
  question,
  value,
  onChange,
}: StepperQuestionProps) {
  const step = question.step ?? 1;
  const min = question.min ?? 0;
  const max = question.max ?? Infinity;
  const unit = question.unit ?? "";

  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState(String(value));

  // Determine if unit is a prefix (currency symbols) or suffix
  const isPrefix = /^[$€£¥]$/.test(unit);

  const handleDecrement = () => {
    const next = value - step;
    if (next >= min) onChange(next);
  };

  const handleIncrement = () => {
    const next = value + step;
    if (next <= max) onChange(next);
  };

  const handleDirectInput = () => {
    setInputText(String(value));
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const parsed = Number(inputText);
    if (!isNaN(parsed)) {
      // Clamp to min/max and snap to step
      const clamped = Math.min(max, Math.max(min, parsed));
      const snapped = Math.round(clamped / step) * step;
      onChange(snapped);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const formatValue = (v: number) => {
    if (isPrefix) return `${unit}${v.toLocaleString()}`;
    if (unit) return `${v.toLocaleString()} ${unit}`;
    return v.toLocaleString();
  };

  const atMin = value <= min;
  const atMax = value >= max;

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

      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={atMin}
          aria-label="Decrease"
          className={`btn btn-circle btn-lg btn-outline min-h-[56px] w-[56px] text-2xl ${
            atMin ? "btn-disabled" : ""
          }`}
        >
          −
        </button>

        {isEditing ? (
          <input
            type="number"
            inputMode="numeric"
            className="input input-bordered text-center text-4xl font-bold w-48"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            min={min}
            max={max}
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={handleDirectInput}
            className="text-4xl font-bold text-primary min-w-[120px] text-center cursor-text hover:opacity-70 transition-opacity"
            aria-label={`Current value: ${formatValue(value)}. Click to type a value.`}
          >
            {formatValue(value)}
          </button>
        )}

        <button
          type="button"
          onClick={handleIncrement}
          disabled={atMax}
          aria-label="Increase"
          className={`btn btn-circle btn-lg btn-outline min-h-[56px] w-[56px] text-2xl ${
            atMax ? "btn-disabled" : ""
          }`}
        >
          +
        </button>
      </div>
    </div>
  );
}
