'use client'

import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QuotaBadge } from './QuotaBadge'

export function NavAuth() {
  const { user, loading } = useUser()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex gap-2">
        <div className="skeleton h-10 w-20"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <QuotaBadge />
        <Link href="/history" className="btn btn-ghost btn-sm min-h-[44px]">
          History
        </Link>
        <button onClick={handleSignOut} className="btn btn-ghost btn-sm min-h-[44px]">
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Link href="/auth/sign-in" className="btn btn-primary btn-sm min-h-[44px]">
        Sign In
      </Link>
    </div>
  )
}
