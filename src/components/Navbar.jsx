"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import Logo from "./Logo";
import { navLinks } from "@/data/site";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu after navigating
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href) => {
    const [path, query] = href.split("?");
    if (path === "/") return pathname === "/";
    if (!pathname.startsWith(path)) return false;
    // "/apps?category=Games" is active only for that category; "/apps" only without one
    const wanted = query ? new URLSearchParams(query).get("category") : null;
    return (searchParams.get("category") || null) === wanted;
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Logo />

        <nav className="header-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`header-link ${isActive(link.href) ? "is-active" : ""}`}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="/apps" className="header-search">
            <Search size={16} aria-hidden="true" />
            Search apps and games
          </Link>
          <button
            type="button"
            className="header-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className={isActive(link.href) ? "is-active" : ""}>
              {link.label}
            </Link>
          ))}
          <Link href="/apps" className="btn btn-primary">
            <Search size={16} aria-hidden="true" /> Search apps and games
          </Link>
        </nav>
      )}
    </header>
  );
}
