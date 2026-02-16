'use client';

import Link from 'next/link';
import { UseCase, UseCaseQuestion } from '@/types';
import TextQuestion from './questions/TextQuestion';
import TextareaQuestion from './questions/TextareaQuestion';
import SelectQuestion from './questions/SelectQuestion';
import MultiselectQuestion from './questions/MultiselectQuestion';
import NumberQuestion from './questions/NumberQuestion';
import ImageSelectQuestion from './questions/ImageSelectQuestion';
import YesNoQuestion from './questions/YesNoQuestion';
import TagCloudQuestion from './questions/TagCloudQuestion';
import StepperQuestion from './questions/StepperQuestion';
import EmojiScaleQuestion from './questions/EmojiScaleQuestion';
import StarRatingQuestion from './questions/StarRatingQuestion';
import SpectrumQuestion from './questions/SpectrumQuestion';

interface QuestionScreenProps {
  useCase: UseCase;
  currentStep: number;
  totalQuestions: number;
  progress: number;
  currentQuestion: UseCaseQuestion;
  currentValue: string | string[] | number;
  error: string | null;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onChange: (value: string | string[] | number) => void;
}

export default function QuestionScreen({
  useCase,
  currentStep,
  totalQuestions,
  progress,
  currentQuestion,
  currentValue,
  error,
  isSubmitting,
  onBack,
  onNext,
  onChange,
}: QuestionScreenProps) {
  const isLastQuestion = currentStep === totalQuestions - 1;

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'text':
        return (
          <TextQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue as string}
            onChange={onChange}
          />
        );
      case 'textarea':
        return (
          <TextareaQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue as string}
            onChange={onChange}
          />
        );
      case 'select':
        return (
          <SelectQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue as string}
            onChange={onChange}
          />
        );
      case 'multiselect':
        return (
          <MultiselectQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue as string[]}
            onChange={onChange}
          />
        );
      case 'number':
        return (
          <NumberQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue as string | number}
            onChange={onChange}
          />
        );
      case 'imageSelect':
        return (
          <ImageSelectQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue as string}
            onChange={onChange}
          />
        );
      case 'yesNo':
        return (
          <YesNoQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue as string}
            onChange={onChange}
          />
        );
      case 'tagCloud':
        return (
          <TagCloudQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue as string[]}
            onChange={onChange}
          />
        );
      case 'stepper':
        return (
          <StepperQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue as number}
            onChange={onChange}
          />
        );
      case 'emojiScale':
        return (
          <EmojiScaleQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue as string}
            onChange={onChange}
          />
        );
      case 'starRating':
        return (
          <StarRatingQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue as number}
            onChange={onChange}
          />
        );
      case 'spectrum':
        return (
          <SpectrumQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue as string}
            onChange={onChange}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl md:text-6xl mb-4">{useCase.icon}</div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">{useCase.title}</h1>
        <p className="text-lg md:text-xl opacity-70">{useCase.description}</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Question {currentStep + 1} of {totalQuestions}
          </span>
          <span className="text-sm opacity-70">{Math.round(progress)}% complete</span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={progress}
          max="100"
        ></progress>
      </div>

      {/* Question Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body p-4 md:p-8">
          {renderQuestion()}

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
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse md:flex-row gap-4 md:justify-between">
        {currentStep === 0 ? (
          <Link
            href="/explore"
            className="btn btn-outline btn-lg w-full md:w-auto min-h-[48px]"
          >
            ← Back
          </Link>
        ) : (
          <button
            onClick={onBack}
            className="btn btn-outline btn-lg w-full md:w-auto min-h-[48px]"
          >
            Back
          </button>
        )}

        <button
          onClick={onNext}
          className={`btn ${isLastQuestion ? 'btn-secondary' : 'btn-primary'} btn-lg w-full md:w-auto min-h-[48px] ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting}
        >
          {isLastQuestion
            ? isSubmitting
              ? 'Creating Your Answer...'
              : 'Create My Answer'
            : 'Next'}
        </button>
      </div>
    </div>
  );
}
