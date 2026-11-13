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
      return [app.name, app.category, app.genre, app.description, app.tagline].join(" ").toLowerCase().includes(q);
    });
  }, [query, category]);

  return (
    <>
      <div className="explorer">
        <SearchBar value={query} onChange={setQuery} placeholder="Search games and apps" />
        <div className="explorer-bar">
          <CategoryFilter value={category} onChange={setCategory} counts={counts} />
          <p className="results-count" aria-live="polite">
            <strong>{results.length}</strong> of {apps.length} apps
          </p>
        </div>
      </div>

      <div className="apps-grid">
        {results.length > 0 ? (
          results.map((app, i) => <AppCard key={app.id} app={app} eager={i < 4} />)
        ) : (
          <div className="empty">
            <SearchX size={28} aria-hidden="true" />
            <h3>No apps found</h3>
            <p>Try another word or category.</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
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