# ADR-005: Claude Haiku as Default Model

**Status:** Accepted  
**Date:** 2026-02-09

## Decision
Use Claude Haiku for most use cases. Reserve Sonnet for flagged complex use cases.

## Rationale
- 4-5x cheaper than Sonnet (~$0.004/interaction vs ~$0.02)
- Guided prompts produce structured outputs — Haiku handles these well
- Cost control is critical for free product
- See `docs/COST-MODEL.md` for full cost projections

## Configuration
- Default model set in `src/lib/ai/` module
- Individual use cases can override via `model` field in `use-cases.json`
- Budget tracking in `src/lib/budget.ts`
