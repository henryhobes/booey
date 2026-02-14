import { UseCaseQuestion } from '@/types';

interface SelectQuestionProps {
  question: UseCaseQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function SelectQuestion({ question, value, onChange }: SelectQuestionProps) {
  const inputId = `question-${question.id}`;
  
  return (
    <div className="form-control w-full">
      <label htmlFor={inputId} className="label">
        <span className="label-text text-lg font-medium">
          {question.label}
          {question.required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      <select
        id={inputId}
        className="select select-bordered select-lg w-full text-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={question.required}
      >
        <option value="" disabled>
          Choose an option...
        </option>
        {question.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
