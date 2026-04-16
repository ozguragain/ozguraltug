"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { navigationItems } from "@/content/site/navigation";
import { profile } from "@/content/site/profile";

import { Container } from "./container";

export function Footer() {
  const pathname = usePathname();
  const isEditorRoute = pathname?.startsWith("/writing/");

  if (isEditorRoute) {
    return null;
  }

  return (
    <footer className="py-16 sm:py-20">
      <Container size="content">
        <div className="mx-auto w-full max-w-[var(--max-width-frame)] space-y-10 border-t border-border/70 pt-10">
          <div className="grid gap-10 sm:grid-cols-2">
            <nav aria-label="Footer">
              <ul className="space-y-5">
                {navigationItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-mono text-[1rem] text-text-muted transition-colors duration-200 ease-productive hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="sm:justify-self-end">
              <ul className="space-y-5 sm:text-right">
                {profile.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      className="font-mono text-[1rem] text-text-muted transition-colors duration-200 ease-productive hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
