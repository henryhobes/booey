import { SignIn } from '@/components/auth/SignIn'
import { Suspense } from 'react'

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="skeleton h-8 w-32 mb-4"></div>
            <div className="skeleton h-4 w-full mb-6"></div>
            <div className="skeleton h-12 w-full"></div>
          </div>
        </div>
      }>
        <SignIn />
      </Suspense>
    </div>
  )
}
