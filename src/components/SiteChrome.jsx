"use client";

import { usePathname } from "next/navigation";

/*
  Routes that render as a standalone app (no site header/footer).
  Used for web apps that are embedded inside an Android WebView.
*/
const STANDALONE_ROUTES = ["/clipdropper/app"];

export default function SiteChrome({ navbar, footer, children }) {
  const pathname = usePathname() || "/";
  const standalone = STANDALONE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (standalone) {
    return (
      <main id="main" className="app-main">
        {children}
      </main>
    );
  }

  return (
    <>
      {navbar}
      <main id="main" className="site-main">
        {children}
      </main>
      {footer}
    </>
  );
}
