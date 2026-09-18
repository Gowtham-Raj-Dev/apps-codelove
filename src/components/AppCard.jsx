import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppIcon from "./AppIcon";
import AppStats from "./AppStats";
import DownloadButton from "./DownloadButton";

/*
  Premium app card used on Home (featured), Apps (grid) and Detail (related).
  Pass `index` to stagger the entrance animation inside a grid.
*/
export default function AppCard({ app, index = 0 }) {
  return (
    <article className="app-card shine" style={{ "--accent": app.accent, "--i": index }}>
      <div className="app-card-head">
        <div className="icon-frame">
          <AppIcon app={app} size={60} />
        </div>
        <div className="app-card-pills">
          {app.comingSoon && <span className="pill pill-soon">Coming soon</span>}
          <span className="pill pill-soft">{app.category}</span>
        </div>
      </div>

      <div>
        <h3 className="app-card-title">
          <Link href={`/apps/${app.id}`}>{app.name}</Link>
        </h3>
        <p>{app.description}</p>
      </div>

      <div className="app-card-meta">
        <AppStats app={app} />
        <span className="app-card-version">v{app.version}</span>
      </div>

      <div className="app-card-actions">
        <Link href={`/apps/${app.id}`} className="btn btn-secondary" aria-label={`View details for ${app.name}`}>
          View Details <ArrowRight size={16} className="btn-arrow" aria-hidden="true" />
        </Link>
        <DownloadButton app={app} iconSize={16} />
      </div>
    </article>
  );
}
