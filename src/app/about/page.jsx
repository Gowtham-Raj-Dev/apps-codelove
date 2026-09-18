import Link from "next/link";
import {
  ArrowRight,
  Code,
  Compass,
  FlaskConical,
  Globe,
  Hammer,
  Layers,
  PenTool,
  Smartphone,
  TrendingUp,
  Wrench,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Reveal from "@/components/Reveal";
import CtaSection from "@/components/sections/CtaSection";
import { apps } from "@/data/apps";
import { categories } from "@/data/categories";
import { site } from "@/data/site";

export const metadata = {
  title: "About",
  description: `Codelove Apps is a personal app studio by ${site.developer}, focused on creating simple, useful and polished digital experiences for everyday users.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${site.name}`,
    description: `Codelove Apps is a personal app studio by ${site.developer}, focused on simple, useful and polished mobile apps.`,
    url: `${site.url}/about`,
  },
};

const skills = [
  { icon: Globe, label: "Web Development" },
  { icon: Smartphone, label: "Mobile App Development" },
  { icon: PenTool, label: "UI/UX" },
  { icon: FlaskConical, label: "Product Experiments" },
  { icon: Wrench, label: "Digital Tools" },
];

const pillars = [
  { icon: Hammer, title: "Build", text: "Apps & tools" },
  { icon: PenTool, title: "Design", text: "Clean experiences" },
  { icon: FlaskConical, title: "Experiment", text: "New ideas" },
  { icon: TrendingUp, title: "Improve", text: "Continuous iteration" },
];

const principles = [
  {
    icon: Compass,
    title: "Start with a real problem",
    text: "Every app begins as something I wanted for myself. If it is not useful on day one, it does not ship.",
  },
  {
    icon: Layers,
    title: "Keep it small",
    text: "One job, done well. Fewer screens, fewer settings, and nothing that needs a tutorial.",
  },
  {
    icon: Code,
    title: "Respect the device",
    text: "Fast starts, low battery use, offline by default, and your data stays on your phone.",
  },
];

export default function AboutPage() {
  const activeCategories = categories.filter((c) => c.id !== "All" && apps.some((a) => a.category === c.id));

  return (
    <>
      <section className="page-header" aria-labelledby="about-title">
        <div className="ambient" aria-hidden="true">
          <div className="ambient-grid" />
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="ambient-noise" />
        </div>
        <div className="container">
          <Reveal variant="fade">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
          </Reveal>

          <div className="about-hero">
            <Reveal delay={60}>
              <span className="eyebrow">About Codelove Apps</span>
              <h1 id="about-title" style={{ marginTop: 18 }}>
                Building useful things, one app at a time.
              </h1>
              <p className="lead">
                Codelove Apps is a personal app studio by {site.developer}, focused on creating simple, useful and
                polished digital experiences for everyday users.
              </p>
            </Reveal>

            <Reveal variant="scale" delay={160}>
              <div className="profile-card">
                <div className="profile-head">
                  <span className="profile-avatar" aria-hidden="true">
                    G
                  </span>
                  <div>
                    <h2>{site.developer}</h2>
                    <p>{site.developerTitle}</p>
                  </div>
                </div>
                <ul className="skills" aria-label="Areas of work">
                  {skills.map(({ icon: Icon, label }) => (
                    <li key={label}>
                      <Icon size={15} aria-hidden="true" />
                      {label}
                    </li>
                  ))}
                </ul>
                <div className="profile-links">
                  <a href={site.parentSiteUrl} target="_blank" rel="noreferrer">
                    <Globe size={15} aria-hidden="true" />
                    {site.parentSite}
                  </a>
                  <Link href="/apps">
                    <Smartphone size={15} aria-hidden="true" />
                    See the apps
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pillars (asymmetric) */}
      <section className="section" aria-labelledby="pillars-title">
        <div className="container">
          <div className="about-grid">
            <Reveal variant="left" className="about-grid-copy">
              <span className="eyebrow">The studio</span>
              <h2 id="pillars-title">
                Not a company.
                <br />
                <span className="text-gradient">A workshop.</span>
              </h2>
              <p className="lead">
                Codelove is where I turn small ideas into finished apps — designing, building and improving each one
                in the open, at my own pace.
              </p>
            </Reveal>
            <div className="about-cards">
              {pillars.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 90}>
                  <div className="about-card shine">
                    <span className={`feature-icon ${i === 0 ? "feature-icon--accent" : ""}`}>
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="section" aria-label="Studio at a glance" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="numbers">
            {[
              { value: apps.length, label: "Apps released" },
              { value: activeCategories.length, label: "Categories" },
              { value: "100%", label: "Free to download" },
              { value: "0", label: "Ads or trackers" },
            ].map((n, i) => (
              <Reveal key={n.label} delay={i * 80} className="number">
                <strong>{n.value}</strong>
                <span>{n.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section" aria-labelledby="principles-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow">How I work</span>
              <h2 id="principles-title" style={{ marginTop: 14 }}>
                A few principles behind every app
              </h2>
            </div>
            <Link href="/apps" className="link-arrow">
              Browse the apps <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Reveal>
          <div className="principles">
            {principles.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 90}>
                <div className="feature-card">
                  <span className="feature-icon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Curious what I have been building?"
        text="Every app in the collection is free to download as a direct Android APK."
        buttonLabel="Explore the apps"
      />
    </>
  );
}
