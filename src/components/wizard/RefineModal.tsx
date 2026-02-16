'use client';

import { useState, useEffect, useRef } from 'react';
import FocusLock from 'react-focus-lock';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Store previously focused element when modal opens
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Return focus to trigger element when modal closes
  useEffect(() => {
    if (!isOpen && previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
      previouslyFocusedElement.current = null;
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

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
      <FocusLock returnFocus>
        <div className="modal-box max-w-2xl" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h3 id="modal-title" className="font-bold text-2xl mb-4">Refine Your Results</h3>
        <p className="text-base opacity-70 mb-6">
          Tell us what you&apos;d like to change, or pick a quick option below.
        </p>

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
      </FocusLock>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
    </div>
  );
}
