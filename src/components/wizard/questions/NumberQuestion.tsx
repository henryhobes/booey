import { useState, useEffect } from 'react';
import { UseCaseQuestion } from '@/types';

interface NumberQuestionProps {
  question: UseCaseQuestion;
  value: number | string;
  onChange: (value: number | string) => void;
}

export default function NumberQuestion({ question, value, onChange }: NumberQuestionProps) {
  // Keep raw input string locally to preserve intermediate states like "-" or "12."
  const [inputValue, setInputValue] = useState(String(value));
  
  // Sync local state when external value changes (e.g., navigation between questions)
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    // Update parent state with parsed number or empty string for validation
    if (val === '') {
      onChange('');
    } else {
      const parsed = Number(val);
      // Update parent with parsed number if valid, empty string if invalid
      // This ensures validation/submission always reflects current input state
      if (!isNaN(parsed)) {
        onChange(parsed);
      } else {
        onChange('');
      }
    }
  };
  
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text text-lg font-medium">
          {question.label}
          {question.required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      <input
        type="number"
        placeholder={question.placeholder}
        className="input input-bordered input-lg w-full text-lg"
        value={inputValue}
        onChange={handleChange}
        min={question.min}
        max={question.max}
        required={question.required}
      />
    </div>
  );
}
