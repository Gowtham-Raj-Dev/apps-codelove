"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search apps..." }) {
  const inputRef = useRef(null);

  // Press "/" anywhere on the page to focus the search field
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="search" role="search">
      <Search size={20} aria-hidden="true" />
      <label htmlFor="app-search" className="sr-only">
        Search apps
      </label>
      <input
        ref={inputRef}
        id="app-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {value ? (
        <button type="button" className="search-clear" onClick={() => onChange("")} aria-label="Clear search">
          <X size={18} aria-hidden="true" />
        </button>
      ) : (
        <span className="search-kbd" aria-hidden="true">
          /
        </span>
      )}
    </div>
  );
}
