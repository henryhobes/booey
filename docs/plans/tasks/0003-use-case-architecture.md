# Task 0003: Use Case Architecture — One File Per Use Case

## Problem
All 19 use cases live in a single `src/data/use-cases.json` (964 lines). Adding or editing ANY use case requires modifying this one file. This means:
- Two agents working on different use cases will always conflict
- The file grows linearly (each use case adds ~50 lines)
- PRs touch the entire catalog even when changing one use case
- Reviews have to scan the whole file to find the diff

## Solution: Individual Use Case Files

### New directory structure
```
src/data/use-cases/
├── index.ts              # Auto-loader: reads all .json files, exports combined array
├── _schema.ts            # Zod schema for validation + TypeScript type
├── healthy-recipe.json
├── difficult-email.json
├── bill-negotiation.json
├── gift-ideas.json
├── meal-plan-week.json
├── ... (one file per use case)
```

### How it works
1. Each use case is a standalone JSON file named `{id}.json`
2. `index.ts` uses `fs.readdirSync` at build time (or static import with glob) to load all `.json` files
3. `_schema.ts` exports a Zod schema that validates each file on load (fail-fast if malformed)
4. Adding a new use case = adding ONE new file. No other files touched.
5. Editing a use case = editing only that file. Zero conflict risk.

### Migration steps
1. Create `src/data/use-cases/` directory
2. Create `_schema.ts` with Zod validation (based on existing `UseCase` type in `src/types/index.ts`)
3. Create `index.ts` that loads + validates all JSON files
4. Split `use-cases.json` into 19 individual files
5. Update `src/lib/use-cases.ts` to import from new `src/data/use-cases/` instead of the monolith
6. Update `src/app/explore/page.tsx` to use `src/lib/use-cases.ts` (not direct JSON import)
7. Delete old `src/data/use-cases.json`
8. Verify build + lint pass
9. Run all existing pages to confirm no regressions

### Key constraints
- Must work with Next.js static analysis (can't use dynamic `require` at runtime in server components)
- Use `import.meta.glob` or build-time file reading
- Maintain backwards compatibility: `getAllUseCases()` and `getUseCaseById()` must return the same data
- Keep `addedDate`, `popular`, and `category_label` fields
- TypeScript types must be enforced (Zod schema → inferred type)

### Adding a new use case (after this change)
```bash
# 1. Create the file
touch src/data/use-cases/my-new-tool.json

# 2. Fill in the template (copy from any existing file)
# 3. That's it. No other files to edit.
```

### Parallel work safety
- Agent A adds `travel-packing.json` → touches only that file
- Agent B adds `workout-plan.json` → touches only that file
- Zero merge conflicts. Both PRs can merge independently.

## Acceptance Criteria
- [ ] Each use case is its own `.json` file in `src/data/use-cases/`
- [ ] Zod schema validates each file at build time
- [ ] `getAllUseCases()` returns the same data as before
- [ ] `getUseCaseById()` works unchanged
- [ ] Explore page renders correctly (featured, new, popular, all)
- [ ] Wizard flow works for any use case
- [ ] `npm run build` and `npm run lint` pass
- [ ] Old `use-cases.json` is deleted
- [ ] No other source files import `use-cases.json` directly
