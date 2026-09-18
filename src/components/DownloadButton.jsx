import { Clock, Download } from "lucide-react";

/*
  The single place that turns app.apkUrl into a download link.
  Replace apkUrl in src/data/apps.js with a real file URL and every button updates.
  Apps flagged `comingSoon` render a non-interactive "Coming soon" label instead.
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

  return (
    <a
      href={app.apkUrl}
      download={fileName}
      className={classes}
      aria-label={`${label} ${app.name} (${app.platform} APK, ${app.size})`}
    >
      <Download size={iconSize} className="btn-down" aria-hidden="true" />
      {label}
    </a>
  );
}
