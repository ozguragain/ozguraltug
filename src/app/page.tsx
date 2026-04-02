import Link from "next/link";

import { ExperienceList } from "@/components/content/experience-list";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { experienceItems } from "@/content/site/experience";
import { profile } from "@/content/site/profile";

export default function HomePage() {
  return (
    <>
      <Section inset="lg" className="pb-12 sm:pb-14 lg:pb-16">
        <Container size="content">
          <div className="mx-auto w-full max-w-[var(--max-width-frame)]">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,27.5rem)_13.75rem] lg:items-start lg:justify-between">
              <div className="enter-rise space-y-8 lg:pt-2">
                <div className="space-y-4">
                  <h1 className="type-display max-w-[9ch]">{profile.name}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-mono text-[0.92rem] font-medium tracking-[-0.035em] text-text/88 sm:text-[0.98rem]">
                      {profile.role}
                    </p>
                    <span className="rounded-sm bg-bg-muted px-2 py-1 font-mono text-[0.8rem] tracking-[-0.02em] text-text/72 sm:text-[0.84rem]">
                      {profile.pronouns}
                    </span>
                  </div>
                </div>
                <div className="max-w-[29rem] space-y-2.5 font-mono text-[0.92rem] leading-[1.72] tracking-[-0.02em] text-text/82 sm:text-[0.97rem]">
                  <p>{profile.summary}</p>
                  <p>{profile.detail}</p>
                </div>
                <ul className="flex flex-wrap gap-x-5 gap-y-3 pt-1">
                  {profile.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noreferrer" : undefined}
                        className="font-mono text-[0.82rem] tracking-[-0.03em] text-text transition-colors duration-200 ease-productive hover:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="enter-rise-delayed mx-auto w-full max-w-[13.75rem] lg:mx-0 lg:justify-self-end">
                <div className="portrait-shell group aspect-[10/13] overflow-hidden border border-border/80 transition-transform duration-300 ease-productive hover:-translate-y-1">
                  <div className="flex h-full items-end justify-between p-5">
                    <span className="font-mono text-[0.7rem] lowercase tracking-[-0.02em] text-text-muted">
                      portrait pending
                    </span>
                    <span className="font-mono text-[2.2rem] font-semibold tracking-[-0.08em] text-text/90 transition-transform duration-300 ease-productive group-hover:translate-x-0.5">
                      oz
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section inset="md">
        <Container size="content">
          <div className="mx-auto w-full max-w-[var(--max-width-frame)] space-y-10">
            <h2 className="type-section text-text-muted">Where I&apos;ve Been</h2>
            <ExperienceList items={experienceItems} />
          </div>
        </Container>
      </Section>

      <Section inset="md">
        <Container size="content">
          <div className="mx-auto w-full max-w-[var(--max-width-frame)] border-t border-border/70 pt-10">
            <article className="space-y-2">
              <div className="flex items-baseline gap-3">
                <h3 className="shrink-0 font-mono text-[0.88rem] font-semibold tracking-[-0.03em] text-text sm:text-[0.98rem]">
                  {profile.education.institution}
                </h3>
                <span
                  aria-hidden="true"
                  className="hidden flex-1 border-b border-dotted border-text-muted/60 md:block"
                />
                <p className="shrink-0 font-mono text-[0.82rem] text-text-muted sm:text-[0.9rem]">
                  {profile.education.period}
                </p>
              </div>
              <p className="max-w-3xl text-[0.94rem] leading-8 text-text-muted sm:text-[0.98rem]">
                {profile.education.degree}
              </p>
            </article>
          </div>
        </Container>
      </Section>
    </>
  );
}
