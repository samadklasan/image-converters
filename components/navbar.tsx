import Link from "next/link";

import { sniglet } from "@/lib/fonts";

type NavbarProps = {
  showSearch?: boolean;
};

export function Navbar({ showSearch = true }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand bg-white">
      <nav className="editorial-shell flex items-center justify-between py-3">
        <Link href="/" className="inline-flex items-center gap-2 text-brand">
          <span className={`${sniglet.className} hero-heading text-2xl font-[400] uppercase leading-none`}>
            ToolsRobot
          </span>
        </Link>

        <div
          aria-hidden="true"
          className={showSearch ? "h-11 w-11 shrink-0" : "h-11 w-11 shrink-0"}
        />
      </nav>
    </header>
  );
}
