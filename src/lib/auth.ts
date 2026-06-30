"use client";

import { useEffect, useState } from "react";

/**
 * Mock session (F1.1). No real auth backend — any credentials succeed and a
 * session marker is kept in localStorage. Swap for real auth later without
 * touching call sites.
 */
const SESSION_KEY = "yalc:session";

export interface Session {
  email: string;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(email: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
}

export function signOut(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

/** `session === undefined` while reading; `null` once known-signed-out. */
export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    setSession(getSession());
  }, []);

  return {
    session,
    loading: session === undefined,
    signOut: () => {
      signOut();
      setSession(null);
    },
  };
}
