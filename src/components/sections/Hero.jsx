import Link from "next/link";
import { ArrowRight, Download, ShieldCheck, Sparkles, Star, Zap } from "lucide-react";
import Reveal from "../Reveal";
import MobilePreview from "../MobilePreview";
import AppIcon from "../AppIcon";
import { apps, getAppById } from "@/data/apps";
import { site } from "@/data/site";

export default function Hero() {
  const mainApp = getAppById("clipdropper") || apps[0];
  const backApp = getAppById("frameflow") || apps[1];
  const iconApp = getAppById("snaptools") || apps[2];
  const liveCount = apps.filter((a) => !a.comingSoon).length;
  const soonCount = apps.length - liveCount;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="ambient" aria-hidden="true">
        <div className="ambient-grid" />
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="ambient-noise" />
      </div>

      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <Reveal variant="fade">
              <span className="hero-badge">
                <i>
                  <Sparkles size={13} aria-hidden="true" />
                </i>
                {site.name} · Apps by {site.developer}
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 id="hero-title">
                <span>Apps made to be useful.</span>
                <span>Designed to feel effortless.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="lead">
                Discover a growing collection of thoughtfully crafted mobile apps by {site.developer}. Explore useful
                tools, creative experiences, and simple solutions designed for everyday use.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="hero-actions">
                <Link href="/apps" className="btn btn-primary btn-lg">
                  Explore Apps <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />
                </Link>
                <Link href="/about" className="btn btn-secondary btn-lg">
                  About Codelove
                </Link>
              </div>
            </Reveal>

            <Reveal delay={320} variant="fade">
              <div className="hero-meta">
                <div className="hero-meta-avatars" aria-hidden="true">
                  {apps.slice(0, 4).map((app) => (
                    <AppIcon key={app.id} app={app} size={32} />
                  ))}
                </div>
                <span>
                  {liveCount} {liveCount === 1 ? "app" : "apps"} live
                  {soonCount > 0 && ` · ${soonCount} coming soon`} · Android APK · Free to download
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal variant="scale" delay={120} className="hero-visual" aria-hidden="true">
            <div className="hv-glow" />
            <div className="hv-ring" />
            <div className="hv-ring hv-ring--2" />

            <div className="hv-phone-back float-soft delay-2">
              <MobilePreview app={backApp} screenIndex={1} width={214} />
            </div>

            <div className="hv-phone-main">
              <MobilePreview app={mainApp} screenIndex={0} width={282} />
            </div>

            <div className="float-card hv-card-rating float delay-1">
              <span className="float-card-icon float-card-icon--star">
                <Star size={18} fill="currentColor" aria-hidden="true" />
              </span>
              <span>
                <strong>4.8 ★</strong>
                <small>Rating</small>
              </span>
            </div>

            <div className="float-card hv-card-downloads float delay-3">
              <span className="float-card-icon float-card-icon--sky">
                <Download size={18} aria-hidden="true" />
              </span>
              <span>
                <strong>10K+</strong>
                <small>Downloads</small>
              </span>
            </div>

            <span className="float-chip hv-chip-fast float delay-2">
              <Zap size={16} aria-hidden="true" />
              Fast &amp; Simple
            </span>

            <span className="float-chip hv-chip-privacy float delay-4">
              <ShieldCheck size={16} aria-hidden="true" />
              Privacy first
            </span>

            <div className="hv-icon float delay-4">
              <AppIcon app={iconApp} size={58} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
