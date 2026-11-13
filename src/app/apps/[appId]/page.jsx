import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Check, ExternalLink, Gamepad2, HardDrive, Info, LayoutGrid, ShieldCheck, Smartphone, Tag, User } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AppIcon from "@/components/AppIcon";
import AppCard from "@/components/AppCard";
import DownloadButton from "@/components/DownloadButton";
import DownloadCount from "@/components/DownloadCount";
import ShareButton from "@/components/ShareButton";
import Rail from "@/components/Rail";
import { Icon } from "@/components/icons";
import { apps, getAppById, getRelatedApps } from "@/data/apps";
import { site } from "@/data/site";
import { assetUrl } from "@/lib/asset";

export function generateStaticParams() {
  return apps.map((app) => ({ appId: app.id }));
}

export async function generateMetadata({ params }) {
  const { appId } = await params;
  const app = getAppById(appId);
  if (!app) return { title: "App not found" };

  const description = app.comingSoon
    ? `${app.tagline}. ${app.description} ${app.name} for Android is coming soon to CodeLove Apps.`
    : `${app.tagline}. ${app.description} Download the free ${app.name} Android APK (v${app.version}, ${app.size}).`;
  const image = app.cover ? [{ url: app.cover, width: 1200, height: 630, alt: app.name }] : undefined;
  return {
    title: `${app.name} — ${app.tagline}`,
    description,
    alternates: { canonical: `/apps/${app.id}/` },
    openGraph: { title: `${app.name} — ${app.tagline}`, description, url: `${site.url}/apps/${app.id}`, type: "website", images: image },
    twitter: { card: "summary_large_image", title: `${app.name} — ${app.tagline}`, description, images: image?.map((i) => i.url) },
  };
}

export default async function AppDetailPage({ params }) {
  const { appId } = await params;
  const app = getAppById(appId);
  if (!app) notFound();

  const isGame = app.category === "Games" && app.id !== "javaplay";
  const related = getRelatedApps(app, 8);
  const backdrop = app.gallery[1] || app.cover;

  const info = [
    { icon: Tag, label: "Version", value: app.version },
    { icon: HardDrive, label: "Size", value: app.size },
    { icon: ShieldCheck, label: "Requires", value: app.androidVersion },
    { icon: Calendar, label: "Updated", value: app.updated },
    { icon: LayoutGrid, label: "Category", value: app.genre || app.category },
    { icon: Smartphone, label: "Screen", value: app.android?.orientation === "landscape" ? "Landscape, full screen" : "Portrait & landscape" },
    { icon: User, label: "Developer", value: `${site.developer} · CodeLove` },
    { icon: Info, label: "Price", value: "Free" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isGame ? "VideoGame" : "SoftwareApplication",
    name: app.name,
    description: app.description,
    applicationCategory: isGame ? "GameApplication" : `${app.category}Application`,
    operatingSystem: app.androidVersion,
    softwareVersion: app.version,
    fileSize: app.size,
    ...(app.cover ? { image: new URL(app.cover, site.url).href } : {}),
    ...(app.comingSoon ? {} : { downloadUrl: new URL(app.apkUrl, site.url).href }),
    author: { "@type": "Person", name: site.developer, url: site.parentSiteUrl },
    publisher: { "@id": "https://codelove.in/#organization" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <article style={{ "--accent": app.accent }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="detail-hero" aria-labelledby="app-title">
        {backdrop && (
          <div className="detail-backdrop" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative blurred art */}
            <img src={assetUrl(backdrop)} alt="" />
          </div>
        )}
        <div className="container">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Apps", href: "/apps" },
              { label: app.name, href: `/apps/${app.id}` },
            ]}
          />

          <div className="detail-grid">
            <div>
              <div className="detail-head">
                <AppIcon app={app} size={96} />
                <div>
                  <h1 id="app-title">{app.name}</h1>
                  <p className="detail-by">
                    {site.developer} · CodeLove · {app.genre || app.category}
                  </p>
                </div>
              </div>
              <p className="detail-tagline">{app.tagline}</p>

              <div className="detail-chips">
                {app.comingSoon ? <span className="chip">Coming soon</span> : <span className="chip chip-live">Available</span>}
                <DownloadCount app={app} className="chip" />
                <span className="chip">Free</span>
                <span className="chip">No account</span>
                {isGame && <span className="chip">Landscape · full screen</span>}
              </div>

              <div className="detail-actions">
                <DownloadButton app={app} label="Download APK" size="lg" />
                {app.webAppUrl && (
                  <a href={app.webAppUrl} className="btn btn-secondary btn-lg hub-hide" target="_blank" rel="noreferrer">
                    {isGame ? <Gamepad2 size={18} aria-hidden="true" /> : <ExternalLink size={17} aria-hidden="true" />}
                    {isGame ? "Play in browser" : "Use online"}
                  </a>
                )}
                <ShareButton title={app.name} text={app.description} className="btn btn-ghost btn-lg" />
              </div>

              <dl className="detail-facts">
                <div>
                  <dt>Version</dt>
                  <dd>{app.version}</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>{app.size}</dd>
                </div>
                <div>
                  <dt>Android</dt>
                  <dd>{app.androidVersion.replace("Android ", "")}</dd>
                </div>
                <div>
                  <dt>Price</dt>
                  <dd>Free</dd>
                </div>
              </dl>

              <p className="detail-note hub-hide">
                <Info size={14} aria-hidden="true" />
                {app.comingSoon
                  ? `${app.name} for Android is being finished. The APK will be on this page when it is ready${app.webAppUrl ? "; until then, use it online." : "."}`
                  : "Direct APK from CodeLove. Android may ask you to allow installs from your browser the first time."}
              </p>
            </div>

            {app.cover && (
              <div className="detail-art">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, local art */}
                <img src={assetUrl(app.cover)} alt={`${app.name} cover art`} width={1200} height={630} fetchPriority="high" />
              </div>
            )}
          </div>
        </div>
      </section>

      {app.gallery.length > 1 && (
        <section className="section" aria-labelledby="gallery-title" style={{ paddingTop: 8 }}>
          <div className="container">
            <div className="section-head">
              <h2 id="gallery-title">Screenshots</h2>
            </div>
            <div className="gallery">
              {app.gallery.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- static export, local art
                <img key={src} src={assetUrl(src)} alt={`${app.name} screenshot ${i + 1}`} loading="lazy" decoding="async" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="about-app-title">
        <div className="container detail-cols">
          <div>
            <h2 id="about-app-title" style={{ marginBottom: 16 }}>
              About {app.name}
            </h2>
            <div className="prose-lg">
              {app.about.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ marginBottom: 16 }}>Features</h2>
            <ul className="features">
              {app.features.map((feature) => (
                <li key={feature.title} className="feature">
                  <span className="feature-icon">
                    <Icon name={feature.icon} size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="info-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2 id="info-title">App information</h2>
          </div>
          <dl className="info-grid">
            {info.map(({ icon: InfoIcon, label, value }) => (
              <div key={label}>
                <dt>
                  <InfoIcon size={15} aria-hidden="true" />
                  {label}
                </dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {!app.comingSoon && app.releaseNotes?.length > 0 && (
        <section className="section" id="release-notes" aria-labelledby="notes-title" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head">
              <h2 id="notes-title">What&apos;s new</h2>
            </div>
            <div className="notes">
              {app.releaseNotes.map((note) => (
                <div key={note.version} className="note">
                  <div>
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
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Rail id="related-title" title="You may also like" moreHref="/apps" moreLabel="All apps">
        {related.map((item) => (
          <AppCard key={item.id} app={item} />
        ))}
      </Rail>

      <p className="container" style={{ marginTop: -24, marginBottom: 24 }}>
        <Link href="/apps" className="link-more">
          ← Back to all apps
        </Link>
      </p>
    </article>
  );
}
