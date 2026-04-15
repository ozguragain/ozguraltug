import Link from "next/link";

import { navigationItems } from "@/content/site/navigation";

import { Container } from "../layout/container";
import { MobileNav } from "./mobile-nav";
import { SiteNav } from "./site-nav";
import { ThemeToggle } from "../theme/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 site-header">
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
            className="rounded-sm py-2 font-mono text-base lowercase text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
