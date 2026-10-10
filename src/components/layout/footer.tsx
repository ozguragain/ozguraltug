"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { navigationItems } from "@/content/site/navigation";
import { profile } from "@/content/site/profile";

import { Container } from "./container";

export function Footer() {
  const pathname = usePathname();
  const isWritingPost = pathname?.startsWith("/writing/") && pathname !== "/writing";
  // P0: do not hide footer on post pages — keep visible for IA/a11y
  void isWritingPost;

  return (
    <footer className="py-16 sm:py-20">
      <Container size="prose">
        <div className="w-full space-y-10 border-t border-border/10 pt-10">
          <div className="grid gap-10 sm:grid-cols-2">
            <nav aria-label="Footer">
              <ul className="space-y-5">
                {navigationItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-11 items-center rounded-sm text-[1rem] text-text-muted transition-[color,transform] duration-[140ms] ease-out active:scale-[0.96] hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="sm:justify-self-end">
              <ul className="space-y-5 text-left sm:text-right">
                {profile.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer noopener" : undefined}
                      className="inline-flex min-h-11 items-center rounded-sm text-[1rem] text-text-muted transition-[color,transform] duration-[140ms] ease-out active:scale-[0.96] hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
