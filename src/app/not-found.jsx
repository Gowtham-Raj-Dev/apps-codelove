import Link from "next/link";
import { ArrowLeft, LayoutGrid } from "lucide-react";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="not-found" aria-labelledby="nf-title">
      <div>
        <div className="not-found-code" aria-hidden="true">
          404
        </div>
        <h1 id="nf-title" style={{ fontSize: "1.6rem" }}>
          This page could not be found
        </h1>
        <p>The link may be old, or the app may have moved.</p>
        <div className="actions">
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={17} aria-hidden="true" />
            Home
          </Link>
          <Link href="/apps" className="btn btn-secondary">
            <LayoutGrid size={17} aria-hidden="true" />
            All apps
          </Link>
        </div>
      </div>
    </section>
  );
}
