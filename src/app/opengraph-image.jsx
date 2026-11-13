import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { C_PATH, HEART_PATH } from "@/components/Logo";

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
          <svg width="64" height="64" viewBox="-54.5 -43.5 410 410">
            <rect x="-54.5" y="-43.5" width="410" height="410" rx="90" fill="#000" />
            <path d={C_PATH} fill="#fff" />
            <path d={HEART_PATH} fill="#2158FE" />
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
