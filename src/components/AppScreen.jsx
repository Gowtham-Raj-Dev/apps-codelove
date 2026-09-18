import {
  BatteryFull,
  Bell,
  Camera,
  ChevronRight,
  Folder,
  House,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  Signal,
  Wifi,
} from "lucide-react";
import AppIcon from "./AppIcon";
import { Icon } from "./icons";

/*
  Renders a realistic-looking mock app screen entirely with CSS.
  screen = { title, layout: "list" | "grid" | "stats" | "settings" | "scan" | "hero", items: [{label, meta}] }
  Sizes scale with the phone width (--w) so it looks right at any size.
*/
export default function AppScreen({ app, screen }) {
  const s = screen || app.screens[0];
  const glyph = app.icon?.name;

  return (
    <div className="screen" style={{ "--accent": app.accent }} aria-hidden="true">
      <div className="screen-status">
        <span>9:41</span>
        <span>
          <Signal size="1em" />
          <Wifi size="1em" />
          <BatteryFull size="1.15em" />
        </span>
      </div>

      <div className="screen-header">
        <AppIcon app={app} size={28} />
        <span className="screen-title">{s.title}</span>
        <span className="screen-icon-btn">
          {s.layout === "scan" ? <Camera size="1em" /> : <Bell size="1em" />}
        </span>
      </div>

      {(s.layout === "list" || s.layout === "grid") && (
        <div className="screen-search">
          <Search size="1em" />
          Search {app.name}
        </div>
      )}

      <div className="screen-body">
        {s.layout === "list" &&
          s.items.map((item, i) => (
            <div className="s-row" key={i}>
              <span className="s-row-icon">
                {i % 3 === 0 ? <Icon name={glyph} size="1.1em" /> : i % 3 === 1 ? <Folder size="1.1em" /> : <LayoutGrid size="1.1em" />}
              </span>
              <span className="s-row-body">
                <strong>{item.label}</strong>
                <span>{item.meta}</span>
              </span>
              <ChevronRight size="1em" />
            </div>
          ))}

        {s.layout === "grid" && (
          <div className="s-tiles">
            {s.items.map((item, i) => (
              <div className="s-tile" key={i}>
                <span className="s-tile-icon">
                  {i % 2 === 0 ? <Icon name={glyph} size="1.1em" /> : <Folder size="1.1em" />}
                </span>
                <span>
                  <strong>{item.label}</strong>
                  <span>{item.meta}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        {s.layout === "stats" && (
          <>
            <div className="s-hero-card">
              <small>{s.items[0]?.label}</small>
              <strong>{s.items[0]?.meta}</strong>
            </div>
            <div className="s-bars">
              {[45, 70, 55, 90, 65, 80, 50, 75, 95, 60].map((h, i) => (
                <i key={i} style={{ "--h": `${h}%` }} />
              ))}
            </div>
            <div className="s-stats-row">
              {s.items.slice(1, 3).map((item, i) => (
                <div className="s-stat" key={i}>
                  <small>{item.label}</small>
                  <strong>{item.meta}</strong>
                </div>
              ))}
            </div>
          </>
        )}

        {s.layout === "settings" &&
          s.items.map((item, i) => {
            const isToggle = item.meta === "On" || item.meta === "Off";
            return (
              <div className="s-setting" key={i}>
                <strong>{item.label}</strong>
                {isToggle ? <span className={`s-toggle ${item.meta === "On" ? "is-on" : ""}`} /> : <span>{item.meta}</span>}
              </div>
            );
          })}

        {s.layout === "scan" && (
          <div className="s-scan">
            <div className="s-scan-frame">
              <i />
              <i />
              <i />
              <i />
              <span className="s-scan-line" />
            </div>
            <span className="s-scan-shutter" />
            <span className="s-scan-caption">{s.items[0]?.label}</span>
          </div>
        )}

        {s.layout === "hero" && (
          <>
            <div className="s-preview">
              <span>{s.items[0]?.label}</span>
            </div>
            <div className="s-timeline">
              {Array.from({ length: 8 }).map((_, i) => (
                <i key={i} />
              ))}
            </div>
            {s.items.slice(1).map((item, i) => (
              <div className="s-setting" key={i}>
                <strong>{item.label}</strong>
                <span>{item.meta}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {s.layout !== "scan" && (
        <span className="screen-fab">
          <Plus size="1.2em" />
        </span>
      )}

      <div className="screen-nav">
        <span className={s.layout === "list" || s.layout === "scan" ? "is-active" : ""}>
          <House size="1.1em" />
        </span>
        <span className={s.layout === "grid" || s.layout === "hero" ? "is-active" : ""}>
          <LayoutGrid size="1.1em" />
        </span>
        <span className={s.layout === "stats" ? "is-active" : ""}>
          <Icon name={glyph} size="1.1em" />
        </span>
        <span className={s.layout === "settings" ? "is-active" : ""}>
          <Settings size="1.1em" />
        </span>
      </div>
    </div>
  );
}
