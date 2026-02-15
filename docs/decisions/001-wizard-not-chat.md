# ADR-001: Wizard UI, Not Chat

**Status:** Accepted  
**Date:** 2026-02-09

## Decision
Use a progressive wizard/form pattern instead of a chat interface.

## Context
Target users are 40-60 year olds who find blank chatbot UX intimidating. They don't know what to type.

## Rationale
- Forms are familiar to everyone (less intimidating than "what do I type?")
- Shows clear progress ("Question 2 of 3")
- Feels like a tool, not a conversation
- Faster to build, works better on mobile
- Structured inputs produce better AI outputs (guided prompts > freeform)

## Consequences
- Can't handle open-ended conversations (by design)
- Each use case needs its own question flow
- Refine/follow-up requires a modal, not chat continuation
