import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerSize = "shell" | "content" | "prose";

type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  size?: ContainerSize;
  bleedOnMobile?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

// Read straight from the CSS variables: the max-w-* token names collide with
// Tailwind's own scale (prose) and with --spacing-shell, which silently wins.
const sizeClasses: Record<ContainerSize, string> = {
  shell: "max-w-[var(--max-width-shell)]",
  content: "max-w-[var(--max-width-content)]",
  prose: "max-w-[var(--max-width-prose)]"
};

export function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  size = "shell",
  bleedOnMobile = false,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "mx-auto w-full",
        bleedOnMobile ? "px-0 sm:px-shell" : "px-shell",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
