import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { site } from "@/data/site";

/* Breadcrumb trail + BreadcrumbList structured data. items: [{ label, href }] */
export default function Breadcrumb({ items }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${site.url}${item.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="crumbs">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {last ? <span aria-current="page">{item.label}</span> : <Link href={item.href}>{item.label}</Link>}
              {!last && <ChevronRight size={14} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
