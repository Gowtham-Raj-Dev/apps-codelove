import Link from "next/link";
import { ChevronRight } from "lucide-react";

/* items: [{ label, href }] — the last item is the current page. */
export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label}>
              {last ? <span aria-current="page">{item.label}</span> : <Link href={item.href}>{item.label}</Link>}
              {!last && <ChevronRight size={14} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
