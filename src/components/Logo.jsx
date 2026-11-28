import Link from "next/link";
import { site } from "@/data/site";

/* Blue Android + Apps Grid mark for apps.codelove.in, synced with src/app/icon.svg
   and codelove-parent-domain/public/logos/apps.svg. */
export function LogoMark({ size = 32 }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="clAppsLogoBg" x1="4" y1="2" x2="60" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2563EB" />
          <stop offset="0.55" stopColor="#2158FE" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#clAppsLogoBg)" />
      <rect x="1" y="1" width="62" height="62" rx="14" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1.5" />
      <line x1="22.5" y1="11.5" x2="26" y2="17.5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <line x1="41.5" y1="11.5" x2="38" y2="17.5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 30.2C18 22.1 24.1 16 32 16C39.9 16 46 22.1 46 30.2V31.5C46 32.3 45.3 33 44.5 33H19.5C18.7 33 18 32.3 18 31.5V30.2Z" fill="#FFFFFF" />
      <circle cx="26.2" cy="25.2" r="2.2" fill="#1D4ED8" />
      <circle cx="37.8" cy="25.2" r="2.2" fill="#1D4ED8" />
      <rect x="18" y="36" width="12.5" height="7.5" rx="2.8" fill="#FFFFFF" />
      <rect x="33.5" y="36" width="12.5" height="7.5" rx="2.8" fill="#BAE6FD" />
      <rect x="18" y="46" width="12.5" height="7.5" rx="2.8" fill="#BAE6FD" />
      <rect x="33.5" y="46" width="12.5" height="7.5" rx="2.8" fill="#FFFFFF" />
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
