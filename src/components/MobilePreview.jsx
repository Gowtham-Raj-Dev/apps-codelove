import AppScreen from "./AppScreen";
import { assetUrl } from "@/lib/asset";

/*
  A CSS smartphone frame.
  - app + screenIndex → renders the matching mock screen from app.screens
  - image            → renders a real screenshot instead. When omitted, the app's
                       own `screenshots[screenIndex]` (URL or { src, label }) is used if present.
  - width            → phone width in px (everything inside scales with it).
                       CSS can still override it per context via `.some-wrapper .phone { --w: 200px }`.
*/
export default function MobilePreview({ app, screenIndex = 0, image, width = 280, className = "", alt }) {
  const screen = app?.screens?.[screenIndex] || app?.screens?.[0];
  const shot = app?.screenshots?.[screenIndex] || app?.screenshots?.[0];
  const src = image || (typeof shot === "string" ? shot : shot?.src);
  const label = typeof shot === "object" && shot?.label ? ` — ${shot.label}` : "";

  return (
    <div className={`phone ${className}`.trim()} style={{ "--phone-w": `${width}px` }}>
      <div className="phone-screen">
        <span className="phone-island" aria-hidden="true" />
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-supplied screenshot of unknown size/origin
          <img src={assetUrl(src)} alt={alt || `${app?.name || "App"} screenshot${label}`} loading="lazy" />
        ) : (
          <AppScreen app={app} screen={screen} />
        )}
        <span className="phone-gloss" aria-hidden="true" />
      </div>
    </div>
  );
}
