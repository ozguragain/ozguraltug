"use client";

import type { ReactNode } from "react";
import { SessionKeeper } from "@/components/auth/session-keeper";

type EditorShellProps = {
  children: ReactNode;
};

export function EditorShell({ children }: EditorShellProps) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <SessionKeeper />
      {children}
    </div>
  );
}