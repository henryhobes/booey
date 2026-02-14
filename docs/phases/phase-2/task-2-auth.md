# Phase 2 Task 2: Magic Link Auth UI + Flow

## Goal
Implement passwordless magic link authentication using Supabase Auth.

## Scope

1. **Sign in/sign up UI component**
   - Single email input form
   - "Sign in with magic link" button
   - Loading state while sending email
   - Success message: "Check your email for a login link"
   - Error handling for invalid emails or API failures

2. **Magic link email flow**
   - Supabase sends magic link email automatically
   - User clicks link → redirected back to app → authenticated
   - Handle auth callback route (`/auth/callback`)

3. **Auth state management**
   - Server-side session checking (for protected routes)
   - Client-side auth state hook (for UI)
   - User context provider for React components

4. **Protected route middleware**
   - Redirect unauthenticated users to sign-in page
   - Allow public routes: `/`, `/use/[id]`, `/auth/*`
   - Protect: `/history`, `/api/sessions`

5. **Sign out functionality**
   - Sign out button in nav (only when authenticated)
   - Clear session and redirect to home

## Implementation Details

### Sign In Component (`src/components/auth/SignIn.tsx`)
```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for a login link!' })
    }
  }

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Sign in with magic link'}
      </button>
      {message && <div className={message.type}>{message.text}</div>}
    </form>
  )
}
```

### Auth Callback Route (`src/app/auth/callback/route.ts`)
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to home or intended destination
  return NextResponse.redirect(requestUrl.origin)
}
```

### User Hook (`src/hooks/useUser.ts`)
```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, loading }
}
```

### Sign Out Function
```typescript
const supabase = createClient()
await supabase.auth.signOut()
```

### Update Nav Bar
Add sign out button that only shows when user is authenticated:
```tsx
const { user } = useUser()

{user && (
  <button onClick={handleSignOut}>Sign out</button>
)}
```

## Success Criteria

- [ ] Sign in form accepts email and sends magic link
- [ ] Magic link email arrives in inbox
- [ ] Clicking magic link logs user in and redirects to app
- [ ] Auth callback route exchanges code for session
- [ ] `useUser` hook provides current user state
- [ ] Sign out button clears session
- [ ] Protected routes redirect unauthenticated users
- [ ] Public routes remain accessible without auth
- [ ] Build passes, lint passes, TypeScript strict mode passes
- [ ] Codex review approves

## Testing

After implementation:
1. Visit app, not signed in
2. Go to `/history` → should redirect to sign-in
3. Enter email → see "Check your email" message
4. Check email inbox → magic link received
5. Click magic link → redirected to app, now authenticated
6. Nav shows "Sign out" button
7. Can access `/history` now
8. Click sign out → session cleared, redirected to home
9. `/history` again redirects to sign-in

## Branch & PR

- **Branch:** `phase-2/auth`
- **PR Title:** "Phase 2 Task 2: Magic Link Auth UI + Flow"

## Notes

- Supabase automatically handles magic link email sending (no custom email needed)
- Email redirect URL must be added to Supabase Auth settings (Redirect URLs allowlist)
- Session stored in cookies via middleware from Task 1
- DaisyUI form components for consistent styling

---

*Created: 2026-02-14 16:49 EST*
