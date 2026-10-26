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
          "flex gap-4 sm:gap-6",
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
                  "inline-flex min-h-11 items-center text-[0.95rem] font-[450] underline-offset-[2px] transition-colors duration-fast ease-out active:scale-[0.96] active:duration-instant focus-visible:outline-none",
                  isActive
                    ? "text-text underline decoration-text/60"
                    : "text-text-soft hover:text-text hover:underline hover:decoration-text/60",
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
