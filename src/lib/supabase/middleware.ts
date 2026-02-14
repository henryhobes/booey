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
          cookiesToSet.forEach(({ name, value }) =>
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

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes that require authentication
  const protectedPaths = ['/history', '/profile']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Redirect to sign in if accessing protected route without auth
  if (isProtectedPath && !user) {
    const signInUrl = new URL('/auth/sign-in', request.url)
    signInUrl.searchParams.set('next', request.nextUrl.pathname)
    const redirectResponse = NextResponse.redirect(signInUrl)
    // Preserve any cookies set by Supabase
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie)
    })
    return redirectResponse
  }

  // Redirect authenticated users away from sign-in page
  if (request.nextUrl.pathname === '/auth/sign-in' && user) {
    const redirectResponse = NextResponse.redirect(new URL('/', request.url))
    // Preserve refreshed auth cookies
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie)
    })
    return redirectResponse
  }

  return supabaseResponse
}
