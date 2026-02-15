'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UseCase } from '@/types';
import { useUser } from '@/hooks/useUser';
import { useTryBeforeSignup } from '@/hooks/useTryBeforeSignup';
import LoadingScreen from './LoadingScreen';
import Result from './Result';
import WelcomeScreen from './WelcomeScreen';
import { RateLimitError } from '@/lib/utils/errors';
import ReviewScreen from './ReviewScreen';
import QuestionScreen from './QuestionScreen';
import GuestGateScreen from './GuestGateScreen';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      setError('Please answer this question to continue');
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
    setIsSubmitting(true);
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
        // Rate limit errors get a tailored message (don't say "try again")
        if (data.rateLimited) {
          const canRetry = data.minuteRemaining !== undefined && data.minuteRemaining <= 0;
          throw new RateLimitError(data.error, canRetry);
        }
        throw new Error(data.error || 'Failed to generate result');
      }
      
      setResult(data.result);
      setMode('result');
      setIsSubmitting(false);
      
      // Track guest usage
      if (!user) {
        markGuestUseComplete({
          useCaseId: useCase.id,
          answers,
          result: data.result,
        });
      }
    } catch (err) {
      if (err instanceof RateLimitError && !err.canRetry) {
        // Daily limit — don't tell them to try again
        setError(`${err.message} Come back tomorrow — your answers will be waiting.`);
      } else if (err instanceof RateLimitError && err.canRetry) {
        // Per-minute limit — they can try again shortly
        setError(`${err.message} Wait a moment, then try again.`);
      } else {
        setError(
          err instanceof Error 
            ? `We could not create your result: ${err.message}. Please try again. If this keeps happening, contact support.`
            : 'We could not create your result. Please try again. If this keeps happening, contact support.'
        );
      }
      setMode('review'); // Go back to review on error
      setIsSubmitting(false);
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
    setMode('questions');
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
    return <GuestGateScreen useCase={useCase} />;
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
    return <WelcomeScreen useCase={useCase} onStart={handleStart} />;
  }
  
  // Render review screen
  if (mode === 'review') {
    return (
      <ReviewScreen
        useCase={useCase}
        answers={answers}
        progress={getProgress()}
        error={error}
        isSubmitting={isSubmitting}
        onBack={handleBackFromReview}
        onEdit={handleEditAnswer}
        onSubmit={handleSubmit}
        onRetry={handleRetry}
      />
    );
  }
  
  // Render question screen
  return (
    <QuestionScreen
      useCase={useCase}
      currentStep={currentStep}
      totalQuestions={totalQuestions}
      progress={getProgress()}
      currentQuestion={currentQuestion}
      currentValue={getCurrentValue()}
      error={error}
      onBack={handleBack}
      onNext={handleNext}
      onChange={handleAnswerChange}
    />
  );
}
