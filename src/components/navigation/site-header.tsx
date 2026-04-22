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
      const bgOpacity = 0.72 + progress * 0.16;
      const blur = 20 + progress * 8;
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
            className="rounded-sm py-2 font-mono text-base lowercase text-text"
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
