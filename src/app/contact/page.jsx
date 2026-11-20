import Link from "next/link";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { site } from "@/data/site";

const EMAIL = "gowtham@codelove.in";
const WHATSAPP = "https://wa.me/916369494396";

export const metadata = {
  title: "Contact",
  description: `Contact ${site.developer}, the maker of CodeLove Apps: questions, bug reports and app ideas by email or WhatsApp.`,
  alternates: { canonical: "/contact/" },
  openGraph: {
    title: `Contact — ${site.name}`,
    description: `Questions, bug reports or app ideas? Reach ${site.developer} by email or WhatsApp.`,
    url: `${site.url}/contact/`,
  },
};

export default function ContactPage() {
  return (
    <section className="page-hero" aria-labelledby="contact-title">
      <div className="container">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} />
        <div className="about-grid" style={{ marginTop: 8 }}>
          <div>
            <h1 id="contact-title">Contact</h1>
            <div className="prose" style={{ marginTop: 18 }}>
              <p>
                CodeLove Apps is made by one developer, {site.developer}. If an app won&apos;t install, a game
                crashes, a tool doesn&apos;t save your file, or you have an idea for a new app, send a message — it
                comes straight to me.
              </p>
              <p>
                For a bug, please say which app it is, your phone model and Android version, and what you did
                before it went wrong. A screenshot helps a lot.
              </p>
            </div>
            <div className="detail-actions">
              <a href={`mailto:${EMAIL}`} className="btn btn-primary btn-lg">
                <Mail size={17} aria-hidden="true" /> {EMAIL}
              </a>
              <a href={WHATSAPP} className="btn btn-secondary btn-lg" target="_blank" rel="noreferrer">
                <MessageCircle size={17} aria-hidden="true" /> WhatsApp
              </a>
            </div>
          </div>

          <aside className="profile" aria-label="More">
            <div className="prose">
              <p>
                Before writing, the <Link href="/about">About page</Link> explains how the apps work, and the{" "}
                <Link href="/privacy">Privacy policy</Link> covers what data is used.
              </p>
            </div>
            <div className="detail-actions">
              <Link href="/apps" className="btn btn-secondary">
                Browse the apps <ArrowRight size={16} className="btn-arrow" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
