import Link from "next/link";
import { ExternalLink } from "lucide-react";
import AppIcon from "./AppIcon";
import DownloadButton from "./DownloadButton";

/* Card for the tool apps: icon first, the web version one tap away. */
export default function ToolCard({ app }) {
  return (
    <article className="tool" style={{ "--accent": app.accent }}>
      <div className="tool-top">
        <AppIcon app={app} size={60} />
        {app.comingSoon ? <span className="chip">Coming soon</span> : <span className="chip chip-live">Available</span>}
      </div>
      <div>
        <h3>
          <Link href={`/apps/${app.id}`}>{app.name}</Link>
        </h3>
        <p className="tool-tag">{app.tagline}</p>
      </div>
      <p>{app.description}</p>
      <div className="tool-foot">
        <DownloadButton app={app} variant="secondary" label="APK" iconSize={16} />
        {app.webAppUrl && (
          <a href={app.webAppUrl} className="btn btn-ghost hub-hide" target="_blank" rel="noreferrer">
            Use online <ExternalLink size={15} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
