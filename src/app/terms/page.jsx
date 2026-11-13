import Breadcrumb from "@/components/Breadcrumb";
import { site } from "@/data/site";

export const metadata = {
  title: "Terms",
  description: `Terms of use for ${site.name} and the Android apps distributed through it.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="page-hero" aria-labelledby="terms-title">
      <div className="container">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms", href: "/terms" }]} />
          <h1 id="terms-title">Terms of use</h1>
          <p>The plain-language rules for using this site and downloading apps from it.</p>

        <div className="prose">
          <h2>Downloads</h2>
          <p>
            Apps on {site.name} are provided free of charge as direct Android APK downloads. They are not distributed
            through Google Play. Installing an APK may require enabling installs from unknown sources on your device
            — only do this for files you trust, downloaded from {site.url}.
          </p>

          <h2>Use at your own discretion</h2>
          <p>
            The apps are provided &quot;as is&quot; without warranty of any kind. Every effort is made to keep them
            reliable and up to date, but there is no guarantee they will be free of defects or suitable for every
            device. Keep backups of anything important.
          </p>

          <h2>Ownership</h2>
          <p>
            The apps, their names, icons and this website&apos;s design are the work of {site.developer} · CodeLove.
            You may share links to this site freely. Please do not re-upload the APK files elsewhere or present them as
            your own.
          </p>

          <h2>Ads</h2>
          <p>
            Most apps show ads served by Google AdMob to keep them free. Ads come from Google and its partners, not from
            CodeLove; see the <a href="/privacy">privacy policy</a> for what data is used.
          </p>

          <h2>Changes</h2>
          <p>
            These terms may be updated as the collection grows. The date below always reflects the current version.
          </p>
          <p className="muted">Last updated: November {site.year}</p>
        </div>
      </div>
    </section>
  );
}
