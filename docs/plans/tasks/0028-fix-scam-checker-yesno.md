# Task: Fix Scam Checker YesNo Question

**Repo:** `/Users/henryhobin/Projects/booey/`
**Branch:** `fix/scam-checker-yesno`
**Base:** `main`

### Context
The `YesNoQuestion` component renders `question.options` to display Yes/No buttons. The scam-checker use case's `known-sender` question (type: `yesNo`) was missing the `options` array, causing it to render nothing.

### What to Build
1. **`src/data/use-cases/scam-checker.yaml`** — Add `options: ["Yes", "No"]` to the `known-sender` question.

### Success Criteria
- [x] `known-sender` question has `options: ["Yes", "No"]`
- [x] `npm run build` passes
- [x] PR opened
