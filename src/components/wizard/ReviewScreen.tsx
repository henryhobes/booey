'use client';

import { UseCase } from '@/types';

interface ReviewScreenProps {
  useCase: UseCase;
  answers: Record<string, string | string[] | number>;
  progress: number;
  error: string | null;
  isSubmitting: boolean;
  onBack: () => void;
  onEdit: (questionIndex: number) => void;
  onSubmit: () => void;
  onRetry: () => void;
}

export default function ReviewScreen({
  useCase,
  answers,
  progress,
  error,
  isSubmitting,
  onBack,
  onEdit,
  onSubmit,
  onRetry,
}: ReviewScreenProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl md:text-6xl mb-4">{useCase.icon}</div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">{useCase.title}</h1>
      </div>
      
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Review your answers</span>
          <span className="text-sm opacity-70">{Math.round(progress)}% complete</span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={progress}
          max="100"
        ></progress>
      </div>
      
      {/* Review Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body p-4 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Review Your Answers</h2>
          
          <div className="space-y-6">
            {useCase.questions.map((question, index) => {
              const answer = answers[question.id];
              let displayAnswer = '';
              
              if (Array.isArray(answer)) {
                displayAnswer = answer.join(', ');
              } else if (answer !== undefined && answer !== null) {
                displayAnswer = String(answer);
              }
              
              return (
                <div key={question.id} className="border-b border-base-300 pb-4 last:border-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="font-medium text-base-content/70">
                      {index + 1}. {question.label}
                    </p>
                    <button
                      onClick={() => onEdit(index)}
                      className="btn btn-ghost btn-xs text-primary"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-lg font-medium pl-4">
                    {displayAnswer || <span className="opacity-50 italic">No answer</span>}
                  </p>
                </div>
              );
            })}
          </div>
          
          {error && (
            <div className="alert alert-error mt-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
              {error.includes('try again') && (
                <button onClick={onRetry} className="btn btn-sm btn-outline">
                  Retry
                </button>
              )}
            </div>
          )}
          
          <div className="mt-8">
            <p className="text-center text-sm opacity-70 mb-4">
              Everything look good?
            </p>
            <button 
              onClick={onSubmit}
              className={`btn btn-primary btn-lg w-full text-lg min-h-[48px] ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Your Answer...' : 'Create My Answer'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="btn btn-outline btn-lg min-h-[48px]"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
