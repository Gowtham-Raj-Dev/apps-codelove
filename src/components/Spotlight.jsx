"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppIcon from "./AppIcon";
import DownloadButton from "./DownloadButton";
import { assetUrl } from "@/lib/asset";

const SLIDE_MS = 6000;

/* Home page carousel: big game art on the left, the list of slides on the right. */
export default function Spotlight({ slides }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, paused, slides.length]);

  return (
    <div
      className={`spot ${paused ? "is-paused" : ""}`}
      style={{ "--spot-time": `${SLIDE_MS}ms` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="spot-stage" aria-roledescription="carousel" aria-label="Featured apps">
        {slides.map((app, i) => (
          <div
            key={app.id}
            className={`spot-slide ${i === index ? "is-active" : ""}`}
            aria-hidden={i !== index}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${app.name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, local art */}
            <img src={assetUrl(app.hero)} alt="" fetchPriority={i === 0 ? "high" : "low"} loading={i === 0 ? "eager" : "lazy"} />
            <div className="spot-info">
              <div className="spot-chips">
                <span className="chip chip-glass">{app.genre || app.category}</span>
                {app.comingSoon ? <span className="chip chip-soon">Coming soon</span> : <span className="chip chip-glass">Free APK</span>}
              </div>
              <div className="spot-title">
                <AppIcon app={app} size={64} />
                <h2>{app.name}</h2>
              </div>
              <p>{app.description}</p>
              <div className="spot-actions">
                <DownloadButton app={app} label="Download APK" size="lg" />
                <Link href={`/apps/${app.id}`} className="btn btn-secondary btn-lg" tabIndex={i === index ? 0 : -1}>
                  Details <ArrowRight size={17} className="btn-arrow" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div className="spot-dots">
          {slides.map((app, i) => (
            <button
              key={app.id}
              type="button"
              className={i === index ? "is-active" : ""}
              aria-label={`Show ${app.name}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>

      <div className="spot-list">
        {slides.map((app, i) => (
          <button
            key={app.id}
            type="button"
            className={`spot-thumb ${i === index ? "is-active" : ""}`}
            aria-label={`Show ${app.name}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          >
            <AppIcon app={app} size={44} />
            <span>
              <strong>{app.name}</strong>
              <small>{app.genre || app.category}</small>
            </span>
            <span className="spot-progress" key={i === index ? `on-${index}` : "off"} />
          </button>
        ))}
      </div>
    </div>
  );
}
