'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Session } from '@/types';

export default function HistoryPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/sign-in?next=/history');
      return;
    }

    async function fetchSessions() {
      try {
        const res = await fetch('/api/sessions');
        if (!res.ok) throw new Error('Failed to fetch sessions');
        const data = await res.json();
        setSessions(data.sessions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex flex-col items-center justify-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/70">Loading your history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="alert alert-error" role="alert">
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Ready to try your first tool?</h1>
        <p className="text-base-content/70 text-lg mb-6">
          Pick any tool from the home page. It only takes 2 minutes, and you can&apos;t break anything!
        </p>
        <Link href="/explore" className="btn btn-primary btn-lg">
          Browse Tools
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Your History</h1>
      <div className="space-y-4">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const [expanded, setExpanded] = useState(false);

  const useCaseTitle = session.use_case_id
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const timestamp = new Date(session.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="card-title">{useCaseTitle}</h3>
            <p className="text-sm text-base-content/70">{timestamp}</p>
          </div>
        </div>

        <div className={expanded ? '' : 'line-clamp-3'}>
          <p className="mt-2 whitespace-pre-wrap">{session.result}</p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="btn btn-ghost btn-sm mt-2 self-start"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      </div>
    </div>
  );
}
