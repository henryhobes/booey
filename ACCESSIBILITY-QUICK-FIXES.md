# Booey Accessibility - Quick Fixes (P0)

**Time Required:** ~4 hours  
**Impact:** Achieves WCAG 2.1 AA compliance + strong AAA elements

---

## 1. Modal Focus Trap (1 hour)

**File:** `src/components/wizard/RefineModal.tsx`

**Install dependency:**
```bash
npm install focus-trap-react
```

**Update component:**
```tsx
import { useEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';

export default function RefineModal({ isOpen, onClose, onSubmit }: RefineModalProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <FocusTrap active={isOpen}>
      <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="refine-modal-title">
        <div className="modal-box max-w-2xl">
          <h3 
            ref={titleRef}
            id="refine-modal-title" 
            className="font-bold text-2xl mb-4"
            tabIndex={-1}
          >
            Refine Your Results
          </h3>
          
          {/* Rest of modal content unchanged */}
          
        </div>
        <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      </div>
    </FocusTrap>
  );
}
```

---

## 2. Multiselect Group Labels (30 mins)

**File:** `src/components/wizard/questions/MultiselectQuestion.tsx`

**Replace with:**
```tsx
export default function MultiselectQuestion({ question, value, onChange }: MultiselectQuestionProps) {
  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };
  
  const groupId = `multiselect-${question.id}`;
  
  return (
    <div className="form-control w-full">
      <fieldset>
        <legend className="label">
          <span className="label-text text-lg font-medium whitespace-normal break-words">
            {question.label}
            {question.required && <span className="text-error ml-1" aria-label="required">*</span>}
          </span>
        </legend>
        {question.helperText && (
          <p className="label pt-0" id={`${groupId}-description`}>
            <span className="label-text-alt text-base-content/60 whitespace-normal break-words">
              {question.helperText}
            </span>
          </p>
        )}
        <div 
          className="space-y-3 mt-2"
          role="group"
          aria-describedby={question.helperText ? `${groupId}-description` : undefined}
        >
          {question.options?.map((option) => (
            <label 
              key={option} 
              className="label cursor-pointer justify-start gap-4 bg-base-200 rounded-lg p-4"
            >
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={value.includes(option)}
                onChange={() => handleToggle(option)}
              />
              <span className="label-text text-lg whitespace-normal break-words">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
```

---

## 3. Error Announcements (2 hours)

**File:** `src/components/wizard/Wizard.tsx`

**Update error handling in the question card section:**
```tsx
{error && (
  <div 
    id="wizard-error"
    className="alert alert-error mt-6" 
    role="alert"
    aria-live="assertive"
    tabIndex={-1}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
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
```

**Update handleNext to focus error:**
```tsx
const handleNext = () => {
  if (!isCurrentQuestionValid()) {
    setError('Just need your answer here 👆');
    
    // Focus error for screen reader announcement
    setTimeout(() => {
      const errorEl = document.getElementById('wizard-error');
      if (errorEl) errorEl.focus();
    }, 100);
    
    return;
  }
  // ... rest unchanged
};
```

**Update each question component to add aria-invalid:**

**TextQuestion.tsx:**
```tsx
interface TextQuestionProps {
  question: UseCaseQuestion;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean; // Add this
}

export default function TextQuestion({ question, value, onChange, hasError }: TextQuestionProps) {
  const inputId = `question-${question.id}`;
  
  return (
    <div className="form-control w-full">
      <label htmlFor={inputId} className="label">
        <span className="label-text text-lg font-medium whitespace-normal break-words">
          {question.label}
          {question.required && <span className="text-error ml-1" aria-label="required">*</span>}
        </span>
      </label>
      <input
        id={inputId}
        type="text"
        placeholder={question.placeholder}
        className={`input input-bordered input-lg w-full text-lg ${hasError ? 'input-error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={question.required}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={question.helperText ? `${inputId}-help` : undefined}
      />
      {question.helperText && (
        <label className="label" id={`${inputId}-help`}>
          <span className="label-text-alt text-base-content/60 whitespace-normal break-words">
            {question.helperText}
          </span>
        </label>
      )}
    </div>
  );
}
```

**Repeat similar changes for:**
- `TextareaQuestion.tsx`
- `NumberQuestion.tsx`
- `SelectQuestion.tsx`

**Update Wizard.tsx renderQuestion calls:**
```tsx
const renderQuestion = () => {
  const value = getCurrentValue();
  const hasError = error !== null;
  
  switch (currentQuestion.type) {
    case 'text':
      return (
        <TextQuestion
          question={currentQuestion}
          value={value as string}
          onChange={handleAnswerChange}
          hasError={hasError}
        />
      );
    // ... repeat for other types
  }
};
```

---

## 4. Loading Status Announcement (15 mins)

**File:** `src/components/wizard/LoadingScreen.tsx`

**Replace with:**
```tsx
export default function LoadingScreen() {
  return (
    <div 
      className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-primary mb-6" aria-hidden="true"></div>
        <h2 className="text-2xl font-bold mb-3">Generating your results...</h2>
        <p className="text-lg opacity-70">
          Our AI is working on your personalized response. This should only take a few seconds.
        </p>
        <span className="sr-only">Please wait. Generating your personalized results. This may take a few seconds.</span>
      </div>
    </div>
  );
}
```

**Add sr-only utility to globals.css if not present:**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Testing Checklist

After implementing these fixes, test:

- [ ] **Modal Focus Trap:** Tab through RefineModal - focus should stay within modal
- [ ] **Keyboard Navigation:** Navigate entire wizard using only keyboard
- [ ] **Screen Reader (VoiceOver/NVDA):** 
  - Error messages announce when validation fails
  - Multiselect groups announce properly
  - Loading screen announces status
- [ ] **Mobile:** Touch targets are at least 44x44px
- [ ] **Zoom:** Test at 200% browser zoom - everything still usable

---

## Next Steps (P1 - Next Sprint)

After P0 is complete, tackle P1 items:

1. Add `prefers-reduced-motion` support (2 hrs)
2. Verify touch target sizes on all buttons (1 hr)
3. Add autocomplete attributes to forms (1 hr)
4. Audit color contrast in hover states with APCA (3 hrs)

**Total P1 Time:** ~8 hours

---

## Resources

- **Test with Screen Reader:**
  - Mac: VoiceOver (Cmd+F5)
  - Windows: NVDA (free download)
- **Axe DevTools:** Chrome extension for automated testing
- **Focus Trap React Docs:** https://github.com/focus-trap/focus-trap-react

---

**Questions?** See full audit: `ACCESSIBILITY-AUDIT.md`
