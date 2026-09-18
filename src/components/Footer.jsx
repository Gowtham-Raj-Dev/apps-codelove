import Link from "next/link";
import { Globe } from "lucide-react";
import Logo from "./Logo";
import { site, footerLinks } from "@/data/site";
import { apps } from "@/data/apps";

function GithubMark(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export default function Footer() {
  const popular = apps.slice(0, 4);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>Useful mobile apps, thoughtfully crafted by {site.developer}.</p>
            <div className="footer-social">
              {site.social.website && (
                <a href={site.social.website} target="_blank" rel="noreferrer" aria-label={`${site.parentSite} website`}>
                  <Globe size={18} aria-hidden="true" />
                </a>
              )}
              {site.social.github && (
                <a href={site.social.github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
                  <GithubMark />
                </a>
              )}
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigate</h4>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Apps</h4>
            <ul>
              {popular.map((app) => (
                <li key={app.id}>
                  <Link href={`/apps/${app.id}`}>{app.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/apps">All apps →</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {site.year} {site.name}. All rights reserved.</span>
          <span>
            Developed by {site.developer} ·{" "}
            <a href={site.parentSiteUrl} target="_blank" rel="noreferrer">
              {site.parentSite}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
