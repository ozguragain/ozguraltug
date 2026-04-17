"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const REFRESH_INTERVAL = 15 * 60 * 1000;

export function SessionKeeper() {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch("/api/auth", { method: "GET" });
        if (!res.ok) {
          router.push("/login?redirect=" + window.location.pathname);
        }
      } catch {
        router.push("/login?redirect=" + window.location.pathname);
      }
    };

    intervalRef.current = setInterval(refresh, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [router]);

  return null;
}
