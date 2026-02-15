'use client';

import { useState } from 'react';

interface RefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (refinementPrompt: string) => void;
}

const QUICK_REFINEMENTS = [
  'Make it shorter',
  'Make it longer',
  'More formal',
  'More casual',
  'Add more detail',
  'Simplify',
];

export default function RefineModal({ isOpen, onClose, onSubmit }: RefineModalProps) {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleQuickRefine = (prompt: string) => {
    onSubmit(prompt);
    setCustomPrompt('');
  };

  const handleCustomRefine = () => {
    if (customPrompt.trim()) {
      onSubmit(customPrompt.trim());
      setCustomPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleCustomRefine();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-4">Refine Your Results</h3>
        <p className="text-base opacity-70 mb-6">
          Tell us what you'd like to change, or pick a quick option below.
        </p>

        {/* Custom refinement input */}
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text font-medium whitespace-normal break-words">What would you like to change?</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-32 text-base leading-relaxed"
            placeholder="e.g., Add more examples, focus on technical details, make it more beginner-friendly..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <label className="label">
            <span className="label-text-alt opacity-60 whitespace-normal break-words">
              Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to submit
            </span>
          </label>
        </div>

        {/* Quick refinement chips */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-3">Quick options:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_REFINEMENTS.map((option) => (
              <button
                key={option}
                onClick={() => handleQuickRefine(option)}
                className="btn btn-outline btn-sm min-h-[48px] px-4"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Warning about quota */}
        <div className="alert alert-warning mb-6">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-sm">Refinements count toward your daily quota</span>
        </div>

        {/* Action buttons */}
        <div className="modal-action">
          <button
            onClick={onClose}
            className="btn btn-ghost min-h-[48px]"
          >
            Cancel
          </button>
          <button
            onClick={handleCustomRefine}
            disabled={!customPrompt.trim()}
            className="btn btn-primary min-h-[48px]"
          >
            Refine
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
