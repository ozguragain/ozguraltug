import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  withDivider?: boolean;
  inset?: "sm" | "md" | "lg";
} & ComponentPropsWithoutRef<"section">;

const insetClasses = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-20 lg:py-24",
  lg: "py-20 sm:py-24 lg:py-28"
};

export function Section({
  children,
  className,
  inset = "md",
  withDivider = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative",
        insetClasses[inset],
        withDivider && "border-t border-border/80",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
