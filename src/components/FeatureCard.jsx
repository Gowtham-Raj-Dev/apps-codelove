import { Icon } from "./icons";

export default function FeatureCard({ icon, title, text, accent = false }) {
  return (
    <div className="feature-card">
      <span className={`feature-icon ${accent ? "feature-icon--accent" : ""}`}>
        <Icon name={icon} size={22} aria-hidden="true" />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}
