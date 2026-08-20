import type { ReactNode } from "react";

import { Footer } from "./footer";
import { SkipLink } from "./skip-link";
import { SiteHeader } from "../navigation/site-header";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <SkipLink />
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
