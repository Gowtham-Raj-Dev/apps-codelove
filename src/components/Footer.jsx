import Link from "next/link";
import Logo from "./Logo";
import { site, footerLinks, networkLinks } from "@/data/site";
import { apps } from "@/data/apps";

export default function Footer() {
  const games = apps.filter((a) => a.category === "Games" && !a.comingSoon).slice(0, 3);
  const tools = apps.filter((a) => a.category !== "Games").slice(0, 3);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>Android games and tools by {site.developer}. Free APK downloads, no account needed.</p>
          </div>

          <div>
            <h4>Apps</h4>
            <ul>
              {[...games, ...tools].map((app) => (
                <li key={app.id}>
                  <Link href={`/apps/${app.id}`}>{app.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Site</h4>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer-network" aria-label="CodeLove network">
            <h4>CodeLove network</h4>
            <ul>
              {networkLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>
            © {site.year} {site.name}
          </span>
          <span>
            Built by {site.developer} ·{" "}
            <a href={site.parentSiteUrl} target="_blank" rel="noreferrer">
              {site.parentSite}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
