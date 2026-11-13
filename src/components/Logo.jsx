import Link from "next/link";
import { site } from "@/data/site";

/* The CodeLove mark ("C" with the blue heart), same artwork as codelove.in
   (codelove-parent-domain/public/new-logo/favicon-adaptive.svg) and src/app/icon.svg. */
export const C_PATH =
  "M 146 0 L 85 21 L 42 56 L 9 114 L 0 178 L 18 236 L 62 288 L 118 316 L 181 322 L 245 300 L 298 253 L 247 213 L 222 239 L 182 257 L 150 258 L 114 245 L 87 221 L 70 187 L 67 156 L 75 125 L 100 92 L 138 72 L 197 74 L 221 86 L 248 112 L 300 67 L 271 36 L 237 15 L 185 0 Z";
export const HEART_PATH =
  "M 119 118 L 111 123 L 101 136 L 98 146 L 98 162 L 100 168 L 110 184 L 145 218 L 165 233 L 191 211 L 221 181 L 231 160 L 230 141 L 223 128 L 217 122 L 205 116 L 191 115 L 181 118 L 166 132 L 162 131 L 153 121 L 142 116 L 130 115 Z";

export function LogoMark({ size = 32 }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="-54.5 -43.5 410 410" aria-hidden="true">
      <rect x="-54.5" y="-43.5" width="410" height="410" rx="90" fill="#000" />
      <rect x="-50.5" y="-39.5" width="402" height="402" rx="86" fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="8" />
      <path d={C_PATH} fill="#fff" />
      <path d={HEART_PATH} fill="#2158FE" />
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
