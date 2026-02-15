'use client';

import Link from 'next/link';
import { UseCase } from '@/types';

interface GuestGateScreenProps {
  useCase: UseCase;
}

export default function GuestGateScreen({ useCase }: GuestGateScreenProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center p-12">
          <h2 className="text-2xl font-bold mb-4">Sign up to continue</h2>
          <p className="text-lg opacity-70 mb-6">
            You&apos;ve used your free use case. Sign up to save your results and unlock unlimited use!
          </p>
          <Link
            href={`/auth/sign-in?next=/use/${useCase.id}`}
            className="btn btn-primary btn-lg"
          >
            Sign Up / Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
