import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "../Reveal";
import AppIcon from "../AppIcon";
import { apps } from "@/data/apps";

/*
  Wide glass call-to-action. Reused on Home and About.
*/
export default function CtaSection({
  title = "Something useful might be waiting for you.",
  text = "Explore the Codelove app collection and discover simple mobile experiences built with care.",
  buttonLabel = "Explore All Apps",
  href = "/apps",
}) {
  return (
    <section className="section" aria-labelledby="cta-title" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal variant="scale" className="cta-panel">
          <div className="cta-icons" aria-hidden="true">
            {apps.slice(0, 5).map((app) => (
              <AppIcon key={app.id} app={app} size={44} />
            ))}
          </div>
          <h2 id="cta-title">{title}</h2>
          <p className="lead">{text}</p>
          <div className="cta-actions">
            <Link href={href} className="btn btn-primary btn-lg">
              {buttonLabel} <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
