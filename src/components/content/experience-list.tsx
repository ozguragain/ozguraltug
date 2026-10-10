import type { ExperienceItem } from "@/content/site/experience";

type ExperienceListProps = {
  items: ExperienceItem[];
};

export function ExperienceList({ items }: ExperienceListProps) {
  return (
    <div className="space-y-8">
      {items.map((item) => (
        <article key={`${item.organization}-${item.period}-${item.role}`} className="group space-y-2 transition-colors duration-fast ease-out hover:border-border/20">
          <div className="flex items-baseline gap-3">
            <h3 className="shrink-0 text-[0.88rem] font-semibold text-text sm:text-[0.98rem]">
              {item.organization}
            </h3>
            <span
              aria-hidden="true"
              className="flex-1 border-t border-dashed border-border/15 self-center"
            />
            <p className="shrink-0 text-[0.82rem] text-text-muted sm:text-[0.9rem]">
              {item.period}
            </p>
          </div>
          <p className="max-w-3xl text-[0.94rem] leading-7 text-text-soft sm:text-[0.98rem]">
            {item.role}
          </p>
        </article>
      ))}
    </div>
  );
}
