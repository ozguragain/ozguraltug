"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { navigationItems } from "@/content/site/navigation";

import { Container } from "../layout/container";
import { MobileNav } from "./mobile-nav";
import { SiteNav } from "./site-nav";
import { ThemeToggle } from "../theme/theme-toggle";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / 80, 1);
      const bgOpacity = 0.38 + progress * 0.22;
      const blur = 28 + progress * 20;
      header.style.setProperty("--header-bg-opacity", String(bgOpacity));
      header.style.setProperty("--header-blur", `${blur}px`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 site-header">
      <Container size="content">
        <div className="hidden min-h-[var(--header-height)] items-center md:flex">
          <div className="mx-auto flex w-full max-w-[var(--max-width-frame)] items-center justify-between">
            <SiteNav items={navigationItems} />
            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="flex min-h-[var(--header-height)] items-center justify-between gap-4 md:hidden">
          <Link
            href="/"
            className="pressable rounded-lg px-2.5 py-2 font-mono text-base font-medium lowercase text-text/85 text-gray-700 dark:text-gray-400 transition-[color,background-color,transform] duration-160 ease-out hover:bg-black/[0.03] dark:hover:bg-white/[0.04] hover:text-text"
          >
            about
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <MobileNav items={navigationItems} />
          </div>
        </div>
      </Container>
    </header>
  );
}
