# Bugfix: Hydration Error in Wizard Component

## Problem

Hydration error occurring in `src/components/wizard/Wizard.tsx` when try-before-signup logic checks localStorage during SSR.

**Error:** Server renders wizard UI, but client checks localStorage and renders signup prompt instead → React hydration mismatch.

## Root Cause

The try-before-signup logic in Wizard component is reading localStorage during render, which doesn't exist on the server. This causes server/client mismatch.

## Solution

Use `useState` + `useEffect` pattern to defer localStorage check until after mount:

1. Initial state should match server render (assume user hasn't used their free case)
2. In `useEffect`, check localStorage and update state if needed
3. This ensures first render matches server, subsequent renders reflect actual state

## Implementation

**File to modify:** `src/components/wizard/Wizard.tsx`

**Pattern:**
```tsx
const [hasUsedFreeTry, setHasUsedFreeTry] = useState(false); // matches server

useEffect(() => {
  // Only runs on client after mount
  const used = localStorage.getItem('freeUseCaseUsed') === 'true';
  setHasUsedFreeTry(used);
}, []);
```

Then render based on `hasUsedFreeTry` state instead of directly reading localStorage.

## Testing

1. Clear localStorage
2. Visit a use case page → should see wizard (no hydration error)
3. Complete one use case
4. Visit another use case page → should see signup prompt (no hydration error)
5. Check browser console for hydration warnings

## Success Criteria

- No hydration errors in console
- Try-before-signup flow still works correctly
- Server and client render the same initial UI
