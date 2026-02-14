# Phase 2 Task 3: Session Persistence

## Goal
Save user sessions to the database after AI generation, and provide an API to fetch session history.

## Scope

1. **Update `/api/generate` route**
   - After successful Claude API call, save session to Supabase
   - Save: user_id (from auth), use_case_id, answers, result, model, token counts
   - Handle authenticated users (save to DB)
   - Handle guest users (return session but don't save to DB - they can save after signup)

2. **Create `/api/sessions` route**
   - GET endpoint to fetch authenticated user's session history
   - Return sessions in reverse chronological order (newest first)
   - Include: id, use_case_id, answers, result, model, tokens, created_at
   - Protected route (auth required)

3. **Update types**
   - Add Session type to match database schema
   - Update GenerateResponse to include session_id

## Implementation Details

### Update `/api/generate` route

```typescript
import { createClient } from '@/lib/supabase/server'

// After Claude generates result:
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

let sessionId = null

if (user) {
  // Save to database for authenticated users
  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      use_case_id: useCaseId,
      answers,
      result: result,
      model: MODEL,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
    })
    .select('id')
    .single()

  if (!error && session) {
    sessionId = session.id
  }
}

return NextResponse.json({
  result,
  model: MODEL,
  inputTokens,
  outputTokens,
  sessionId, // Return session ID if saved
})
```

### Create `/api/sessions/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Fetch user's sessions
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
  
  return NextResponse.json({ sessions })
}
```

### Update Types

Add to `src/types/index.ts`:

```typescript
export interface Session {
  id: string
  user_id: string
  use_case_id: string
  answers: Record<string, string | string[] | number>
  result: string
  model: string
  input_tokens: number
  output_tokens: number
  created_at: string
}

export interface GenerateResponse {
  result: string
  model: string
  inputTokens: number
  outputTokens: number
  sessionId?: string | null // Added
}

export interface SessionsResponse {
  sessions: Session[]
}
```

## Success Criteria

- [ ] `/api/generate` saves sessions to database for authenticated users
- [ ] `/api/generate` returns sessionId when session is saved
- [ ] `/api/generate` works for guest users (no DB save, no error)
- [ ] `/api/sessions` returns authenticated user's session history
- [ ] `/api/sessions` returns 401 for unauthenticated requests
- [ ] Sessions ordered newest first
- [ ] Build passes, lint passes, TypeScript strict mode passes
- [ ] Codex review approves

## Testing

After implementation:
1. Sign in as authenticated user
2. Complete a use case → generate AI result
3. Check response includes `sessionId`
4. Call `/api/sessions` → should return the session
5. Complete another use case
6. Call `/api/sessions` → should return both sessions, newest first
7. Sign out
8. Complete use case as guest → should work but no sessionId returned
9. Call `/api/sessions` as guest → should return 401

## Branch & PR

- **Branch:** `phase-2/persistence`
- **PR Title:** "Phase 2 Task 3: Session Persistence"

## Notes

- Session saving happens AFTER Claude API succeeds (don't save failed attempts)
- Guest sessions don't get saved to DB (Task 4 will handle migration on signup)
- Use `supabase.auth.getUser()` to check auth status
- RLS policies from Task 1 ensure users can only see their own sessions

---

*Created: 2026-02-14 17:40 EST*
