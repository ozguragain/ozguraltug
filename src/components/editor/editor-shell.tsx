"use client";

import type { ReactNode } from "react";

type EditorShellProps = {
  children: ReactNode;
};

export function EditorShell({ children }: EditorShellProps) {
  return (
    <div className="min-h-screen bg-bg text-text">
      {children}
    </div>
  );
}