import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

// Admin pages depend on the session cookie and live data — never prerender them.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Админ-панель", template: `%s — админ-панель ${siteConfig.name}` },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-dvh bg-surface text-navy-900">{children}</div>;
}
