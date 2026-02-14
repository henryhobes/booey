import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl text-error">Authentication Error</h2>
          <p className="text-base-content/70 my-4">
            Something went wrong while trying to sign you in. Please try again.
          </p>
          <div className="card-actions">
            <Link href="/auth/sign-in" className="btn btn-primary w-full">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
