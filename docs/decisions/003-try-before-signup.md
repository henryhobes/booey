# ADR-003: Try Before Signup

**Status:** Accepted  
**Date:** 2026-02-09

## Decision
Users complete ONE use case without an account, then are prompted to sign up.

## Rationale
- Optimizes for "aha moment" before asking for commitment
- Reduces friction for first-time users
- Target demographic (40-60) is skeptical of creating accounts for unknown products
- localStorage tracks trial usage via `useTryBeforeSignup` hook

## Implementation
- `src/hooks/useTryBeforeSignup.ts` manages trial state
- After first result, prompt to sign up to save it
- Trial result is NOT persisted to DB (only in-memory)
