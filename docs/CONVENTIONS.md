# Booey — Code Conventions

## File & Naming

- **Components:** PascalCase (`UseCaseGrid.tsx`, `QuotaBadge.tsx`)
- **Hooks:** camelCase with `use` prefix (`useUser.ts`, `useTryBeforeSignup.ts`)
- **Utilities:** camelCase (`get-base-url.ts`, `validation.ts`)
- **API routes:** `route.ts` inside the route directory (`app/api/generate/route.ts`)
- **Types:** PascalCase, defined in `src/types/index.ts` (shared) or co-located if component-specific
- **Max file length:** 300 lines. If longer, split into sub-components or utilities.

## Import Boundaries

These are the allowed dependency directions. Violations should be caught by linting.

```
types/        → (no imports from src/)
lib/utils/    → types/
lib/supabase/ → types/, lib/utils/
lib/ai/       → types/, lib/utils/
hooks/        → lib/, types/
components/   → hooks/, lib/, types/
app/          → components/, hooks/, lib/, types/
app/api/      → lib/, types/ (NO component imports)
```

**Anti-patterns:**
- ❌ Components importing from `app/` (pages)
- ❌ `lib/` importing from `components/` or `hooks/`
- ❌ API routes importing React components
- ❌ Client components importing server-only code (`supabase/server.ts`)

## Patterns

### Data Fetching
- Server components fetch data directly (no `useEffect`)
- Client components use hooks that call API routes
- API routes validate input with Zod before processing

### Error Handling
- API routes: Return `{ error: string }` with appropriate HTTP status
- Client: Show user-friendly error messages (not stack traces)
- Always handle loading, error, and empty states in UI components

### Styling
- Tailwind utility classes (no custom CSS unless absolutely necessary)
- DaisyUI components for standard UI elements (buttons, cards, modals)
- Color tokens from `src/styles/colors.ts` — never hardcode hex values
- Mobile-first: base styles for mobile, `md:` and `lg:` breakpoints for larger screens
- Touch targets: minimum 48px for interactive elements

### TypeScript
- Strict mode enabled — no `any` types
- Prefer `interface` for component props, `type` for unions/utilities
- Zod schemas for runtime validation (API inputs, external data)
- Export types from `src/types/index.ts` for shared types

### Accessibility (Target: WCAG 2.1 AA)
- All images have `alt` text
- Form inputs have associated labels
- Focus indicators visible on all interactive elements
- Color contrast ratio ≥ 4.5:1 for text
- Font size minimum 16px base (target demographic: 40-60 year olds)

## Commit Messages

Format: `type: description`

- `feat:` — new feature
- `fix:` — bug fix
- `refactor:` — code restructuring (no behavior change)
- `docs:` — documentation only
- `chore:` — build, CI, dependencies
- `style:` — formatting, whitespace (no logic change)
