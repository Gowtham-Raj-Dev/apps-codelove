"use client";

import { useEffect, useState } from "react";
import { Check, Share2 } from "lucide-react";

/*
  Touch devices: opens the native share sheet.
  Desktop: copies the page URL to the clipboard (and says so).
*/
export default function ShareButton({ title, text, className = "btn btn-secondary" }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(""), 2200);
    return () => clearTimeout(t);
  }, [status]);

  async function share() {
    const url = window.location.href;
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    try {
      if (navigator.share && touchDevice) {
        await navigator.share({ title, text, url });
        setStatus("Shared");
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus("Link copied");
    } catch (err) {
      if (err?.name !== "AbortError") setStatus("Could not share");
    }
  }

  return (
    <span className="share-btn">
      <button type="button" className={className} onClick={share} aria-label={`Share ${title}`}>
        {status ? <Check size={17} aria-hidden="true" /> : <Share2 size={17} aria-hidden="true" />}
        {status || "Share"}
      </button>
      {status && (
        <span className="share-toast" role="status">
          {status}
        </span>
      )}
    </span>
  );
}
