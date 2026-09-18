import React from "react";

export default function WelcomePage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        padding: "20px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Subtle modern ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(300px, 60vw, 650px)",
          height: "clamp(300px, 60vw, 650px)",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.04) 45%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Pure Centered Welcome */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1
          style={{
            fontSize: "clamp(3.5rem, 12vw, 7rem)",
            fontWeight: 800,
            letterSpacing: "-0.045em",
            color: "var(--text-main)",
            lineHeight: 1,
            userSelect: "none"
          }}
        >
          Welcome
        </h1>
      </div>
    </div>
  );
}
