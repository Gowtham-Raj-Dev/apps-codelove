import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "../Reveal";
import AppCard from "../AppCard";
import { getFeaturedApps } from "@/data/apps";

export default function FeaturedApps() {
  const featured = getFeaturedApps(3);

  return (
    <section className="section" aria-labelledby="featured-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">Featured</span>
            <h2 id="featured-title" style={{ marginTop: 14 }}>
              Featured apps
            </h2>
            <p className="lead">Explore some of the latest apps built by Codelove.</p>
          </div>
          <Link href="/apps" className="link-arrow">
            View all apps <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="featured-grid">
          {featured.map((app, i) => (
            <Reveal key={app.id} delay={i * 110}>
              <AppCard app={app} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
