import Link from "next/link";
import { sniglet } from "@/lib/fonts";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "All Converters", href: "/tools" },
];

const launchYear = 2026;

export function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightLabel =
    currentYear > launchYear
      ? `© ${launchYear}-${currentYear} ToolsRobot`
      : `© ${launchYear} ToolsRobot`;

  return (
    <footer className="border-t border-brand bg-brand text-white">
      <div className="editorial-shell py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-white">
              <span className={`${sniglet.className} hero-heading text-2xl font-[400] uppercase leading-none`}>
                ToolsRobot
              </span>
            </Link>
            <p className="mt-4 max-w-sm font-body text-sm leading-6 text-white/75">
              Free image converter pages, APIs, and React components extracted for the new site repo.
            </p>
          </div>

          <div>
            <div>
              <h3 className="mb-4 font-headline text-xs font-bold uppercase tracking-[0.18em] text-white">
                Navigation
              </h3>
              <ul className="space-y-2">
                {navigationLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="font-body text-sm text-white/75 transition hover:text-linkHover"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="editorial-shell flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap items-center gap-2 font-body text-sm text-white/60">
            <span>{copyrightLabel}</span>
            <span>—</span>
            <span>Image converters only</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
