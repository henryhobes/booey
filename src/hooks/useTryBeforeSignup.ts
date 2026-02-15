'use client';

import { useState, useCallback, useEffect } from 'react';
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

export function useTryBeforeSignup() {
  const { user } = useUser();
  // Always start with DEFAULT_STATE to match server render
  const [guestState, setGuestState] = useState<GuestState>(DEFAULT_STATE);

  // Load from localStorage after mount (client-side only, after hydration)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Required for Next.js SSR/hydration pattern: start with default state to match server, then hydrate from localStorage client-side
        setGuestState(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

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
