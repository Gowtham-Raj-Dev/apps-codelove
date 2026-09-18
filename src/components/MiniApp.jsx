import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import AppIcon from "./AppIcon";

/* Compact list-style app row used in the category explorer. */
export default function MiniApp({ app, index = 0 }) {
  return (
    <Link href={`/apps/${app.id}`} className="mini-app" style={{ "--accent": app.accent, "--i": index }}>
      <AppIcon app={app} size={48} />
      <span className="mini-app-body">
        <strong>{app.name}</strong>
        <span>{app.description}</span>
      </span>
      <span className="mini-app-rating">
        <Star size={14} aria-hidden="true" />
        {app.rating}
      </span>
      <ChevronRight size={18} aria-hidden="true" />
    </Link>
  );
}
