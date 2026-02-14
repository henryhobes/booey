import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Your History</h1>
      
      <div className="alert alert-info mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Signed in as: <strong>{user.email}</strong></span>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Session History</h2>
          <p className="text-base-content/70">
            Your completed use case sessions will appear here. This feature will be fully implemented in a future phase.
          </p>
          <div className="divider"></div>
          <p className="text-sm text-base-content/60">
            For now, this page demonstrates that authentication is working correctly! 🎉
          </p>
        </div>
      </div>
    </div>
  )
}
