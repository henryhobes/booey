import { UseCaseQuestion } from '@/types';

interface MultiselectQuestionProps {
  question: UseCaseQuestion;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function MultiselectQuestion({ question, value, onChange }: MultiselectQuestionProps) {
  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
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
      {question.helperText && (
        <label className="label pt-0">
          <span className="label-text-alt text-base-content/60 whitespace-normal break-words">{question.helperText}</span>
        </label>
      )}
      <div className="space-y-3 mt-2">
        {question.options?.map((option) => (
          <label key={option} className="label cursor-pointer justify-start gap-4 bg-base-200 rounded-lg p-4">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={value.includes(option)}
              onChange={() => handleToggle(option)}
            />
            <span className="label-text text-lg">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
