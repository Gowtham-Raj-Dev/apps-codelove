import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { apps } from "@/data/apps";
import { site, networkLinks } from "@/data/site";

export const metadata = {
  title: "About",
  description: `CodeLove Apps is where ${site.developer} publishes free Android games and tools as direct APK downloads.`,
  alternates: { canonical: "/about/" },
  openGraph: {
    title: `About — ${site.name}`,
    description: `Free Android games and tools by ${site.developer} at CodeLove.`,
    url: `${site.url}/about`,
  },
};

export default function AboutPage() {
  const games = apps.filter((a) => a.category === "Games").length;

  return (
    <>
      <section className="page-hero" aria-labelledby="about-title">
        <div className="container">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
          <div className="about-grid" style={{ marginTop: 8 }}>
            <div>
              <h1 id="about-title">About CodeLove Apps</h1>
              <div className="prose" style={{ marginTop: 18 }}>
                <p>
                  CodeLove Apps is the Android home of the CodeLove sites. Every game on games.codelove.in and the
                  CodeLove web tools — the video cutter, video to GIF, Insta Downloader, Link in Bio — are published
                  here as free apps you can install straight from an APK file.
                </p>
                <p>
                  The games open full screen in landscape with touch controls. The tools open the same pages as the
                  website, with file picking and saving to your Downloads folder handled by Android. Because the
                  apps load the live sites, fixes and new features arrive without reinstalling.
                </p>
                <p>Everything is free. There is no account to create and nothing to subscribe to.</p>
              </div>
              <div className="detail-actions">
                <Link href="/apps" className="btn btn-primary btn-lg">
                  Browse the apps <ArrowRight size={17} className="btn-arrow" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <aside className="profile" aria-label="Developer">
              <div className="profile-head">
                <span className="avatar" aria-hidden="true">
                  G
                </span>
                <div>
                  <h2 style={{ fontSize: "1.3rem" }}>{site.developer}</h2>
                  <p>{site.developerTitle}</p>
                </div>
              </div>
              <div className="chips">
                <span className="chip">Web apps</span>
                <span className="chip">3D games</span>
                <span className="chip">Android</span>
                <span className="chip">Video tools</span>
              </div>
              <div className="detail-actions">
                <a href={site.parentSiteUrl} className="btn btn-secondary" target="_blank" rel="noreferrer">
                  <Globe size={16} aria-hidden="true" /> {site.parentSite}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section" aria-label="At a glance">
        <div className="container">
          <div className="numbers">
            <div className="number">
              <strong>{apps.length}</strong>
              <span>Android apps</span>
            </div>
            <div className="number">
              <strong>{games}</strong>
              <span>Games</span>
            </div>
            <div className="number">
              <strong>{networkLinks.length}</strong>
              <span>CodeLove sites</span>
            </div>
            <div className="number">
              <strong>₹0</strong>
              <span>Price of every app</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
