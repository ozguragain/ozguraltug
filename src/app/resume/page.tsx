import Link from "next/link";
import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ExperienceList } from "@/components/content/experience-list";
import { Section } from "@/components/layout/section";
import { experienceItems } from "@/content/site/experience";
import { profile } from "@/content/site/profile";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume and experience.",
};

export default function ResumePage() {
  return (
    <Section inset="lg">
      <Container size="content">
        <div className="mx-auto w-full max-w-[var(--max-width-prose)] space-y-10">
          <header className="space-y-4">
            <h1 className="type-display">{profile.name}</h1>
            <p className="max-w-2xl text-[0.92rem] leading-7 text-text-soft sm:text-[0.98rem]">
              {profile.role} · {profile.education.degree} ·{" "}
              {profile.education.institution}
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-3">
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
          </header>

          <section className="shadow-[inset_0_1px_0_0_hsl(var(--color-border)/0.6)] pt-8">
            <h2 className="type-section text-text-muted">Education</h2>
            <div className="mt-6 space-y-2">
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
            </div>
          </section>

          <section className="shadow-[inset_0_1px_0_0_hsl(var(--color-border)/0.6)] pt-8">
            <h2 className="type-section text-text-muted">Experience</h2>
            <div className="mt-6">
              <ExperienceList items={experienceItems} />
            </div>
          </section>
        </div>
      </Container>
    </Section>
  );
}
