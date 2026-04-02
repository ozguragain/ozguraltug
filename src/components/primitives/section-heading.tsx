import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "left" | "between";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
  className
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 border-b border-border/70 pb-6 sm:pb-7",
        align === "between" && "lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div className="max-w-2xl space-y-3">
        {eyebrow ? (
          <p className="type-label text-accent">{eyebrow}</p>
        ) : null}
        <div className="space-y-2">
          <h2 className="type-section text-text">{title}</h2>
          {description ? (
            <p className="max-w-xl text-sm leading-7 text-text-muted sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
