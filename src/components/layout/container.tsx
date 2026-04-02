import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerSize = "shell" | "content" | "prose";

type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  size?: ContainerSize;
  bleedOnMobile?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

const sizeClasses: Record<ContainerSize, string> = {
  shell: "max-w-shell",
  content: "max-w-content",
  prose: "max-w-prose"
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
        bleedOnMobile ? "px-0 sm:px-shell" : "px-4 sm:px-6 lg:px-shell",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
