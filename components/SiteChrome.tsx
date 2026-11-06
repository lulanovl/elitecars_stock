"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides the public header/footer/CTA bar inside the admin panel. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
