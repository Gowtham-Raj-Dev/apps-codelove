import { Icon } from "./icons";

/*
  Renders an app icon.
  - If app.iconImage is set, the real image is shown.
  - Otherwise a glossy generated icon (gradient + Lucide icon) is rendered.
*/
export default function AppIcon({ app, size = 64, className = "" }) {
  const style = { "--size": `${size}px`, "--accent": app.accent };

  if (app.iconImage) {
    return (
      <span className={`app-icon ${className}`} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element -- user-supplied image of unknown size/origin */}
        <img src={app.iconImage} alt={`${app.name} app icon`} loading="lazy" />
      </span>
    );
  }

  return (
    <span
      className={`app-icon ${className}`}
      style={{ ...style, background: app.icon?.gradient || app.accent }}
      role="img"
      aria-label={`${app.name} app icon`}
    >
      <Icon name={app.icon?.name} strokeWidth={2.2} aria-hidden="true" />
    </span>
  );
}
