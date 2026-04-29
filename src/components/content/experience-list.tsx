import type { ExperienceItem } from "@/content/site/experience";

type ExperienceListProps = {
  items: ExperienceItem[];
};

export function ExperienceList({ items }: ExperienceListProps) {
  return (
    <div className="space-y-8">
      {items.map((item) => (
        <article key={`${item.organization}-${item.period}`} className="stagger-item space-y-2">
          <div className="flex items-baseline gap-3">
            <h3 className="shrink-0 font-mono text-[0.88rem] font-semibold tracking-[-0.02em] text-text sm:text-[0.98rem]">
              {item.organization}
            </h3>
            <span
              aria-hidden="true"
              className="hidden flex-1 shadow-[inset_0_-1px_0_0_hsl(var(--color-text-muted)/0.6)] md:block"
            />
            <p className="shrink-0 font-mono text-[0.82rem] text-text-muted sm:text-[0.9rem]">
              {item.period}
            </p>
          </div>
          <p className="max-w-3xl text-[0.94rem] font-medium leading-8 text-text-prose sm:text-[0.98rem]">
            {item.role}
          </p>
        </article>
      ))}
    </div>
  );
}
