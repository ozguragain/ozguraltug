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
        "inline-flex min-h-11 items-center text-[0.95rem] font-[450] tracking-[-0.01em] transition-[color,transform] duration-[140ms] ease-out will-change-transform active:scale-[0.96] active:duration-100 focus-visible:outline-none",
        active ? "text-text" : "text-text-soft hover:text-text",
      )}
    >
      Home
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const homeActive = pathname === "/";

  return (
    <header className="site-header w-full py-2.5 sm:py-3">
      <Container size="prose">
        <div className="hidden items-center justify-between gap-8 md:flex">
          <HomeLink active={homeActive} />
          <div className="flex items-center gap-2">
            <SiteNav items={navigationItems} />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 sm:gap-8 md:hidden">
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
