import Link from "next/link";
import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects and experiments.",
};

const projects = [
  {
    title: "mdp",
    description:
      "A minimal, fast, and extensible Markdown parser written in Go.",
    href: "https://github.com/ozguragain/mdp",
    external: true,
  },
  {
    title: "personal-site",
    description:
      "This website — a terminal-inspired personal site built with Next.js, markdown, and Tailwind.",
    href: "https://github.com/ozguragain/ozguraltug",
    external: true,
  },
];

export default function ProjectsPage() {
  return (
    <Section inset="lg">
      <Container size="prose">
        <div className="space-y-8">
          <header className="space-y-4">
            <h1 className="type-display">Projects</h1>
            <p className="text-[0.92rem] text-text-muted sm:text-[0.96rem]">
              Selected things I&apos;ve built.
            </p>
          </header>

          <div className="divider pt-8">
            {projects.length === 0 ? (
              <p className="text-[0.88rem] text-text-muted">
                nothing here yet — check back soon.
              </p>
            ) : (
              <ul className="space-y-6">
                {projects.map((project) => (
                  <li key={project.title}>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-[1rem] font-semibold tracking-[-0.01em] text-text">
                        {project.title}
                      </h2>
                      <span
                        aria-hidden="true"
                        className="flex-1 self-center border-t border-dashed border-border/15"
                      />
                      <Link
                        href={project.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${project.title} — open on GitHub (opens in new tab)`}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center text-[0.875rem] text-text-muted transition-colors duration-fast ease-out hover:text-text"
                      >
                        ↗<span className="sr-only"> (opens in new tab)</span>
                      </Link>
                    </div>
                    <p className="mt-2 max-w-3xl text-[0.94rem] leading-7 text-text-soft sm:text-[0.98rem]">
                      {project.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="divider pt-6">
            <p className="text-[0.82rem] text-text-muted">
              more on{" "}
              <Link
                href="https://github.com/ozguragain"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub profile (opens in new tab)"
                className="text-text transition-colors duration-fast ease-out hover:text-text-muted"
              >
                GitHub<span className="sr-only"> (opens in new tab)</span>
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
