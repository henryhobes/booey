'use client';

import { UseCase } from '@/types';

interface WelcomeScreenProps {
  useCase: UseCase;
  onStart: () => void;
}

export default function WelcomeScreen({ useCase, onStart }: WelcomeScreenProps) {
  const totalQuestions = useCase.questions.length;
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
                <p className="opacity-70">We&apos;ll ask you {totalQuestions} question{totalQuestions > 1 ? 's' : ''} (takes about {estimatedMinutes} minute{estimatedMinutes > 1 ? 's' : ''})</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <p className="font-medium">Personalized results</p>
                <p className="opacity-70">You&apos;ll get a custom response tailored to your specific needs</p>
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
              💡 <strong>Tip:</strong> There are no wrong answers. Just answer naturally, like you&apos;re talking to a friend.
            </p>
          </div>
          
          <button 
            onClick={onStart}
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
