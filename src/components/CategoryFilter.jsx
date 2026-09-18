"use client";

import { categories } from "@/data/categories";
import { Icon } from "./icons";

/*
  Pill-style category filter.
  props: value (active id), onChange(id), counts (optional {id: number}), center (bool)
*/
export default function CategoryFilter({
  value,
  onChange,
  counts,
  center = false,
  label = "Filter apps by category",
}) {
  return (
    <div className={`cat-filter ${center ? "cat-filter--center" : ""}`} role="group" aria-label={label}>
      {categories.map((cat) => {
        const active = value === cat.id;
        const count = counts ? counts[cat.id] : undefined;
        return (
          <button
            key={cat.id}
            type="button"
            className={`cat-pill ${active ? "is-active" : ""}`}
            aria-pressed={active}
            onClick={() => onChange(cat.id)}
          >
            <Icon name={cat.icon} size={16} aria-hidden="true" />
            {cat.label}
            {typeof count === "number" && <span className="count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
