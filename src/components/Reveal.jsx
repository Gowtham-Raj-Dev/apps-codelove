"use client";

import { useEffect, useRef } from "react";

/*
  Scroll-reveal wrapper. Children fade/slide in once they enter the viewport.
  variant: "up" (default) | "fade" | "blur" | "scale" | "left" | "right"
  delay:   milliseconds

  How it works (no flash of hidden content):
  - Elements already in the first viewport are revealed by a tiny inline script in
    app/layout.jsx *before* hydration, using a CSS keyframe for the entrance.
  - Everything further down is revealed here with an IntersectionObserver.
  - Without JavaScript (no "js" class on <html>) the CSS shows everything.
  The class list is managed on the DOM directly, hence suppressHydrationWarning.
*/
export default function Reveal({ as: Tag = "div", variant = "up", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.classList.contains("is-visible")) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variantClass = variant === "up" ? "" : `reveal--${variant}`;

  return (
    <Tag
      ref={ref}
      className={`reveal ${variantClass} ${className}`.replace(/\s+/g, " ").trim()}
      style={delay ? { "--delay": `${delay}ms` } : undefined}
      suppressHydrationWarning
      {...rest}
    >
      {children}
    </Tag>
  );
}
