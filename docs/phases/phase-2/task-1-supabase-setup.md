# Phase 2 Task 1: Supabase Setup + Schema + Client Utilities

## Goal
Set up Supabase integration with database schema and client utilities for auth and database access.

## Scope

1. **Install dependencies**
   - `@supabase/supabase-js`
   - `@supabase/ssr`

2. **Create database schema**
   - Sessions table with proper columns and types
   - Row Level Security (RLS) policies
   - Run migration via Supabase dashboard SQL editor

3. **Create Supabase client utilities**
   - `src/lib/supabase/client.ts` - Browser client
   - `src/lib/supabase/server.ts` - Server client (for API routes)
   - `src/lib/supabase/middleware.ts` - Middleware for auth

4. **Environment variables**
   - Already added to `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
     - `SUPABASE_SECRET_KEY`

## Database Schema

```sql
-- Sessions table
create table sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  use_case_id text not null,
  answers jsonb not null,
  result text not null,
  model text not null,
  input_tokens int,
  output_tokens int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table sessions enable row level security;

-- Users can view their own sessions
create policy "Users can view own sessions"
  on sessions for select
  using (auth.uid() = user_id);

-- Users can insert their own sessions
create policy "Users can insert own sessions"
  on sessions for insert
  with check (auth.uid() = user_id);

-- Create index for faster queries
create index sessions_user_id_created_at_idx on sessions (user_id, created_at desc);
```

## Implementation Details

### Browser Client (`src/lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

### Server Client (`src/lib/supabase/server.ts`)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component, cannot set cookies
          }
        },
      },
    }
  )
}
```

### Middleware (`src/lib/supabase/middleware.ts`)
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  return supabaseResponse
}
```

### Root Middleware (`src/middleware.ts`)
```typescript
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## Success Criteria

- [ ] Dependencies installed (`@supabase/supabase-js`, `@supabase/ssr`)
- [ ] Database schema created in Supabase (sessions table with RLS policies)
- [ ] Supabase client utilities created (client.ts, server.ts, middleware.ts)
- [ ] Root middleware.ts configured
- [ ] Can create a Supabase client and verify connection (no errors in dev server)

## Testing

After implementation:
1. Dev server starts without errors
2. Can import and call `createClient()` from both browser and server contexts
3. Supabase dashboard shows the sessions table with correct schema
4. RLS policies are active

## Branch & PR

- **Branch:** `phase-2/supabase-setup`
- **PR Title:** "Phase 2 Task 1: Supabase Setup + Schema + Client Utilities"

## Notes

- Use the new Supabase publishable/secret key naming (not anon/service_role)
- Follow Supabase SSR docs for Next.js App Router
- SQL migration should be run manually in Supabase dashboard SQL editor (include in PR description)

---

*Created: 2026-02-14 16:33 EST*
