import { UseCaseQuestion } from '@/types';

interface NumberQuestionProps {
  question: UseCaseQuestion;
  value: number | string;
  onChange: (value: number) => void;
}

export default function NumberQuestion({ question, value, onChange }: NumberQuestionProps) {
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
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={question.min}
        max={question.max}
        required={question.required}
      />
    </div>
  );
}
