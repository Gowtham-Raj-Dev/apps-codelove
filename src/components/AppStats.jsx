import { Download, Smartphone, Star } from "lucide-react";

/*
  Inline rating / downloads / platform cluster.
  show: array of any of "rating" | "downloads" | "platform"
  Coming-soon apps have no real rating/downloads yet, so those two are skipped (the card badge/button already say so).
*/
export default function AppStats({ app, show = ["rating", "downloads", "platform"], size = "md" }) {
  const iconSize = size === "lg" ? 18 : 15;
  const soon = Boolean(app.comingSoon);
  return (
    <ul className={`app-stats ${size === "lg" ? "app-stats--lg" : ""}`} aria-label={`${app.name} stats`}>
      {!soon && show.includes("rating") && (
        <li className="stat stat-star">
          <Star size={iconSize} aria-hidden="true" />
          <span>{app.rating}</span>
          <span className="sr-only">rating</span>
        </li>
      )}
      {!soon && show.includes("downloads") && (
        <li className="stat">
          <Download size={iconSize} aria-hidden="true" />
          <span>{app.downloads}</span>
          <span className="sr-only">downloads</span>
        </li>
      )}
      {show.includes("platform") && (
        <li className="stat">
          <Smartphone size={iconSize} aria-hidden="true" />
          <span>{app.platform}</span>
        </li>
      )}
    </ul>
  );
}
