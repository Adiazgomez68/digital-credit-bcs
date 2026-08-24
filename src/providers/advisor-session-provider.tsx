"use client";

import { useAdvisorRefresh } from "@/hooks/use-advisor-auth";
import type { AdvisorSessionResponse } from "@/types/advisor";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Refresh a bit before the token actually expires, not exactly at the deadline.
const REFRESH_BUFFER_MS = 10_000;

interface AdvisorSession {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

interface AdvisorSessionContextValue {
  session: AdvisorSession | null;
  startSession: (response: AdvisorSessionResponse) => void;
  clearSession: () => void;
}

const AdvisorSessionContext = createContext<AdvisorSessionContextValue | null>(
  null,
);

export function AdvisorSessionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = useState<AdvisorSession | null>(null);
  const { mutate: refresh } = useAdvisorRefresh();

  const startSession = useCallback((response: AdvisorSessionResponse) => {
    setSession({
      token: response.token,
      refreshToken: response.refreshToken,
      expiresAt: Date.now() + response.expiresIn * 1000,
    });
  }, []);

  const clearSession = useCallback(() => {
    setSession(null);
  }, []);

  // Reschedules the auto-refresh every time a new session starts.
  useEffect(() => {
    if (!session) return;

    const delay = Math.max(
      session.expiresAt - Date.now() - REFRESH_BUFFER_MS,
      0,
    );

    const timeoutId = setTimeout(() => {
      refresh(session.refreshToken, {
        onSuccess: startSession,
        onError: clearSession,
      });
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [session, refresh, startSession, clearSession]);

  const values = useMemo(
    () => ({ session, startSession, clearSession }),
    [session, startSession, clearSession],
  );

  return (
    <AdvisorSessionContext.Provider value={values}>
      {children}
    </AdvisorSessionContext.Provider>
  );
}

export function useAdvisorSession() {
  const context = useContext(AdvisorSessionContext);

  if (!context) {
    throw new Error(
      "useAdvisorSession must be used within an AdvisorSessionProvider",
    );
  }

  return context;
}
