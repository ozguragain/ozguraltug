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
          <div className="mx-auto w-full max-w-[var(--max-width-prose)]">
            <div className="enter-rise space-y-8">
              <div className="space-y-4">
                <h1 className="type-display">{profile.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-[0.98rem] font-medium leading-[1.6] text-text-soft sm:text-[1.04rem]">
                    {profile.role}
                  </p>
                  <span className="rounded-full bg-bg-muted px-2.5 py-1 text-[0.84rem] font-medium text-text-soft sm:text-[0.88rem]">
                    {profile.pronouns}
                  </span>
                </div>
              </div>
              <div className="space-y-3 text-[1rem] font-medium leading-[1.8] text-text-soft sm:text-[1.06rem]">
                <p>{profile.summary}</p>
                <p>{profile.detail}</p>
              </div>
              <ul className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 pt-2">
                {profile.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      className=" text-[0.82rem] text-text transition-colors duration-200 ease-out hover:text-text-muted"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section inset="md">
        <Container size="content">
          <div className="mx-auto w-full max-w-[var(--max-width-prose)] space-y-10">
            <h2 className="type-section text-text-muted">
              Where I&apos;ve Been
            </h2>
            <ExperienceList items={experienceItems} />
          </div>
        </Container>
      </Section>

      <Section inset="md">
        <Container size="content">
          <div className="mx-auto w-full max-w-[var(--max-width-prose)] border-t border-border/70 pt-10">
            <article className="space-y-2">
              <div className="flex items-baseline gap-3">
                <h3 className="shrink-0 text-[0.88rem] font-semibold text-text sm:text-[0.98rem]">
                  {profile.education.institution}
                </h3>
                <span
                  aria-hidden="true"
                  className="hidden flex-1 shadow-[inset_0_-1px_0_0_hsl(var(--color-text-muted)/0.6)] md:block"
                />
                <p className="shrink-0 text-[0.82rem] text-text-muted sm:text-[0.9rem]">
                  {profile.education.period}
                </p>
              </div>
              <p className="max-w-3xl text-[0.94rem] leading-7 text-text-soft sm:text-[0.98rem]">
                {profile.education.degree}
              </p>
            </article>
          </div>
        </Container>
      </Section>
    </>
  );
}
