import { Eye, Gauge, Hand, Sparkles } from "lucide-react";
import Reveal from "../Reveal";
import Parallax from "../Parallax";
import MobilePreview from "../MobilePreview";
import { apps, getAppById } from "@/data/apps";

export default function ShowcaseSection() {
  const app = getAppById("dailyloop") || apps[0];

  return (
    <section className="section" aria-labelledby="showcase-title">
      <div className="container">
        <Reveal variant="scale" className="showcase">
          <div className="ambient" aria-hidden="true">
            <div className="ambient-grid" />
          </div>

          <div className="showcase-head">
            <span className="eyebrow">Designed for mobile</span>
            <h2 id="showcase-title" style={{ marginTop: 14 }}>
              Designed for your everyday screen.
            </h2>
            <p className="lead">
              Every Codelove app is designed with a focus on clarity, speed and a smooth mobile experience.
            </p>
          </div>

          <Parallax className="showcase-stage">
            <div className="showcase-halo" aria-hidden="true" />

            <div className="showcase-phone float-soft">
              <MobilePreview app={app} screenIndex={0} width={330} />
            </div>

            <div className="showcase-panel showcase-panel--1">
              <div className="showcase-panel-head">
                <i>
                  <Eye size={15} aria-hidden="true" />
                </i>
                Clarity
              </div>
              <p>Large touch targets, clear hierarchy and nothing competing for attention.</p>
              <div className="showcase-meter" aria-hidden="true">
                <i style={{ "--v": "92%" }} />
              </div>
            </div>

            <div className="showcase-panel showcase-panel--2">
              <div className="showcase-panel-head">
                <i>
                  <Gauge size={15} aria-hidden="true" />
                </i>
                Speed
              </div>
              <p>Cold start under a second. Interactions respond instantly.</p>
              <div className="showcase-meter" aria-hidden="true">
                <i style={{ "--v": "96%" }} />
              </div>
            </div>

            <div className="showcase-panel showcase-panel--3">
              <div className="showcase-panel-head">
                <i>
                  <Hand size={15} aria-hidden="true" />
                </i>
                One-hand friendly
              </div>
              <p>Primary actions live at the bottom of the screen, where your thumb already is.</p>
            </div>

            <span className="float-chip showcase-chip float delay-2">
              <Sparkles size={16} aria-hidden="true" />
              Smooth by default
            </span>

            <span className="showcase-dot showcase-dot--1" aria-hidden="true" />
            <span className="showcase-dot showcase-dot--2" aria-hidden="true" />
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
