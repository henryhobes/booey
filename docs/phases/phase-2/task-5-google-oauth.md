# Phase 2 Task 5: Replace Magic Link with Google OAuth

## Context
Supabase free tier has severe rate limits on magic link emails (2 total/hour for entire project). This blocks users and makes the app unusable. Switching to Google OAuth provides better UX for target demographic (40-60 year olds all have Gmail) and eliminates email rate limits entirely.

## Goal
Replace magic link authentication with Google OAuth ("Sign in with Google" button).

## Scope

1. **Configure Google OAuth in Supabase**
   - Enable Google provider in Supabase Auth settings
   - Add OAuth redirect URLs (localhost + production)
   - Note: Google OAuth client credentials should already exist (Henry has used Supabase before)

2. **Update Sign-In Page**
   - Replace email input + magic link button with "Sign in with Google" button
   - Use Supabase's `signInWithOAuth({ provider: 'google' })`
   - Keep the same clean, simple UI style
   - Show loading state during OAuth redirect

3. **Update Auth Callback**
   - Already exists at `/auth/callback` — verify it works with OAuth flow
   - Should handle both success and error cases
   - Preserve `next` parameter for post-auth redirect

4. **Remove Magic Link Code**
   - Remove email input handling from SignIn component
   - Keep error handling for OAuth failures
   - Update messaging (no more "Check your email")

5. **Update Documentation**
   - Update Phase 2 OVERVIEW.md to reflect OAuth instead of magic links
   - Update task-2-auth.md to document the change
   - Note in README.md that Google sign-in is used

## Implementation Details

### Supabase Configuration

In Supabase dashboard (https://nyvsmvvjvktmdhwwxaqu.supabase.co):
1. Go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - Production URL when deployed
4. If Google OAuth client doesn't exist, create one at https://console.cloud.google.com/apis/credentials
   - Authorized redirect URIs: `https://nyvsmvvjvktmdhwwxaqu.supabase.co/auth/v1/callback`

### Updated Sign-In Component

Replace `/src/components/auth/SignIn.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function handleGoogleSignIn() {
    try {
      setLoading(true)
      setError(null)
      
      // Get next parameter from URL
      const params = new URLSearchParams(window.location.search)
      const next = params.get('next') || '/'

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
      setLoading(false)
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Sign In</h2>
        <p className="text-base-content/70 mb-6">
          Sign in with your Google account to save your results and unlock unlimited use.
        </p>
        
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn btn-primary btn-lg w-full"
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>
      </div>
    </div>
  )
}
```

### Auth Callback (already exists)

The existing `/auth/callback/route.ts` should work as-is. Verify it handles:
- OAuth code exchange
- Error cases
- `next` parameter redirect

### Testing Checklist

- [ ] Supabase Google OAuth configured
- [ ] "Sign in with Google" button renders
- [ ] Click button → redirects to Google OAuth consent screen
- [ ] After Google auth → redirects back to `/auth/callback`
- [ ] Callback exchanges code for session
- [ ] User redirected to `next` parameter URL (or `/` default)
- [ ] Nav bar shows user as signed in
- [ ] `/history` accessible when authenticated
- [ ] Sign out works
- [ ] Build passes, lint passes

## Success Criteria

- ✅ Google OAuth configured in Supabase
- ✅ Sign-in page shows "Sign in with Google" button
- ✅ Clicking button opens Google OAuth consent screen
- ✅ After Google auth, user is signed in to Booey
- ✅ Session persists across page reloads
- ✅ Protected routes work (/history)
- ✅ Sign out clears session
- ✅ No magic link code remains
- ✅ Build passes, lint passes
- ✅ Frank tests in browser with Henry's Google account

## Notes

- Keep auth callback route as-is (already handles OAuth)
- Keep middleware as-is (already protects routes)
- Keep useUser hook as-is (already subscribes to auth changes)
- Only SignIn component needs changes
- Remove magic link email configuration from Supabase after confirming OAuth works
- Google sign-in is more familiar to 40-60 year old demographic
- No email rate limits with OAuth
- One-click sign-in vs checking email for magic link

---

*Created: 2026-02-14 18:11 EST*
*Reason: Supabase magic link rate limits (2 emails/hour) blocking users*
