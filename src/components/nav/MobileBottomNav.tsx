'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { QuotaBadge } from './QuotaBadge'

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  )
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile navigation">
      <div className="flex justify-center py-1">
        <QuotaBadge />
      </div>
      <div className={`grid ${user ? 'grid-cols-2' : 'grid-cols-3'}`}>
        <Link
          href="/"
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          <HomeIcon />
          <span>Home</span>
        </Link>
        <Link
          href="/history"
          aria-current={pathname === '/history' ? 'page' : undefined}
        >
          <HistoryIcon />
          <span>History</span>
        </Link>
        {!user && (
          <Link
            href="/auth/sign-in"
            aria-current={pathname === '/auth/sign-in' ? 'page' : undefined}
          >
            <UserIcon />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
