'use client';

import { useState, useEffect } from 'react';
import { UseCase } from '@/types';
import { useUser } from '@/hooks/useUser';
import { useTryBeforeSignup } from '@/hooks/useTryBeforeSignup';
import TextQuestion from './questions/TextQuestion';
import TextareaQuestion from './questions/TextareaQuestion';
import SelectQuestion from './questions/SelectQuestion';
import MultiselectQuestion from './questions/MultiselectQuestion';
import NumberQuestion from './questions/NumberQuestion';
import LoadingScreen from './LoadingScreen';
import Result from './Result';
import Link from 'next/link';

interface WizardProps {
  useCase: UseCase;
}

type WizardMode = 'welcome' | 'questions' | 'review' | 'generating' | 'result';

export default function Wizard({ useCase }: WizardProps) {
  const { user } = useUser();
  const { canUseAsGuest, markGuestUseComplete, hasUsedFreeUse } = useTryBeforeSignup();
  const [mode, setMode] = useState<WizardMode>('welcome');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const currentQuestion = useCase.questions[currentStep];
  const totalQuestions = useCase.questions.length;
  
  // Scroll to top when entering loading/generating state
  useEffect(() => {
    if (mode === 'generating') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [mode]);
  
  // Calculate progress including welcome and review screens
  const getProgress = () => {
    const totalSteps = totalQuestions + 2; // +2 for welcome and review
    let currentStepNum = 0;
    
    if (mode === 'welcome') currentStepNum = 0;
    else if (mode === 'questions') currentStepNum = currentStep + 1;
    else if (mode === 'review') currentStepNum = totalQuestions + 1;
    else currentStepNum = totalSteps;
    
    return (currentStepNum / totalSteps) * 100;
  };
  
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
  
  // Start the wizard from welcome screen
  const handleStart = () => {
    setMode('questions');
    setCurrentStep(0);
    setError(null);
  };
  
  // Navigate to next question
  const handleNext = () => {
    if (!isCurrentQuestionValid()) {
      setError('Just need your answer here 👆');
      return;
    }
    
    // Check if last question - go to review
    if (currentStep === totalQuestions - 1) {
      setMode('review');
      setError(null);
    } else {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };
  
  // Navigate to previous question
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    } else {
      // Go back to welcome screen
      setMode('welcome');
      setError(null);
    }
  };
  
  // Go back from review to last question
  const handleBackFromReview = () => {
    setMode('questions');
    setCurrentStep(totalQuestions - 1);
    setError(null);
  };
  
  // Edit a specific answer from review screen
  const handleEditAnswer = (questionIndex: number) => {
    setMode('questions');
    setCurrentStep(questionIndex);
    setError(null);
  };
  
  // Submit and generate result
  const handleSubmit = async () => {
    setMode('generating');
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
      setMode('result');
      
      // Track guest usage
      if (!user) {
        markGuestUseComplete({
          useCaseId: useCase.id,
          answers,
          result: data.result,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error 
          ? `Hmm, something went wrong: ${err.message}. Mind trying again?`
          : 'Oops! Something didn\'t work quite right. Could you give it another try?'
      );
      setMode('review'); // Go back to review on error
    }
  };
  
  // Retry after error
  const handleRetry = () => {
    setError(null);
    handleSubmit();
  };
  
  // Start over
  const handleStartOver = () => {
    setMode('welcome');
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
  };
  
  // Edit inputs - go back to wizard with current answers
  const handleEditInputs = () => {
    setResult(null);
    setCurrentStep(0);
    setError(null);
  };
  
  // Refine result - append refinement and regenerate
  const handleRefine = async (refinementPrompt: string) => {
    setMode('generating');
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
          refinement: refinementPrompt,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to refine result');
      }
      
      setResult(data.result);
      setMode('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setMode('result'); // Stay on result page even on error
    }
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
  if (mode === 'result' && result) {
    return (
      <>
        <Result 
          result={result} 
          useCase={useCase}
          answers={answers}
          onStartOver={handleStartOver}
          onEditInputs={handleEditInputs}
          onRefine={handleRefine}
        />
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
  if (mode === 'generating') {
    return <LoadingScreen />;
  }
  
  // Render welcome screen
  if (mode === 'welcome') {
    const estimatedMinutes = Math.max(1, Math.round(totalQuestions * 0.5));
    
    return (
      <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl md:text-7xl mb-6">{useCase.icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{useCase.title}</h1>
          <p className="text-lg md:text-xl opacity-70 mb-8">{useCase.description}</p>
        </div>
        
        {/* Welcome Card */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body p-6 md:p-10">
            <h2 className="text-2xl font-bold mb-6">What to expect</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="font-medium">Quick & easy</p>
                  <p className="opacity-70">We'll ask you {totalQuestions} question{totalQuestions > 1 ? 's' : ''} (takes about {estimatedMinutes} minute{estimatedMinutes > 1 ? 's' : ''})</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-medium">Personalized results</p>
                  <p className="opacity-70">You'll get a custom response tailored to your specific needs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">👀</span>
                <div>
                  <p className="font-medium">Review before we start</p>
                  <p className="opacity-70">You can review and edit your answers before generating</p>
                </div>
              </div>
            </div>
            
            {/* Reassurance box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-base" style={{ color: "#2C5682" }}>
                💡 <strong>Tip:</strong> There are no wrong answers. Just answer naturally, like you're talking to a friend.
              </p>
            </div>
            
            <button 
              onClick={handleStart}
              className="btn btn-primary btn-lg w-full text-lg min-h-[48px]"
            >
              Let&apos;s Get Started →
            </button>
            
            <p className="text-sm mt-4 text-center opacity-60">
              You can go back and change your answers anytime
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render review screen
  if (mode === 'review') {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl md:text-6xl mb-4">{useCase.icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{useCase.title}</h1>
        </div>
        
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Review your answers</span>
            <span className="text-sm opacity-70">{Math.round(getProgress())}% complete</span>
          </div>
          <progress
            className="progress progress-primary w-full"
            value={getProgress()}
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
                        onClick={() => handleEditAnswer(index)}
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
                  <button onClick={handleRetry} className="btn btn-sm btn-outline">
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
                onClick={handleSubmit}
                className={`btn btn-primary btn-lg w-full text-lg min-h-[48px] ${mode === 'generating' ? 'loading' : ''}`}
                disabled={mode === 'generating'}
              >
                {mode === 'generating' ? 'Creating Your Answer...' : 'Create My Answer'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-start">
          <button
            onClick={handleBackFromReview}
            className="btn btn-outline btn-lg min-h-[48px]"
          >
            ← Back
          </button>
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
    <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl md:text-6xl mb-4">{useCase.icon}</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{useCase.title}</h1>
        <p className="text-lg md:text-xl opacity-70">{useCase.description}</p>
      </div>
      
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Question {currentStep + 1} of {totalQuestions}
          </span>
          <span className="text-sm opacity-70">{Math.round(getProgress())}% complete</span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={getProgress()}
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
        <button
          onClick={handleBack}
          className="btn btn-outline btn-lg w-full md:w-auto min-h-[48px]"
        >
          Back
        </button>
        
        <button 
          onClick={handleNext} 
          className="btn btn-primary btn-lg w-full md:w-auto min-h-[48px]"
        >
          {currentStep === totalQuestions - 1 ? 'Review Answers →' : 'Next'}
        </button>
      </div>
    </div>
  );
}
