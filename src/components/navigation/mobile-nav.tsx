"use client";

import { useEffect, useState } from "react";

import type { NavigationItem } from "@/content/site/navigation";
import { cn } from "@/lib/utils";

import { SiteNav } from "./site-nav";

type MobileNavProps = {
  items: NavigationItem[];
};

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
        className="pressable inline-flex min-h-10 items-center rounded-lg px-3 py-2 font-mono text-sm lowercase text-text/85 text-gray-700 dark:text-gray-400 transition-[color,background-color,transform] duration-200 ease-out hover:bg-black/[0.03] dark:hover:bg-white/[0.04] hover:text-text"
      >
        Menu
      </button>
      <div
        id="mobile-navigation"
          className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out-strong",
          open
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="mt-3 overflow-hidden rounded-xl bg-bg/60 p-3 shadow-[0_8px_32px_-12px_hsl(0_0%_0%_/_0.4),inset_0_0_0_1px_hsl(var(--color-border)/0.15)] backdrop-blur-2xl">
          <SiteNav
            items={items}
            orientation="vertical"
            onNavigateAction={() => setOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
