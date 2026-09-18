"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronRight, LayoutGrid, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { Icon } from "./icons";
import { navLinks } from "@/data/site";
import { categories } from "@/data/categories";
import { apps } from "@/data/apps";

// Category entries for the "Categories" dropdown (skips "All", adds app counts)
const categoryItems = categories
  .filter((cat) => cat.id !== "All")
  .map((cat) => ({
    ...cat,
    href: `/apps?category=${encodeURIComponent(cat.id)}`,
    count: apps.filter((app) => app.category === cat.id).length,
  }));

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // mobile menu
  const [menu, setMenu] = useState(null); // label of the open desktop dropdown
  const [mobileGroup, setMobileGroup] = useState(null); // expanded group in the mobile menu
  const navRef = useRef(null);
  const closeTimer = useRef(null);

  // Solidify the glass when the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes everything; clicking outside closes the dropdown
  useEffect(() => {
    if (!open && !menu) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(null);
      }
    };
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenu(null);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, menu]);

  const closeAll = () => {
    setOpen(false);
    setMenu(null);
  };

  // Small delay before closing on mouse leave so the pointer can travel to the panel
  const openMenu = (label) => {
    clearTimeout(closeTimer.current);
    setMenu(label);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };

  const isActive = (link) => {
    if (link.external || link.href.includes("#")) return false;
    if (link.menu === "categories") return pathname === "/apps";
    return link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
  };

  return (
    <header className="nav-wrap">
      <nav ref={navRef} className={`nav ${scrolled ? "is-scrolled" : ""}`} aria-label="Main navigation">
        <Logo />

        {/* Desktop links */}
        <ul className="nav-links">
          {navLinks.map((link) => {
            const active = isActive(link);

            if (link.menu === "categories") {
              const expanded = menu === link.label;
              return (
                <li
                  key={link.label}
                  className={`nav-item has-menu ${expanded ? "is-open" : ""}`}
                  onMouseEnter={() => openMenu(link.label)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    className={`nav-link ${active ? "is-active" : ""}`}
                    aria-haspopup="true"
                    aria-expanded={expanded}
                    aria-controls="menu-categories"
                    onClick={() => setMenu(expanded ? null : link.label)}
                  >
                    {link.label}
                    <ChevronDown size={15} className="nav-caret" aria-hidden="true" />
                  </button>

                  <div id="menu-categories" className="nav-menu" hidden={!expanded}>
                    <div className="nav-menu-panel">
                      <Link href="/apps" className="nav-menu-all" onClick={closeAll}>
                        <span className="nav-menu-icon nav-menu-icon--accent">
                          <LayoutGrid size={17} aria-hidden="true" />
                        </span>
                        <span>
                          <strong>All apps</strong>
                          <small>{apps.length} apps · browse everything</small>
                        </span>
                        <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                      <ul className="nav-menu-grid">
                        {categoryItems.map((cat) => (
                          <li key={cat.id}>
                            <Link href={cat.href} className="nav-menu-item" onClick={closeAll}>
                              <span className="nav-menu-icon">
                                <Icon name={cat.icon} size={17} aria-hidden="true" />
                              </span>
                              <span>
                                <strong>{cat.label}</strong>
                                <small>
                                  {cat.count} {cat.count === 1 ? "app" : "apps"}
                                </small>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={link.label} className="nav-item">
                {link.external ? (
                  <a href={link.href} className="nav-link" target="_blank" rel="noreferrer">
                    {link.label}
                    <ArrowUpRight size={14} className="nav-ext" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className={`nav-link ${active ? "is-active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenu(null)}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="nav-actions">
          <Link href="/apps" className="btn btn-primary nav-cta">
            Explore Apps <ArrowRight size={16} className="btn-arrow" aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="nav-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="nav-mobile">
          {navLinks.map((link) => {
            const active = isActive(link);

            if (link.menu === "categories") {
              const expanded = mobileGroup === link.label;
              return (
                <div key={link.label} className={`nav-mobile-group ${expanded ? "is-open" : ""}`}>
                  <button
                    type="button"
                    className="nav-mobile-link"
                    aria-expanded={expanded}
                    onClick={() => setMobileGroup(expanded ? null : link.label)}
                  >
                    {link.label}
                    <ChevronDown size={18} className="nav-caret" aria-hidden="true" />
                  </button>
                  {expanded && (
                    <ul className="nav-mobile-sub">
                      {categoryItems.map((cat) => (
                        <li key={cat.id}>
                          <Link href={cat.href} onClick={closeAll}>
                            <Icon name={cat.icon} size={16} aria-hidden="true" />
                            {cat.label}
                            <span className="count">{cat.count}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }

            if (link.external) {
              return (
                <a key={link.label} href={link.href} className="nav-mobile-link" target="_blank" rel="noreferrer">
                  {link.label}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-mobile-link ${active ? "is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={closeAll}
              >
                {link.label}
                <ChevronRight size={18} aria-hidden="true" />
              </Link>
            );
          })}
          <Link href="/apps" className="btn btn-primary" onClick={closeAll}>
            Explore Apps <ArrowRight size={16} className="btn-arrow" aria-hidden="true" />
          </Link>
        </div>
      )}
    </header>
  );
}
