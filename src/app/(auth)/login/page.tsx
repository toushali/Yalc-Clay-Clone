"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";
import { Button, Input } from "@/components/ui";

/** Mock login (F1.1). Any credentials succeed; a fake session is stored. */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email.trim() || "you@example.com");
    router.replace("/app");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-bg-subtle p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-text">Yalc</h1>
          <p className="mt-1 text-sm text-text-muted">
            Sign in to your workspace
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-lg border border-border bg-bg p-6 shadow-sm"
        >
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-medium text-text-muted">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-medium text-text-muted">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
          <p className="text-center text-xs text-text-faint">
            Mock auth — any credentials work.
          </p>
        </form>
      </div>
    </main>
  );
}
