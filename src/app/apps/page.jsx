import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import AppExplorer from "@/components/AppExplorer";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";

export const metadata = {
  title: "Explore all apps",
  description: `Browse the growing collection of Android apps created by ${site.developer} at Codelove. Search by name or filter by category and download directly.`,
  alternates: { canonical: "/apps" },
  openGraph: {
    title: `Explore all apps — ${site.name}`,
    description: `Browse the growing collection of Android apps created by ${site.developer} at Codelove.`,
    url: `${site.url}/apps`,
  },
};

export default function AppsPage() {
  return (
    <>
      <section className="page-header" aria-labelledby="apps-title">
        <div className="ambient" aria-hidden="true">
          <div className="ambient-grid" />
          <div className="blob blob-1" />
          <div className="blob blob-2" />
        </div>
        <div className="container">
          <Reveal variant="fade">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Apps", href: "/apps" }]} />
          </Reveal>
          <Reveal delay={60}>
            <h1 id="apps-title">Explore all apps</h1>
            <p className="lead">Browse the growing collection of mobile apps created by Codelove.</p>
          </Reveal>
          <Reveal delay={140}>
            <Suspense fallback={<div className="explorer-controls" style={{ minHeight: 140 }} />}>
              <AppExplorer />
            </Suspense>
          </Reveal>
        </div>
      </section>
    </>
  );
}
