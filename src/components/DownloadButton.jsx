import { Clock, Download, ExternalLink, Play } from "lucide-react";
import { assetUrl } from "@/lib/asset";

/*
  The single place that turns app.apkUrl into a download link.
  Replace apkUrl in src/data/apps.js with a real file URL and every button updates.
  Apps flagged `comingSoon` render a non-interactive "Coming soon" label instead.

  Inside the CodeLove app (html.in-hub) the download is swapped for Play (games) or
  Open (tools), which runs the app right there (app.playUrl). Both links are rendered;
  CSS shows one, so the static pages work without JavaScript.
*/
export default function DownloadButton({
  app,
  label = "Download",
  variant = "primary",
  size = "",
  className = "",
  iconSize = 17,
}) {
  const classes = `btn btn-${variant} ${size ? `btn-${size}` : ""} ${className}`.trim();

  if (app.comingSoon) {
    return (
      <span className={`btn btn-soon ${size ? `btn-${size}` : ""} ${className}`.trim()} aria-label={`${app.name} is coming soon`}>
        <Clock size={iconSize} aria-hidden="true" />
        Coming soon
      </span>
    );
  }

  const fileName = app.apkUrl.split("/").pop();
  const isGame = app.category === "Games" && app.id !== "javaplay";

  return (
    <>
      <a
        href={assetUrl(app.apkUrl)}
        download={fileName}
        data-dl-app={app.id}
        className={`${classes} hub-hide`}
        aria-label={`${label} ${app.name} (${app.platform} APK, ${app.size})`}
      >
        <Download size={iconSize} className="btn-down" aria-hidden="true" />
        {label}
      </a>
      {app.playUrl && (
        <a href={app.playUrl} className={`${classes} hub-only`} aria-label={`${isGame ? "Play" : "Open"} ${app.name}`}>
          {isGame ? <Play size={iconSize} aria-hidden="true" /> : <ExternalLink size={iconSize} aria-hidden="true" />}
          {isGame ? "Play" : "Open"}
        </a>
      )}
    </>
  );
}
