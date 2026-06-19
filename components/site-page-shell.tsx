import type { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

type SitePageShellProps = {
  children: ReactNode;
  mainClassName?: string;
  showNavbarSearch?: boolean;
};

export function SitePageShell({
  children,
  mainClassName,
  showNavbarSearch = true,
}: SitePageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar showSearch={showNavbarSearch} />
      <main className={mainClassName}>{children}</main>
      <Footer />
    </div>
  );
}
