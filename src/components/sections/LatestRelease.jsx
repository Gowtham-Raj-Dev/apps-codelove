import Link from "next/link";
import { ArrowRight, Calendar, Sparkles, Star, Tag } from "lucide-react";
import Reveal from "../Reveal";
import MobilePreview from "../MobilePreview";
import AppIcon from "../AppIcon";
import DownloadButton from "../DownloadButton";
import { getNewRelease } from "@/data/apps";

export default function LatestRelease() {
  const app = getNewRelease();

  return (
    <section id="latest" className="section" aria-labelledby="release-title" style={{ "--accent": app.accent }}>
      <div className="container">
        <div className="release">
          <Reveal variant="left" className="release-copy">
            <span className="badge-new">
              <Sparkles size={14} aria-hidden="true" />
              New release
            </span>
            <h2 id="release-title">Fresh from the studio</h2>

            <div className="release-app">
              <AppIcon app={app} size={76} />
              <div>
                <h3>{app.name}</h3>
                <p>{app.tagline}</p>
              </div>
            </div>

            <p className="lead">{app.description}</p>

            <div className="release-facts">
              <span className="release-fact release-fact--star">
                <Star size={15} aria-hidden="true" />
                {app.rating} rating
              </span>
              <span className="release-fact">
                <Tag size={15} aria-hidden="true" />
                Version {app.version}
              </span>
              <span className="release-fact">
                <Calendar size={15} aria-hidden="true" />
                Updated {app.updated}
              </span>
            </div>

            <div className="release-actions">
              <DownloadButton app={app} label="Download App" size="lg" />
              <Link href={`/apps/${app.id}`} className="btn btn-secondary btn-lg">
                View Details <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={100} className="release-visual" aria-hidden="true">
            <div className="release-backdrop" />
            <div className="release-backdrop release-backdrop--2" />
            <div className="release-phone float-soft">
              <MobilePreview app={app} screenIndex={1} width={300} />
            </div>
            <div className="float-card release-float-1 float delay-1">
              <span className="float-card-icon">
                <Sparkles size={18} aria-hidden="true" />
              </span>
              <span>
                <strong>v{app.version}</strong>
                <small>Just shipped</small>
              </span>
            </div>
            <div className="float-card release-float-2 float delay-3">
              <span className="float-card-icon float-card-icon--star">
                <Star size={18} fill="currentColor" aria-hidden="true" />
              </span>
              <span>
                <strong>{app.rating}</strong>
                <small>{app.downloads} downloads</small>
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
