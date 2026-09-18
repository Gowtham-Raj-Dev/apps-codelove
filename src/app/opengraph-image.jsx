import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const dynamic = "force-static";

// Social preview image, generated at build time (1200×630).
export const alt = `${site.name} — Useful mobile apps by ${site.developer}`;
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
          background: "linear-gradient(135deg, #ffffff 0%, #f3f4f8 100%)",
          fontFamily: "sans-serif",
          color: "#0c0e14",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 520,
            background: "radial-gradient(circle, rgba(124,108,255,0.28), rgba(255,107,154,0.10) 60%, transparent 75%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #7c6cff, #c66bff 55%, #ff6b9a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            C
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>{site.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05, display: "flex", flexDirection: "column" }}>
            <span>Apps made to be useful.</span>
            <span style={{ color: "#4b5063" }}>Designed to feel effortless.</span>
          </div>
          <div style={{ fontSize: 28, color: "#4b5063", display: "flex" }}>
            {`Useful Android apps by ${site.developer} · ${site.url.replace("https://", "")}`}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
