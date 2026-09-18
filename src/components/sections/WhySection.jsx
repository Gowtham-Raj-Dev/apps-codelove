import Link from "next/link";
import { ArrowRight, Feather, RefreshCw, Wrench, Zap } from "lucide-react";
import Reveal from "../Reveal";

const points = [
  { icon: Feather, title: "Simple", text: "Focused interfaces without unnecessary complexity." },
  { icon: Zap, title: "Fast", text: "Designed around quick and responsive interactions." },
  { icon: Wrench, title: "Useful", text: "Built around real everyday problems." },
  { icon: RefreshCw, title: "Evolving", text: "Regular improvements and new ideas." },
];

export default function WhySection() {
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container">
        <div className="why-grid">
          <Reveal variant="left" className="why-copy">
            <span className="eyebrow">Why Codelove Apps</span>
            <h2 id="why-title">
              <span>Small apps.</span>
              <span>
                <span className="text-gradient">Thoughtful</span> experiences.
              </span>
            </h2>
            <p className="lead">
              Each app starts with one everyday problem and stays focused on solving it well — nothing more, nothing
              in the way.
            </p>
            <Link href="/about" className="link-arrow">
              More about the studio <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Reveal>

          <div className="why-cards">
            {points.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 90} className="why-card shine">
                <span className="why-card-num" aria-hidden="true">
                  0{i + 1}
                </span>
                <span className={`feature-icon ${i === 0 ? "feature-icon--accent" : ""}`}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
