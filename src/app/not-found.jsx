import Link from "next/link";
import { ArrowLeft, LayoutGrid } from "lucide-react";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="not-found" aria-labelledby="nf-title">
      <div className="ambient" aria-hidden="true">
        <div className="ambient-grid" />
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>
      <div className="not-found-card glass">
        <div className="not-found-code" aria-hidden="true">
          404
        </div>
        <h1 id="nf-title">This page could not be found</h1>
        <p className="lead">The link may be outdated, or the app you are looking for may have moved.</p>
        <div className="not-found-actions">
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={17} aria-hidden="true" />
            Back to home
          </Link>
          <Link href="/apps" className="btn btn-secondary">
            <LayoutGrid size={17} aria-hidden="true" />
            Browse apps
          </Link>
        </div>
      </div>
    </section>
  );
}
