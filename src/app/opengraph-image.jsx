import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const dynamic = "force-static";

// Social preview image, generated at build time (1200x630).
export const alt = `${site.name} — free Android games and tools by ${site.developer}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0e0f13",
          fontFamily: "sans-serif",
          color: "#f4f5fa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="15" fill="#2158FE" />
            <line x1="22.5" y1="11.5" x2="26" y2="17.5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="41.5" y1="11.5" x2="38" y2="17.5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M18 30.2C18 22.1 24.1 16 32 16C39.9 16 46 22.1 46 30.2V31.5C46 32.3 45.3 33 44.5 33H19.5C18.7 33 18 32.3 18 31.5V30.2Z" fill="#FFFFFF" />
            <circle cx="26.2" cy="25.2" r="2.2" fill="#1D4ED8" />
            <circle cx="37.8" cy="25.2" r="2.2" fill="#1D4ED8" />
            <rect x="18" y="36" width="12.5" height="7.5" rx="2.8" fill="#FFFFFF" />
            <rect x="33.5" y="36" width="12.5" height="7.5" rx="2.8" fill="#BAE6FD" />
            <rect x="18" y="46" width="12.5" height="7.5" rx="2.8" fill="#BAE6FD" />
            <rect x="33.5" y="46" width="12.5" height="7.5" rx="2.8" fill="#FFFFFF" />
          </svg>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 74, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, display: "flex", flexDirection: "column" }}>
            <span>Free Android games</span>
            <span>and tools.</span>
          </div>
          <div style={{ fontSize: 28, color: "#a9adba" }}>3D games · Video cutter · Video to GIF · Insta Downloader · JavaPlay</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#767a87" }}>{`apps.codelove.in · by ${site.developer}`}</div>
      </div>
    ),
    size,
  );
}
