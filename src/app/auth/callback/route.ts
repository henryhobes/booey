import { createClient } from '@/lib/supabase/server'
import { getBaseUrl } from '@/lib/utils/get-base-url'
import { NextRequest, NextResponse } from 'next/server'

/**
 * OAuth callback handler
 * 
 * Handles OAuth redirects from providers (Google, etc.) and exchanges
 * the authorization code for a session. Uses dynamic base URL to support
 * production (booey.ai), preview deployments (*.vercel.app), and local dev.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      const baseUrl = getBaseUrl()
      return NextResponse.redirect(new URL('/auth/error', baseUrl))
    }
  }

  // Validate that 'next' is a relative path (prevent open redirect)
  // Reject '//', backslashes, and anything that could be interpreted as external
  const isValidPath = next.startsWith('/') && 
                      !next.startsWith('//') && 
                      !next.includes('\\')
  const redirectPath = isValidPath ? next : '/'

  // Use dynamic base URL to support different deployment environments
  const baseUrl = getBaseUrl()
  return NextResponse.redirect(new URL(redirectPath, baseUrl))
}
