"use client";

import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Japandi × Brutalism: enter-rise is restrained (240ms, 10px) — calm, not bouncy
  return (
    <div key={pathname} className="enter-rise">
      {children}
    </div>
  );
}
