'use client';

import { useEffect, useState } from 'react';

interface Quota {
  dailyUsed: number;
  dailyLimit: number;
}

export function QuotaBadge() {
  const [quota, setQuota] = useState<Quota | null>(null);

  useEffect(() => {
    fetch('/api/quota')
      .then((res) => res.json())
      .then((data) => setQuota(data))
      .catch(() => {});
  }, []);

  if (!quota) return null;

  const remaining = quota.dailyLimit - quota.dailyUsed;
  const isLow = remaining <= 5;
  const isDepleted = remaining <= 0;

  return (
    <div
      className={`badge badge-sm ${
        isDepleted ? 'badge-error' : isLow ? 'badge-warning' : 'badge-ghost'
      }`}
      title={`${remaining} of ${quota.dailyLimit} daily interactions remaining`}
    >
      {remaining}/{quota.dailyLimit} left
    </div>
  );
}
