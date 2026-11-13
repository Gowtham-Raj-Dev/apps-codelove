import Link from "next/link";
import { site } from "@/data/site";

/* CodeLove Apps mark: a bold "C" holding a play button (apps + games). Same drawing as src/app/icon.svg. */
export function LogoMark({ size = 32 }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="15" fill="#16181f" />
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="14.25" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="1.5" />
      <path d="M44.5 21.2A16 16 0 1 0 44.5 42.8" fill="none" stroke="#fff" strokeWidth="7.5" strokeLinecap="round" />
      <path d="M28.5 24.6v14.8a1.6 1.6 0 0 0 2.4 1.4l12-7.4a1.6 1.6 0 0 0 0-2.8l-12-7.4a1.6 1.6 0 0 0-2.4 1.4z" fill="#3b82f6" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${site.name} home`}>
      <LogoMark />
      <span className="logo-text">
        CodeLove <span>Apps</span>
      </span>
    </Link>
  );
}
