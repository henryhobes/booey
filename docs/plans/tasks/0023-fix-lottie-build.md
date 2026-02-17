# Task 0023: Fix lottie-react build error

## Problem
`npm run build` fails because `src/components/wizard/LoadingScreen.tsx` imports `lottie-react`, which is not installed as a dependency.

## Solution
Install `lottie-react` as a production dependency. The component and animation JSON (`src/assets/booey-logo.json`) are already complete and ready to use.

## Acceptance Criteria
- [ ] `lottie-react` added to `package.json`
- [ ] `npm run build` passes
- [ ] LoadingScreen renders Lottie animation correctly
