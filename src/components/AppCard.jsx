import Link from "next/link";
import AppIcon from "./AppIcon";
import DownloadButton from "./DownloadButton";
import { assetUrl } from "@/lib/asset";

/* Cover card: the app's original art on top, icon + name + download below. The whole card links to the app page. */
export default function AppCard({ app, eager = false }) {
  const subtitle = app.genre || app.category;
  return (
    <article className="card" style={{ "--accent": app.accent }}>
      <div className="card-cover">
        {app.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export, local art
          <img src={assetUrl(app.cover)} alt="" width={1200} height={630} loading={eager ? "eager" : "lazy"} decoding="async" />
        ) : (
          <span className="card-cover-fill" style={{ display: "block", background: app.icon?.gradient || app.accent }} />
        )}
        <span className="card-badges">
          <span className="chip chip-glass">{subtitle}</span>
          {app.comingSoon && <span className="chip chip-soon">Coming soon</span>}
        </span>
      </div>

      <div className="card-body">
        <div className="card-id">
          <AppIcon app={app} size={52} />
          <div>
            <h3 className="card-title">
              <Link href={`/apps/${app.id}`}>{app.name}</Link>
            </h3>
            <span className="card-sub">
              v{app.version} · {app.size}
            </span>
          </div>
        </div>
        <p className="card-text">{app.description}</p>
        <div className="card-foot">
          <DownloadButton app={app} variant="secondary" label="Download APK" iconSize={16} />
        </div>
      </div>
    </article>
  );
}
