"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";
import CategoryFilter from "../CategoryFilter";
import MiniApp from "../MiniApp";
import Reveal from "../Reveal";
import { apps } from "@/data/apps";
import { categories } from "@/data/categories";

/* "Find something useful" — floating category pills with an animated list of matching apps. */
export default function CategoryExplorer() {
  const [category, setCategory] = useState("All");

  const counts = useMemo(() => {
    const c = { All: apps.length };
    categories.forEach((cat) => {
      if (cat.id !== "All") c[cat.id] = apps.filter((a) => a.category === cat.id).length;
    });
    return c;
  }, []);

  const results = useMemo(
    () => (category === "All" ? apps : apps.filter((a) => a.category === category)).slice(0, 6),
    [category]
  );

  const browseHref = category === "All" ? "/apps" : `/apps?category=${encodeURIComponent(category)}`;

  return (
    <section className="section" aria-labelledby="explore-title" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal variant="scale" className="explorer">
          <div className="explorer-head">
            <span className="eyebrow">Categories</span>
            <h2 id="explore-title" style={{ marginTop: 14 }}>
              Find something useful
            </h2>
            <p className="lead">Pick a category and jump straight to the apps that fit what you need.</p>
          </div>

          <CategoryFilter value={category} onChange={setCategory} counts={counts} center />

          {/* key forces a re-mount so the rows animate in on every filter change */}
          <div className="explorer-results" key={category} aria-live="polite">
            {results.length > 0 ? (
              results.map((app, i) => <MiniApp key={app.id} app={app} index={i} />)
            ) : (
              <div className="empty-state">
                <span className="feature-icon">
                  <SearchX size={22} aria-hidden="true" />
                </span>
                <h3>Nothing here yet</h3>
                <p>New {category.toLowerCase()} apps are on the way.</p>
              </div>
            )}
          </div>

          <div className="explorer-foot">
            <Link href={browseHref} className="btn btn-secondary">
              Browse {category === "All" ? "all apps" : `${category} apps`}
              <ArrowRight size={16} className="btn-arrow" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
