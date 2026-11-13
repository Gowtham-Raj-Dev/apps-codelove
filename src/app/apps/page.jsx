import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import AppExplorer from "@/components/AppExplorer";
import { apps } from "@/data/apps";
import { site } from "@/data/site";

export const metadata = {
  title: "All apps and games",
  description: `Browse every free Android app and game by ${site.developer} at CodeLove. Search by name, filter by category and download the APK.`,
  alternates: { canonical: "/apps/" },
  openGraph: {
    title: `All apps and games — ${site.name}`,
    description: `Every free Android app and game by ${site.developer} at CodeLove.`,
    url: `${site.url}/apps`,
  },
};

export default function AppsPage() {
  return (
    <section className="page-hero" aria-labelledby="apps-title">
      <div className="container">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Apps", href: "/apps" }]} />
        <h1 id="apps-title">All apps and games</h1>
        <p>{apps.length} free Android apps. Search, filter by category and download the APK.</p>
        <Suspense fallback={<div className="explorer" style={{ minHeight: 120 }} />}>
          <AppExplorer />
        </Suspense>
      </div>
    </section>
  );
}
