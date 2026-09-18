import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Download,
  FileText,
  Globe,
  HardDrive,
  Info,
  LayoutGrid,
  ShieldCheck,
  Smartphone,
  Star,
  Tag,
  User,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AppIcon from "@/components/AppIcon";
import AppCard from "@/components/AppCard";
import DownloadButton from "@/components/DownloadButton";
import ShareButton from "@/components/ShareButton";
import FeatureCard from "@/components/FeatureCard";
import MobilePreview from "@/components/MobilePreview";
import Reveal from "@/components/Reveal";
import { apps, getAppById, getRelatedApps } from "@/data/apps";
import { site } from "@/data/site";

// Pre-render a page for every app at build time
export function generateStaticParams() {
  return apps.map((app) => ({ appId: app.id }));
}

export async function generateMetadata({ params }) {
  const { appId } = await params;
  const app = getAppById(appId);
  if (!app) return { title: "App not found" };

  const description = app.comingSoon
    ? `${app.tagline}. ${app.description} ${app.name} for Android is coming soon to Codelove Apps.`
    : `${app.tagline}. ${app.description} Download the ${app.name} Android APK (v${app.version}, ${app.size}) from Codelove Apps.`;
  return {
    title: `${app.name} — ${app.tagline}`,
    description,
    alternates: { canonical: `/apps/${app.id}` },
    openGraph: {
      title: `${app.name} — ${app.tagline}`,
      description,
      url: `${site.url}/apps/${app.id}`,
      type: "website",
    },
    twitter: { title: `${app.name} — ${app.tagline}`, description },
  };
}

export default async function AppDetailPage({ params }) {
  const { appId } = await params;
  const app = getAppById(appId);
  if (!app) notFound();

  const related = getRelatedApps(app, 3);
  // For unreleased apps, point people at something they can use today
  const liveApp = app.comingSoon ? apps.find((a) => !a.comingSoon) : null;
  const hasRealShots = app.screenshots && app.screenshots.length > 0;
  const shots = hasRealShots ? app.screenshots : app.screens;

  const specs = [
    { icon: Smartphone, label: "App name", value: app.name },
    { icon: Tag, label: "Version", value: app.version },
    { icon: LayoutGrid, label: "Category", value: app.category },
    { icon: HardDrive, label: "Size", value: app.size },
    { icon: ShieldCheck, label: "Android version", value: app.androidVersion },
    { icon: Download, label: "Downloads", value: app.comingSoon ? "Coming soon" : app.downloads },
    { icon: Calendar, label: "Last updated", value: app.updated },
    { icon: User, label: "Developer", value: `${site.developer} · Codelove` },
  ];

  // Structured data so search engines understand this is a downloadable app
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description,
    applicationCategory: `${app.category}Application`,
    operatingSystem: app.androidVersion,
    softwareVersion: app.version,
    fileSize: app.size,
    // No download link for apps that are not released yet
    ...(app.comingSoon ? {} : { downloadUrl: `${site.url}${app.apkUrl}` }),
    author: { "@type": "Person", name: site.developer, url: site.parentSiteUrl },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <article style={{ "--accent": app.accent }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero ------------------------------------------------------------- */}
      <section className="page-header" aria-labelledby="app-title">
        <div className="ambient" aria-hidden="true">
          <div className="ambient-grid" />
          <div className="blob blob-1" style={{ background: `radial-gradient(circle, ${app.accent}55, transparent 65%)` }} />
          <div className="blob blob-2" />
        </div>
        <div className="container">
          <Reveal variant="fade">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Apps", href: "/apps" },
                { label: app.name, href: `/apps/${app.id}` },
              ]}
            />
          </Reveal>

          <div className="detail-hero">
            <Reveal delay={60}>
              <div className="detail-identity">
                <AppIcon app={app} size={104} />
                <div>
                  <span className="pill pill-soft">{app.category}</span>
                  <h1 id="app-title">{app.name}</h1>
                </div>
              </div>
              <p className="detail-tagline">{app.tagline}</p>

              <div className="detail-stats">
                {app.comingSoon ? (
                  <div className="detail-stat detail-stat--soon">
                    <small>Status</small>
                    <strong>
                      <Clock size={16} aria-hidden="true" /> Coming soon
                    </strong>
                  </div>
                ) : (
                  <>
                    <div className="detail-stat">
                      <small>Rating</small>
                      <strong>
                        <Star size={16} aria-hidden="true" /> {app.rating}
                      </strong>
                    </div>
                    <div className="detail-stat">
                      <small>Downloads</small>
                      <strong>{app.downloads}</strong>
                    </div>
                  </>
                )}
                <div className="detail-stat">
                  <small>Version</small>
                  <strong>{app.version}</strong>
                </div>
                <div className="detail-stat">
                  <small>Updated</small>
                  <strong>{app.updated}</strong>
                </div>
              </div>

              <div className="detail-actions">
                <DownloadButton app={app} label="Download APK" size="lg" />
                {app.webAppUrl && (
                  <Link href={app.webAppUrl} className="btn btn-secondary btn-lg">
                    <Globe size={18} aria-hidden="true" />
                    Open web app
                  </Link>
                )}
                <ShareButton title={app.name} text={app.description} className="btn btn-secondary btn-lg" />
              </div>
            </Reveal>

            <Reveal variant="scale" delay={160}>
              <div className="download-panel">
                <div className="download-panel-head">
                  <h3>{app.comingSoon ? "Coming soon" : "Direct APK download"}</h3>
                  <span className="platform-tag">
                    <Smartphone size={14} aria-hidden="true" />
                    Android APK
                  </span>
                </div>
                <dl className="download-rows">
                  <div>
                    <dt>Version</dt>
                    <dd>{app.version}</dd>
                  </div>
                  <div>
                    <dt>Size</dt>
                    <dd>{app.size}</dd>
                  </div>
                  <div>
                    <dt>Requires</dt>
                    <dd>{app.androidVersion}</dd>
                  </div>
                  <div>
                    <dt>Updated</dt>
                    <dd>{app.updated}</dd>
                  </div>
                </dl>
                <DownloadButton app={app} label="Download APK" className="btn-block" />
                {app.webAppUrl && (
                  <Link href={app.webAppUrl} className="btn btn-secondary btn-block" style={{ marginTop: 10 }}>
                    <Globe size={17} aria-hidden="true" />
                    Use it in the browser
                  </Link>
                )}
                <p className="download-note">
                  <Info size={14} aria-hidden="true" />
                  {app.comingSoon
                    ? `${app.name} is still in development. The Android APK will be available here as a direct download once it is released.`
                    : "Distributed directly by Codelove as an Android APK. You may need to allow installs from unknown sources on your device."}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Screenshots ------------------------------------------------------ */}
      <section className="section" aria-labelledby="shots-title" style={{ paddingTop: 24 }}>
        <div className="container">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow">Screens</span>
              <h2 id="shots-title" style={{ marginTop: 14 }}>
                A look inside {app.name}
              </h2>
            </div>
          </Reveal>
          <Reveal variant="fade" delay={80}>
            <div className="shots" role="list" aria-label={`${app.name} screenshots`}>
              {shots.map((shot, i) => {
                // Real screenshots can be a plain URL or { src, label }
                const src = typeof shot === "string" ? shot : shot.src;
                const label = hasRealShots ? shot.label || app.screens?.[i]?.title || `Screen ${i + 1}` : shot.title;
                return (
                  <div className="shot" role="listitem" key={i}>
                    {hasRealShots ? (
                      <MobilePreview app={app} image={src} width={244} alt={`${app.name} — ${label}`} />
                    ) : (
                      <MobilePreview app={app} screenIndex={i} width={244} />
                    )}
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
            <p className="shots-hint">Swipe to see more</p>
          </Reveal>
        </div>
      </section>

      {/* About + features --------------------------------------------------- */}
      <section className="section" aria-labelledby="about-app-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="about-app">
            <Reveal variant="left" className="about-app-copy">
              <span className="eyebrow">About the app</span>
              <h2 id="about-app-title">Built to solve a simple problem.</h2>
              <div className="lead" style={{ marginTop: 18 }}>
                {app.about.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
            <div>
              <Reveal variant="fade">
                <h3 style={{ marginBottom: 18 }}>Features</h3>
              </Reveal>
              <div className="features-grid">
                {app.features.map((feature, i) => (
                  <Reveal key={feature.title} delay={i * 70}>
                    <FeatureCard icon={feature.icon} title={feature.title} text={feature.text} accent={i === 0} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App information ---------------------------------------------------- */}
      <section className="section" aria-labelledby="info-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal variant="scale" className="spec-panel">
            <span className="eyebrow">Information</span>
            <h2 id="info-title" style={{ marginTop: 14, marginBottom: 24, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
              App information
            </h2>
            <dl className="spec-grid">
              {specs.map(({ icon: Icon, label, value }) => (
                <div className="spec-row" key={label}>
                  <dt>
                    <Icon size={16} aria-hidden="true" />
                    {label}
                  </dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Release notes (only once the app has shipped) ----------------------- */}
      {!app.comingSoon && (
      <section className="section" id="release-notes" aria-labelledby="notes-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow">Changelog</span>
              <h2 id="notes-title" style={{ marginTop: 14, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
                Release notes
              </h2>
            </div>
          </Reveal>
          <div className="release-notes">
            {app.releaseNotes.map((note, i) => (
              <Reveal key={note.version} delay={i * 80} className={`release-note ${i === 0 ? "release-note--latest" : ""}`}>
                <div className="release-note-version">
                  <strong>v{note.version}</strong>
                  <span>{note.date}</span>
                </div>
                <ul>
                  {note.notes.map((line) => (
                    <li key={line}>
                      <Check size={16} aria-hidden="true" />
                      {line}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Download card ------------------------------------------------------ */}
      <section className="section" aria-labelledby="download-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal variant="scale" className="download-card">
            <AppIcon app={app} size={84} />
            <h2 id="download-title">{app.comingSoon ? `${app.name} is coming soon` : "Ready to try it?"}</h2>
            <p className="lead">
              {app.comingSoon
                ? "We're putting the finishing touches on it. Check back here — the APK will land on this page the day it ships."
                : "Download the latest version and experience the app for yourself."}
            </p>
            <div className="download-card-actions">
              <DownloadButton app={app} label="Download APK" size="lg" />
              {app.comingSoon ? (
                liveApp && (
                  <Link href={`/apps/${liveApp.id}`} className="btn btn-secondary btn-lg">
                    Try {liveApp.name} meanwhile <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />
                  </Link>
                )
              ) : (
                <a href="#release-notes" className="btn btn-secondary btn-lg">
                  <FileText size={18} aria-hidden="true" />
                  View release notes
                </a>
              )}
            </div>
            <div className="download-card-meta">
              <span>
                <Smartphone size={14} aria-hidden="true" /> Android APK · {app.comingSoon ? "Coming soon" : "Direct download"}
              </span>
              <span>
                <Tag size={14} aria-hidden="true" /> v{app.version}
              </span>
              <span>
                <HardDrive size={14} aria-hidden="true" /> {app.size}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related ------------------------------------------------------------ */}
      <section className="section" aria-labelledby="related-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow">More apps</span>
              <h2 id="related-title" style={{ marginTop: 14, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
                You might also like
              </h2>
            </div>
            <Link href="/apps" className="link-arrow">
              All apps <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Reveal>
          <div className="related-grid">
            {related.map((item, i) => (
              <Reveal key={item.id} delay={i * 100}>
                <AppCard app={item} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
