"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* A titled, horizontally scrolling row of cards with previous/next buttons. */
export default function Rail({ id, title, text, moreHref, moreLabel = "See all", children }) {
  const track = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scroll = (dir) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.9, behavior: "smooth" });

  return (
    <section className="section" aria-labelledby={id}>
      <div className="container">
        <div className="section-head">
          <div>
            <h2 id={id}>{title}</h2>
            {text && <p>{text}</p>}
          </div>
          <div className="rail-nav">
            {moreHref && (
              <Link href={moreHref} className="link-more">
                {moreLabel} <ChevronRight size={16} aria-hidden="true" />
              </Link>
            )}
            <button type="button" className="rail-btn" onClick={() => scroll(-1)} disabled={edges.start} aria-label="Scroll left">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className="rail-btn" onClick={() => scroll(1)} disabled={edges.end} aria-label="Scroll right">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="rail-track" ref={track} onScroll={update}>
          {children}
        </div>
      </div>
    </section>
  );
}
