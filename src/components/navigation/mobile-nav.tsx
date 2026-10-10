"use client";

import { useEffect, useRef, useState } from "react";

import type { NavigationItem } from "@/content/site/navigation";
import { cn } from "@/lib/utils";

import { SiteNav } from "./site-nav";

type MobileNavProps = {
  items: NavigationItem[];
};

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Body scroll lock + focus first link (rAF ensures panel is painted)
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const frame = requestAnimationFrame(() => {
        panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      });
      return () => {
        cancelAnimationFrame(frame);
        document.body.style.overflow = prev;
      };
    }
    document.body.style.overflow = "";
  }, [open]);

  // Restore focus to trigger on close (skip initial mount)
  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (prevOpenRef.current && !open) triggerRef.current?.focus();
    prevOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  // Focus trap — cycle Tab within panel (compositor-safe)
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener("keydown", onKeyDown as unknown as EventListener);
    return () => panel.removeEventListener("keydown", onKeyDown as unknown as EventListener);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center rounded-md border border-border/50 px-3.5 text-[0.95rem] font-medium text-text-soft transition-[background-color,color,transform] duration-fast ease-out hover:bg-bg-muted hover:text-text active:scale-[0.97] active:bg-bg-muted/80 active:duration-instant"
      >
        Menu
      </button>

      {/* Backdrop — flat, no blur (compositor-only) */}
      <button
        type="button"
        aria-hidden={!open}
        aria-label="Close menu"
        tabIndex={-1}
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-30 bg-bg/60 transition-opacity ease-out",
          open
            ? "opacity-100 duration-[200ms]"
            : "pointer-events-none opacity-0 duration-[140ms]",
        )}
      />

      <div
        id="mobile-navigation"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        {...(!open ? ({ inert: true } as unknown as React.HTMLAttributes<HTMLDivElement>) : {})}
        aria-hidden={!open}
        className={cn(
          "fixed inset-x-0 top-[var(--header-height)] z-40 grid px-4 transition-[transform,opacity] sm:px-6",
          open
            ? "translate-y-0 opacity-100 duration-[200ms] ease-out-strong"
            : "pointer-events-none -translate-y-2 opacity-0 duration-[140ms] ease-out",
        )}
      >
        <div
          className="overflow-hidden rounded-lg border border-border/50 bg-bg-elevated p-3 shadow-[0_16px_40px_-16px_hsl(0_0%_0%_/_0.45)]"
          data-open={open ? "true" : "false"}
        >
          <div className="mobile-nav-stagger" data-open={open ? "true" : "false"}>
            <SiteNav
              items={items}
              orientation="vertical"
              onNavigateAction={() => setOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
