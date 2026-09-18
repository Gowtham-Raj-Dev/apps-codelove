import Link from "next/link";
import { site } from "@/data/site";

export function LogoMark({ size = 30 }) {
  return (
    <svg
      className="logo-mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c6cff" />
          <stop offset="0.55" stopColor="#c66bff" />
          <stop offset="1" stopColor="#ff6b9a" />
        </linearGradient>
        <linearGradient id="logo-gloss" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logo-grad)" />
      <rect width="32" height="32" rx="9" fill="url(#logo-gloss)" />
      <path
        d="M20.5 11.5c-1.1-1.2-2.7-1.8-4.4-1.8-3.6 0-6.4 2.8-6.4 6.3s2.8 6.3 6.4 6.3c1.7 0 3.3-.6 4.4-1.8"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${site.name} home`}>
      <LogoMark />
      <span className="logo-text">
        Codelove <span>Apps</span>
      </span>
    </Link>
  );
}
