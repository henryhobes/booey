# ADR-002: Hardcoded JSON Use Cases

**Status:** Accepted (will revisit at scale)  
**Date:** 2026-02-09

## Decision
Store use cases in a static JSON file (`src/data/use-cases.json`) instead of database.

## Rationale
- Zero setup time, easy to version control
- No DB migrations for catalog changes
- Perfect for ~20 MVP use cases
- Agents can read and modify directly

## When to Revisit
- When adding user-submitted use cases
- When catalog exceeds ~100 entries (need search/pagination)
- When non-engineers need to edit the catalog
