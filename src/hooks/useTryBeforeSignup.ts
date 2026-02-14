'use client';

import { useState, useCallback } from 'react';
import { useUser } from './useUser';

interface GuestState {
  usedFreeUse: boolean;
  guestSession: {
    useCaseId: string;
    answers: Record<string, string | string[] | number>;
    result: string;
  } | null;
}

const STORAGE_KEY = 'booey_guest_state';

const DEFAULT_STATE: GuestState = {
  usedFreeUse: false,
  guestSession: null,
};

function getInitialState(): GuestState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return DEFAULT_STATE;
}

export function useTryBeforeSignup() {
  const { user } = useUser();
  const [guestState, setGuestState] = useState<GuestState>(getInitialState);

  const canUseAsGuest = useCallback((): boolean => {
    if (user) return true;
    return !guestState.usedFreeUse;
  }, [user, guestState.usedFreeUse]);

  const markGuestUseComplete = useCallback(
    (session: { useCaseId: string; answers: Record<string, string | string[] | number>; result: string }) => {
      const newState: GuestState = {
        usedFreeUse: true,
        guestSession: session,
      };
      setGuestState(newState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    },
    [],
  );

  const clearGuestState = useCallback(() => {
    setGuestState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    canUseAsGuest,
    markGuestUseComplete,
    clearGuestState,
    hasUsedFreeUse: guestState.usedFreeUse,
    guestSession: guestState.guestSession,
  };
}
