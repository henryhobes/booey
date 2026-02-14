import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
    }
  }

  // Validate that 'next' is a relative path (prevent open redirect)
  // Reject '//', backslashes, and anything that could be interpreted as external
  const isValidPath = next.startsWith('/') && 
                      !next.startsWith('//') && 
                      !next.includes('\\')
  const redirectPath = isValidPath ? next : '/'

  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
}
