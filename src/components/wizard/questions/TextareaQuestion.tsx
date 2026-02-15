import { UseCaseQuestion } from '@/types';

interface TextareaQuestionProps {
  question: UseCaseQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function TextareaQuestion({ question, value, onChange }: TextareaQuestionProps) {
  const inputId = `question-${question.id}`;
  
  return (
    <div className="form-control w-full">
      <label htmlFor={inputId} className="label">
        <span className="label-text text-lg font-medium whitespace-normal break-words">
          {question.label}
          {question.required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      <textarea
        id={inputId}
        placeholder={question.placeholder}
        className="textarea textarea-bordered textarea-lg w-full text-lg min-h-32"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={question.required}
      />
      {question.helperText && (
        <label className="label">
          <span className="label-text-alt text-base-content/60 whitespace-normal break-words">{question.helperText}</span>
        </label>
      )}
    </div>
  );
}
