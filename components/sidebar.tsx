import type { ReactNode } from "react";

type SidebarProps = {
  children?: ReactNode;
  title?: string;
};

export function Sidebar({ children, title = "Sidebar" }: SidebarProps) {
  return (
    <aside className="rounded-ui flex min-h-[360px] items-start justify-start border border-cardBorder bg-white px-4 py-3 text-cardTextColor">
      {children ?? (
        <span className="font-headline text-[11px] font-black uppercase tracking-[0.16em] text-cardTextColor">
          {title}
        </span>
      )}
    </aside>
  );
}
