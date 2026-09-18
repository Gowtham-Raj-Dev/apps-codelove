import { Heart, Layers, RefreshCw, Smartphone, Wrench } from "lucide-react";

const items = [
  { icon: Smartphone, label: "Modern apps" },
  { icon: Layers, label: "Simple experiences" },
  { icon: Wrench, label: "Useful tools" },
  { icon: RefreshCw, label: "Continuous improvements" },
];

export default function TrustStrip() {
  return (
    <section className="trust" aria-label="What to expect">
      <div className="container">
        <div className="trust-inner">
          <span className="trust-label">
            <i>
              <Heart size={15} fill="currentColor" aria-hidden="true" />
            </i>
            Built with care
          </span>
          <ul className="trust-items">
            {items.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon size={16} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
