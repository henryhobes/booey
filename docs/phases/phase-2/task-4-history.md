# Phase 2 Task 4: History Page + Try-Before-Signup Logic

## Goal
Build a history page that shows saved sessions, and implement try-before-signup flow for guest users.

## Scope

1. **History Page (`/history`)**
   - Display user's saved sessions from `/api/sessions`
   - Show newest first
   - Card layout with: use case title/icon, result preview, timestamp
   - Click to expand and see full result
   - Empty state: "You haven't used any tools yet"
   - Loading state while fetching

2. **Try-Before-Signup Logic**
   - Guest users can complete ONE use case without signing up
   - Track guest usage in localStorage: `{ usedFreeUse: boolean, guestSession: Session | null }`
   - After first use, show modal/banner: "Sign up to save your results and unlock unlimited use"
   - On second attempt, redirect to `/auth/sign-in?next=/use/[id]`

3. **Guest Session Migration** (bonus)
   - When guest user signs up, migrate their localStorage session to DB
   - Clear localStorage after migration
   - Show success message: "Your session has been saved!"

## Implementation Details

### History Page (`src/app/history/page.tsx`)

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import type { Session } from '@/types'

export default function HistoryPage() {
  const { user, loading: authLoading } = useUser()
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      router.push('/auth/sign-in?next=/history')
      return
    }

    fetchSessions()
  }, [user, authLoading, router])

  async function fetchSessions() {
    try {
      const res = await fetch('/api/sessions')
      if (!res.ok) throw new Error('Failed to fetch sessions')
      const data = await res.json()
      setSessions(data.sessions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">Error: {error}</div>
  }

  if (sessions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your History</h1>
        <p className="text-base-content/70">You haven't used any tools yet.</p>
        <a href="/" className="btn btn-primary mt-4">Browse Tools</a>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your History</h1>
      <div className="space-y-4">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  )
}

function SessionCard({ session }: { session: Session }) {
  const [expanded, setExpanded] = useState(false)
  
  // Get use case details from session.use_case_id
  const useCaseTitle = session.use_case_id.replace(/-/g, ' ')
  const timestamp = new Date(session.created_at).toLocaleDateString()

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="card-title capitalize">{useCaseTitle}</h3>
        <p className="text-sm text-base-content/70">{timestamp}</p>
        
        <div className={expanded ? '' : 'line-clamp-3'}>
          <p className="mt-2">{session.result}</p>
        </div>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="btn btn-ghost btn-sm mt-2"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      </div>
    </div>
  )
}
```

### Try-Before-Signup Hook (`src/hooks/useTryBeforeSignup.ts`)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useUser } from './useUser'

interface GuestState {
  usedFreeUse: boolean
  guestSession: any | null
}

export function useTryBeforeSignup() {
  const { user } = useUser()
  const [guestState, setGuestState] = useState<GuestState>({
    usedFreeUse: false,
    guestSession: null,
  })

  useEffect(() => {
    // Load guest state from localStorage
    const stored = localStorage.getItem('booey_guest_state')
    if (stored) {
      setGuestState(JSON.parse(stored))
    }
  }, [])

  function canUseAsGuest(): boolean {
    if (user) return true // Authenticated users can always use
    return !guestState.usedFreeUse
  }

  function markGuestUseComplete(session: any) {
    const newState = {
      usedFreeUse: true,
      guestSession: session,
    }
    setGuestState(newState)
    localStorage.setItem('booey_guest_state', JSON.stringify(newState))
  }

  function clearGuestState() {
    setGuestState({ usedFreeUse: false, guestSession: null })
    localStorage.removeItem('booey_guest_state')
  }

  return {
    canUseAsGuest,
    markGuestUseComplete,
    clearGuestState,
    hasUsedFreeUse: guestState.usedFreeUse,
    guestSession: guestState.guestSession,
  }
}
```

### Update Wizard to Use Try-Before-Signup

In `src/components/wizard/Wizard.tsx`, after receiving AI result:

```typescript
import { useTryBeforeSignup } from '@/hooks/useTryBeforeSignup'

// In component:
const { user } = useUser()
const { canUseAsGuest, markGuestUseComplete, hasUsedFreeUse } = useTryBeforeSignup()

// After successful generation:
if (!user) {
  markGuestUseComplete({ result, useCaseId, answers })
}

// Show signup prompt for guests after first use:
{!user && hasUsedFreeUse && (
  <div className="alert alert-info mt-4">
    <p>Sign up to save your results and unlock unlimited use!</p>
    <a href="/auth/sign-in" className="btn btn-sm btn-primary">Sign Up</a>
  </div>
)}
```

### Guest Check in `/use/[id]` Page

Before allowing wizard to proceed:

```typescript
const { canUseAsGuest } = useTryBeforeSignup()

if (!canUseAsGuest()) {
  router.push(`/auth/sign-in?next=/use/${params.id}`)
  return
}
```

## Success Criteria

- [ ] `/history` page displays user's saved sessions
- [ ] Sessions show newest first
- [ ] Expand/collapse session details
- [ ] Empty state when no sessions
- [ ] Loading state while fetching
- [ ] Guest users can complete 1 free use case
- [ ] After first use, guest sees signup prompt
- [ ] On second attempt, guest redirected to sign-in
- [ ] Guest state stored in localStorage
- [ ] Build passes, lint passes, TypeScript strict mode passes
- [ ] Codex review approves

## Testing

After implementation:
1. **As guest:**
   - Complete a use case → see result, get signup prompt
   - Try to use another → redirected to sign-in
   - Sign up → original session migrated to DB
   - Visit `/history` → see saved session

2. **As authenticated user:**
   - Complete multiple use cases
   - Visit `/history` → see all sessions
   - Click expand → see full result
   - Sessions ordered newest first

## Branch & PR

- **Branch:** `phase-2/history`
- **PR Title:** "Phase 2 Task 4: History Page + Try-Before-Signup Logic"

## Notes

- Depends on Task 3 (session persistence API)
- localStorage key: `booey_guest_state`
- Guest session migration is nice-to-have (can be simplified or deferred)
- Use DaisyUI alert/modal components for signup prompts

---

*Created: 2026-02-14 17:40 EST*
