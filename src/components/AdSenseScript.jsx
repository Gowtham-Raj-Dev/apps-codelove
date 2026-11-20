"use client";

import { useEffect } from "react";

/**
 * Loads the Google AdSense tag after hydration (same as codelove.in). Skipped inside Android WebViews
 * (the CodeLove app shells use AdMob; AdSense in a WebView app is against AdSense policy).
 */
export default function AdSenseScript({ client }) {
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/CodeloveHub\/|KingdomClashApp\/|; wv\)/.test(ua)) return;
    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [client]);
  return null;
}
