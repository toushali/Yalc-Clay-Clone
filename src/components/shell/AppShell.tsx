"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import { Spinner } from "@/components/ui";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

/**
 * Client shell: gates on the mock session, hydrates the store once, and lays
 * out sidebar + top bar + canvas. Unauthenticated visits redirect to /login.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, loading } = useSession();
  const hydrate = useAppStore((s) => s.hydrate);
  const hydrated = useAppStore((s) => s.hydrated);

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session, router]);

  useEffect(() => {
    if (session) hydrate();
  }, [session, hydrate]);

  if (loading || !session || !hydrated) {
    return (
      <div className="grid h-screen place-items-center bg-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-text">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
