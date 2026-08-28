import Link from "next/link";
import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { deserialize } from "v8";

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
      "This website — a terminal-inspired personal site built with Next.js, MDX, and Tailwind.",
    href: "https://github.com/ozguragain/ozguraltug",
    external: true,
  },
];

export default function ProjectsPage() {
  return (
    <Section inset="lg">
      <Container size="content">
        <div className="mx-auto w-full max-w-[var(--max-width-prose)] space-y-8">
          <header className="space-y-4">
            <h1 className="type-display">Projects</h1>
            <p className=" text-[0.92rem] text-text-muted sm:text-[0.96rem]">
              Selected things I&apos;ve built. More coming.
            </p>
          </header>

          <div className="shadow-[inset_0_1px_0_0_hsl(var(--color-border)/0.6)] pt-8">
            {projects.length === 0 ? (
              <p className=" text-[0.88rem] text-text-muted">
                nothing here yet — check back soon.
              </p>
            ) : (
              <ul className="space-y-6">
                {projects.map((project) => (
                  <li key={project.title}>
                    <div className="flex items-baseline gap-3">
                      <h2 className=" text-[1rem] font-semibold text-text">
                        {project.title}
                      </h2>
                      <span
                        aria-hidden="true"
                        className="hidden flex-1 shadow-[inset_0_-1px_0_0_hsl(var(--color-text-muted)/0.6)] md:block"
                      />
                      <Link
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className=" text-[0.8rem] text-text-muted transition-colors duration-200 ease-out hover:text-text"
                      >
                        ↗
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

          <div className="shadow-[inset_0_1px_0_0_hsl(var(--color-border)/0.6)] pt-6">
            <p className=" text-[0.82rem] text-text-muted">
              more on{" "}
              <Link
                href="https://github.com/ozguragain"
                target="_blank"
                rel="noreferrer"
                className="text-text transition-colors duration-200 ease-out hover:text-text-muted"
              >
                GitHub
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
