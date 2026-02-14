'use client';

import { useState } from 'react';
import { UseCase } from '@/types';
import { useUser } from '@/hooks/useUser';
import { useTryBeforeSignup } from '@/hooks/useTryBeforeSignup';
import TextQuestion from './questions/TextQuestion';
import TextareaQuestion from './questions/TextareaQuestion';
import SelectQuestion from './questions/SelectQuestion';
import MultiselectQuestion from './questions/MultiselectQuestion';
import NumberQuestion from './questions/NumberQuestion';
import Result from './Result';
import Link from 'next/link';

interface WizardProps {
  useCase: UseCase;
}

export default function Wizard({ useCase }: WizardProps) {
  const { user } = useUser();
  const { canUseAsGuest, markGuestUseComplete, hasUsedFreeUse } = useTryBeforeSignup();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentQuestion = useCase.questions[currentStep];
  const isLastQuestion = currentStep === useCase.questions.length - 1;
  const totalQuestions = useCase.questions.length;
  const progress = ((currentStep + 1) / totalQuestions) * 100;
  
  // Get current answer value (initialize based on question type)
  const getCurrentValue = () => {
    const value = answers[currentQuestion.id];
    if (value !== undefined) return value;
    
    // Default values for each type
    if (currentQuestion.type === 'multiselect') return [];
    if (currentQuestion.type === 'number') return '';
    return '';
  };
  
  // Validate current question
  const isCurrentQuestionValid = () => {
    if (!currentQuestion.required) return true;
    
    const value = answers[currentQuestion.id];
    
    if (value === undefined || value === null || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    
    return true;
  };
  
  // Handle answer change
  const handleAnswerChange = (value: string | string[] | number) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
    setError(null);
  };
  
  // Navigate to next question
  const handleNext = () => {
    if (!isCurrentQuestionValid()) {
      setError('Please answer this question before continuing');
      return;
    }
    
    setCurrentStep(currentStep + 1);
    setError(null);
  };
  
  // Navigate to previous question
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };
  
  // Submit and generate result
  const handleSubmit = async () => {
    if (!isCurrentQuestionValid()) {
      setError('Please answer this question before continuing');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          useCaseId: useCase.id,
          answers,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate result');
      }
      
      setResult(data.result);
      
      // Track guest usage
      if (!user) {
        markGuestUseComplete({
          useCaseId: useCase.id,
          answers,
          result: data.result,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Retry after error
  const handleRetry = () => {
    setError(null);
    handleSubmit();
  };
  
  // Start over
  const handleStartOver = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
  };
  
  // Guest gate: if guest has used free use and no result yet, block access
  if (!user && !canUseAsGuest() && !result) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center p-12">
            <h2 className="text-2xl font-bold mb-4">Sign up to continue</h2>
            <p className="text-lg opacity-70 mb-6">
              You&apos;ve used your free use case. Sign up to save your results and unlock unlimited use!
            </p>
            <Link
              href={`/auth/sign-in?next=/use/${useCase.id}`}
              className="btn btn-primary btn-lg"
            >
              Sign Up / Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render result view
  if (result) {
    return (
      <>
        <Result result={result} onStartOver={handleStartOver} />
        {!user && hasUsedFreeUse && (
          <div className="w-full max-w-4xl mx-auto mt-6">
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Sign up to save your results and unlock unlimited use!</span>
              <Link href="/auth/sign-in" className="btn btn-sm btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </>
    );
  }
  
  // Render loading state
  if (isGenerating) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center p-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <h2 className="text-2xl font-bold mt-6 mb-2">Working on your results...</h2>
            <p className="text-lg opacity-70">This should just take a moment</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render question
  const renderQuestion = () => {
    const value = getCurrentValue();
    
    switch (currentQuestion.type) {
      case 'text':
        return (
          <TextQuestion
            question={currentQuestion}
            value={value as string}
            onChange={handleAnswerChange}
          />
        );
      case 'textarea':
        return (
          <TextareaQuestion
            question={currentQuestion}
            value={value as string}
            onChange={handleAnswerChange}
          />
        );
      case 'select':
        return (
          <SelectQuestion
            question={currentQuestion}
            value={value as string}
            onChange={handleAnswerChange}
          />
        );
      case 'multiselect':
        return (
          <MultiselectQuestion
            question={currentQuestion}
            value={value as string[]}
            onChange={handleAnswerChange}
          />
        );
      case 'number':
        return (
          <NumberQuestion
            question={currentQuestion}
            value={value as string | number}
            onChange={handleAnswerChange}
          />
        );
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{useCase.icon}</div>
        <h1 className="text-4xl font-bold mb-3">{useCase.title}</h1>
        <p className="text-xl opacity-70">{useCase.description}</p>
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
        <div className="card-body p-8">
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
              {error.includes('try again') && (
                <button onClick={handleRetry} className="btn btn-sm btn-outline">
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex gap-4 justify-between">
        <button
          onClick={handleBack}
          className="btn btn-outline btn-lg"
          disabled={currentStep === 0}
        >
          Back
        </button>
        
        {isLastQuestion ? (
          <button onClick={handleSubmit} className="btn btn-primary btn-lg">
            Get My Results ✨
          </button>
        ) : (
          <button onClick={handleNext} className="btn btn-primary btn-lg">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
