import { Download } from "lucide-react";

/*
  Live APK download count. The page renders "0"; public/dl.js fills in the real number from
  Firestore (dl/apps) and adds 1 when someone taps a Download APK button for this app.
*/
export default function DownloadCount({ app, className = "" }) {
  if (app.comingSoon) return null;
  return (
    <span className={`dl-count hub-hide ${className}`.trim()} data-dl-count={app.id}>
      <Download size={13} aria-hidden="true" />
      <span className="dl-num">0</span> downloads
    </span>
  );
}
