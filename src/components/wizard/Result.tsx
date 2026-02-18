'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { UseCase, Citation } from '@/types';
import RefineModal from './RefineModal';

interface ResultProps {
  result: string;
  citations: Citation[];
  useCase: UseCase;
  answers: Record<string, string | string[] | number>;
  onStartOver: () => void;
  onEditInputs: () => void;
  onRefine: (refinementPrompt: string) => void;
}

export default function Result({
  result,
  citations,
  useCase,
  answers,
  onStartOver,
  onEditInputs,
  onRefine
}: ResultProps) {
  const [copied, setCopied] = useState(false);
  const [showRefineModal, setShowRefineModal] = useState(false);

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Format answer value for display
  const formatAnswer = (value: string | string[] | number): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  // Get question label by ID
  const getQuestionLabel = (questionId: string): string => {
    const question = useCase.questions.find((q) => q.id === questionId);
    return question?.label || questionId;
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        {/* Header with action buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 print:hidden">
          <Link href="/" className="btn btn-ghost btn-sm min-h-[48px]">
            ← Back to Browse
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-outline btn-sm min-h-[48px] px-6"
              title="Print results"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
                />
              </svg>
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleCopy}
              className="btn btn-outline btn-sm min-h-[48px] px-6"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  </svg>
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main result card */}
        <div className="card bg-base-100 shadow-xl print:shadow-none">
          <div className="card-body p-6 md:p-12">
            {/* Use case header */}
            <div className="text-center mb-8 print:mb-6">
              <div className="text-5xl mb-4 print:text-4xl">{useCase.icon}</div>
              <h1 className="text-3xl font-bold text-primary print:text-2xl">
                {useCase.title}
              </h1>
            </div>

            {/* Inputs recap */}
            <div className="mb-8 pb-8 border-b border-base-300 print:mb-6 print:pb-6">
              <h2 className="text-xl font-semibold mb-4 print:text-lg">Your Inputs:</h2>
              <ul className="space-y-2">
                {Object.entries(answers).map(([key, value]) => (
                  <li key={key} className="text-base print:text-sm">
                    <strong>{getQuestionLabel(key)}:</strong>{' '}
                    <span className="opacity-80">{formatAnswer(value)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Response - using react-markdown */}
            <div className="prose prose-lg max-w-none print:prose-sm markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
            </div>

            {/* Sources from web search */}
            {citations.length > 0 && (
              <div className="mt-8 pt-6 border-t border-base-300">
                <h3 className="text-lg font-semibold mb-3">Sources</h3>
                <ul className="space-y-2">
                  {citations.map((citation, index) => (
                    <li key={index} className="text-base">
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary hover:link-hover break-all"
                      >
                        {citation.title || citation.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 print:hidden">
              <button
                onClick={onEditInputs}
                className="btn btn-outline btn-lg min-h-[48px] flex-1 sm:flex-initial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                Edit Inputs
              </button>
              <button
                onClick={() => setShowRefineModal(true)}
                className="btn btn-primary btn-lg min-h-[48px] flex-1 sm:flex-initial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
                Refine This
              </button>
            </div>

            {/* Secondary actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 print:hidden">
              <button onClick={onStartOver} className="btn btn-ghost btn-sm min-h-[48px]">
                Start Over
              </button>
              <Link href="/" className="btn btn-ghost btn-sm min-h-[48px]">
                Try Another Use Case
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Refine Modal */}
      <RefineModal
        isOpen={showRefineModal}
        onClose={() => setShowRefineModal(false)}
        onSubmit={(prompt) => {
          setShowRefineModal(false);
          onRefine(prompt);
        }}
      />
    </>
  );
}
