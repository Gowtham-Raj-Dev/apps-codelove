"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import AppCard from "./AppCard";
import { apps } from "@/data/apps";
import { categories } from "@/data/categories";

const validCategory = (value) => (categories.some((c) => c.id === value) ? value : "All");

/* Search + category filtering + animated results grid for the Apps page. */
export default function AppExplorer() {
  const searchParams = useSearchParams();
  const paramCategory = validCategory(searchParams.get("category"));

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(paramCategory);

  // Keep the active category in sync with ?category= links (e.g. from the home page)
  const [seenParam, setSeenParam] = useState(paramCategory);
  if (seenParam !== paramCategory) {
    setSeenParam(paramCategory);
    setCategory(paramCategory);
  }

  const counts = useMemo(() => {
    const c = { All: apps.length };
    categories.forEach((cat) => {
      if (cat.id !== "All") c[cat.id] = apps.filter((a) => a.category === cat.id).length;
    });
    return c;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((app) => {
      const inCategory = category === "All" || app.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      return [app.name, app.category, app.description, app.tagline].join(" ").toLowerCase().includes(q);
    });
  }, [query, category]);

  return (
    <>
      <div className="explorer-controls">
        <SearchBar value={query} onChange={setQuery} />
        <div className="explorer-toolbar">
          <CategoryFilter value={category} onChange={setCategory} counts={counts} />
          <p className="results-count" aria-live="polite">
            Showing <strong>{results.length}</strong> of {apps.length} apps
          </p>
        </div>
      </div>

      {/* key re-mounts the grid so cards animate in when filters change */}
      <div className="apps-grid" key={`${category}-${query}`}>
        {results.length > 0 ? (
          results.map((app, i) => <AppCard key={app.id} app={app} index={i} />)
        ) : (
          <div className="empty-state">
            <span className="feature-icon">
              <SearchX size={22} aria-hidden="true" />
            </span>
            <h3>No apps found</h3>
            <p>Try a different search term or pick another category.</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 18 }}
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
