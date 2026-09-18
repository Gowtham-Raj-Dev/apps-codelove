import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
        textAlign: "center"
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px"
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: 800,
            color: "var(--text-main)",
            lineHeight: 1
          }}
        >
          404
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
          Page not found.
        </p>
        <Link
          href="/"
          className="btn btn-primary btn-sm"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "8px"
          }}
        >
          <ArrowLeft size={14} />
          <span>Return to Welcome</span>
        </Link>
      </div>
    </div>
  );
}
