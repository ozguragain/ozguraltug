"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/writing/new";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Invalid password");
      }

      router.push(redirect);
    } catch {
      setError("Invalid password");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="block font-mono text-[0.72rem] uppercase tracking-wider text-text-muted"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded border border-border/60 bg-transparent px-3 py-2 font-mono text-[0.92rem] text-text focus:border-text-muted focus:outline-none"
          placeholder="Enter password..."
          autoFocus
        />
      </div>

      {error && (
        <p className="font-mono text-[0.82rem] text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading || !password}
        className="rounded bg-text px-4 py-2 font-mono text-[0.82rem] font-bold text-bg transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {isLoading ? "Authenticating..." : "Login"}
      </button>
    </form>
  );
}

function LoginFormFallback() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full animate-pulse rounded bg-border/40" />
      <div className="h-10 w-full animate-pulse rounded bg-border/40" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Section inset="lg">
      <Container size="content">
        <div className="mx-auto w-full max-w-[var(--max-width-frame)]">
          <div className="enter-rise space-y-8">
            <div className="space-y-2">
              <p className="font-mono text-[0.82rem] font-bold text-text-muted">
                oz@writing:~$
              </p>
              <h1 className="type-display">Editor Login</h1>
            </div>

            <Suspense fallback={<LoginFormFallback />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </Container>
    </Section>
  );
}
