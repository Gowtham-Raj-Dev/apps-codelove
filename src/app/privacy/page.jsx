import Breadcrumb from "@/components/Breadcrumb";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";

export const metadata = {
  title: "Privacy",
  description: `How ${site.name} and its Android apps handle your data.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="page-header" aria-labelledby="privacy-title">
      <div className="ambient" aria-hidden="true">
        <div className="ambient-grid" />
      </div>
      <div className="container">
        <Reveal variant="fade">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy", href: "/privacy" }]} />
        </Reveal>
        <Reveal delay={60}>
          <h1 id="privacy-title">Privacy</h1>
          <p className="lead">Short version: this website and the apps on it are built to keep your data on your device.</p>
        </Reveal>
        <Reveal delay={120} className="prose" style={{ marginTop: 32 }}>
          <h2>This website</h2>
          <p>
            {site.name} ({site.url}) is a static showcase site. It does not use analytics cookies, advertising
            trackers or third-party embeds. Your browser may cache pages and fonts so the site loads faster on your next
            visit.
          </p>

          <h2>The apps</h2>
          <p>
            Apps published here are distributed directly as Android APK files. Unless an app&apos;s own detail page says
            otherwise, apps by Codelove:
          </p>
          <ul>
            <li>store your content locally on your device and do not upload it to any server;</li>
            <li>do not require an account;</li>
            <li>do not include advertising or tracking libraries;</li>
            <li>only request the Android permissions needed for their core features.</li>
          </ul>

          <h2>Contact</h2>
          <p>
            Questions about privacy or a specific app? Reach {site.developer} through{" "}
            <a href={site.parentSiteUrl} target="_blank" rel="noreferrer">
              {site.parentSite}
            </a>
            .
          </p>
          <p className="muted">Last updated: September {site.year}</p>
        </Reveal>
      </div>
    </section>
  );
}
