import { UseCaseQuestion } from '@/types';

interface TextQuestionProps {
  question: UseCaseQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function TextQuestion({ question, value, onChange }: TextQuestionProps) {
  const inputId = `question-${question.id}`;
  
  return (
    <div className="form-control w-full">
      <label htmlFor={inputId} className="label">
        <span className="label-text text-lg font-medium">
          {question.label}
          {question.required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      <input
        id={inputId}
        type="text"
        placeholder={question.placeholder}
        className="input input-bordered input-lg w-full text-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={question.required}
      />
    </div>
  );
}
