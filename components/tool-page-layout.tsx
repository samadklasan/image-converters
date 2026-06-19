import type { ReactNode } from "react";

import { Sidebar } from "@/components/sidebar";

type ToolPageLayoutProps = {
  children: ReactNode;
};

export function ToolPageLayout({ children }: ToolPageLayoutProps) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-12">
      <div className="min-w-0 xl:col-span-9">
        {children}
      </div>
      <div className="self-start xl:col-span-3 xl:sticky xl:top-24">
        <Sidebar />
      </div>
    </div>
  );
}
