"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/content/site/navigation";
import { cn } from "@/lib/utils";

import { Container } from "../layout/container";
import { MobileNav } from "./mobile-nav";
import { SiteNav } from "./site-nav";
import { ThemeToggle } from "../theme/theme-toggle";

function HomeLink({ active }: { active: boolean }) {
  return (
    <Link
      href="/"
      aria-current={active ? "page" : undefined}
      data-active={active ? "true" : undefined}
      className={cn(
        "nav-underline relative inline-flex min-h-10 items-center text-[0.95rem] font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "text-text" : "text-text-muted hover:text-text",
      )}
    >
      home
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const homeActive = pathname === "/";

  return (
    <header className="sticky top-0 z-50 site-header">
      <Container size="content">
        <div className="hidden min-h-[var(--header-height)] items-center md:flex">
          <div className="mx-auto flex w-full max-w-[var(--max-width-prose)] items-center justify-between gap-6">
            <HomeLink active={homeActive} />
            <div className="flex items-center gap-2">
              <SiteNav items={navigationItems} />
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="flex min-h-[var(--header-height)] items-center justify-between gap-4 md:hidden">
          <HomeLink active={homeActive} />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <MobileNav items={navigationItems} />
          </div>
        </div>
      </Container>
    </header>
  );
}
