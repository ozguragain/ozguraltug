"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavigationItem } from "@/content/site/navigation";
import { cn } from "@/lib/utils";

type SiteNavProps = {
  items: NavigationItem[];
  orientation?: "horizontal" | "vertical";
  onNavigateAction?: () => void;
};

export function SiteNav({
  items,
  orientation = "horizontal",
  onNavigateAction,
}: SiteNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul
        className={cn(
          "flex gap-3 sm:gap-5",
          orientation === "horizontal"
            ? "items-center"
            : "flex-col items-start",
        )}
      >
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname?.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigateAction}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive ? "true" : undefined}
                className={cn(
                  "nav-underline relative inline-flex min-h-10 items-center text-[0.95rem] font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive ? "text-text" : "text-text-muted hover:text-text",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
