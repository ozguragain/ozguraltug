"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavigationItem } from "@/content/site/navigation";
import { cn } from "@/lib/utils";

type SiteNavProps = {
  items: NavigationItem[];
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
};

export function SiteNav({
  items,
  orientation = "horizontal",
  onNavigate
}: SiteNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul
        className={cn(
          "flex gap-1.5 sm:gap-2",
          orientation === "horizontal"
            ? "items-center"
            : "flex-col items-start"
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
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-md px-2 py-1.5 font-mono text-[0.8rem] font-semibold lowercase tracking-[-0.03em] transition-colors duration-200 ease-productive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-2.5",
                  isActive
                    ? "bg-text text-bg"
                    : "text-text/92 hover:text-text"
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
