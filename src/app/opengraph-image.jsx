import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const dynamic = "force-static";

// Social preview image, generated at build time (1200×630).
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
          <svg width="64" height="64" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="15" fill="#16181f" stroke="#2a2c35" strokeWidth="1.5" />
            <path d="M44.5 21.2A16 16 0 1 0 44.5 42.8" fill="none" stroke="#fff" strokeWidth="7.5" strokeLinecap="round" />
            <path d="M28.5 24.6v14.8a1.6 1.6 0 0 0 2.4 1.4l12-7.4a1.6 1.6 0 0 0 0-2.8l-12-7.4a1.6 1.6 0 0 0-2.4 1.4z" fill="#3b82f6" />
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
