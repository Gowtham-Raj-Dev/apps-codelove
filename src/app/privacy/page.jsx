import Breadcrumb from "@/components/Breadcrumb";
import { site } from "@/data/site";

export const metadata = {
  title: "Privacy policy",
  description: `How ${site.name} and the CodeLove Android apps handle your data, including ads served by Google AdMob.`,
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <section className="page-hero" aria-labelledby="privacy-title">
      <div className="container">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy", href: "/privacy" }]} />
        <h1 id="privacy-title">Privacy policy</h1>
        <p>How this website and the CodeLove Android apps handle your data.</p>

        <div className="prose">
          <h2>This website</h2>
          <p>
            {site.name} ({site.url}) is a static site. It does not set cookies of its own and does not run analytics or
            advertising scripts. Your browser may cache pages, images and fonts so the site loads faster next time.
          </p>

          <h2>The Android apps</h2>
          <p>
            The apps on this site (the games, VideoCut, Video to GIF, Link in Bio and Insta Downloader) are distributed
            directly as APK files by {site.developer} / CodeLove. Each app opens the matching CodeLove website inside the
            app, so that site&apos;s own privacy policy also applies to what you do there.
          </p>
          <ul>
            <li>No account is needed to use any app (Link in Bio asks you to sign in only to edit your own page).</li>
            <li>Files you pick in VideoCut or Video to GIF are processed on your phone and are not uploaded.</li>
            <li>Files you save go to your phone&apos;s Downloads folder.</li>
            <li>Settings and saved games are stored on your phone and are removed when you uninstall the app.</li>
            <li>The apps only use the Internet permission (to load the CodeLove site and ads).</li>
          </ul>

          <h2>Ads in the apps</h2>
          <p>
            Most apps show ads served by Google AdMob, which is how the apps stay free. Insta Downloader shows no ads. To
            choose and measure ads, Google may collect and use information such as your device&apos;s advertising ID, IP
            address, device type and how you interact with the ads. See{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">
              how Google uses information from apps that use its services
            </a>{" "}
            and the{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
              Google privacy policy
            </a>
            .
          </p>
          <ul>
            <li>
              Where the law requires it (for example in the EEA and the UK), the app asks for your consent before any ad is
              requested, using Google&apos;s consent form. You can change your choice by clearing the app&apos;s data.
            </li>
            <li>
              You can reset or delete your advertising ID, or opt out of personalised ads, in Android Settings → Privacy →
              Ads.
            </li>
            <li>The apps are not directed at children under 13.</li>
          </ul>

          <h2>Contact</h2>
          <p>
            Questions about privacy or a specific app? Write to{" "}
            <a href="mailto:gowtham@codelove.in">gowtham@codelove.in</a> or reach {site.developer} through{" "}
            <a href={site.parentSiteUrl} target="_blank" rel="noreferrer">
              {site.parentSite}
            </a>
            .
          </p>
          <p className="muted">Last updated: November {site.year}</p>
        </div>
      </div>
    </section>
  );
}
