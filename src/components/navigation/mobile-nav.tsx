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
        className="inline-flex min-h-11 items-center rounded-md px-3 py-2 font-mono text-sm lowercase text-text transition-colors duration-200 ease-productive hover:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Menu
      </button>
      <div
        id="mobile-navigation"
        className={cn(
          "overflow-hidden transition-[max-height,opacity,transform] duration-200 ease-productive",
          open
            ? "max-h-96 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-1 opacity-0"
        )}
      >
        <div className="mt-3 rounded-lg border border-border/70 bg-bg-elevated p-3">
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
