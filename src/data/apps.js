import { webApps } from "./apps-web.js";
import { gameApps } from "./apps-games.js";
import { hubApp } from "./apps-hub.js";
import { assets } from "./assets.js";
import { downloads } from "./downloads.js";

/*
  App catalogue.

  Every UI element on the site AND every Android app (src/android-apps) reads from this
  array, so you only edit here. The entries live in three places:
    apps.js        This field guide and the helpers
    apps-web.js    Apps that wrap another CodeLove site (downloader, link in bio, video tools, JavaPlay)
    apps-games.js  One landscape, full-screen app per game on games.codelove.in

  Field guide
  ───────────
  id             URL slug (used in /apps/<id>)
  name           Display name
  tagline        One-line summary shown on the detail page hero
  category       One of the ids in src/data/categories.js (except "All")
  genre          Games only: shown on cards ("Kart racing")
  description    Short description for cards
  about          Longer description for the detail page (array of paragraphs)
  version        Current version string
  size           Package size label
  androidVersion Minimum Android version label
  updated        Last update label (month + year)
  platform       Platform label ("Android")
  apkUrl         Where the Download buttons point. Replace with your real APK URL.
  webAppUrl      Optional. A browser/desktop version of the app (shown as "Open web app" on the detail page).
  icon           Generated icon: a Lucide icon name + a gradient
  cover/gallery  Filled in automatically from src/data/assets.js (original cover + game art)
  iconImage      Optional real icon image (e.g. "/icons/videocut.png"). Overrides "icon".
  accent         Accent color used for card glows and screen mockups
  comingSoon     Set automatically for apps built in src/android-apps (true until public/downloads/<id>.apk exists).
                 For apps with their own APK (android.build: false) set it by hand. true = not released yet: download buttons become a "Coming soon"
                 label, rating/download counts are hidden and the app is excluded from
                 structured-data download links. Omit (or false) once the APK is live.
  features       Feature cards on the detail page
  releaseNotes   Version history shown under "Release notes"
  android        Optional. How the Android shell (src/android-apps) wraps this app:
                   url          Embed URL the app opens. Default: webAppUrl, else /<id>/app on this site.
                   orientation  "auto" (default) | "portrait" | "landscape" (games)
                   immersive    true = full screen, system bars hidden, screen kept on (games)
                   dark         true = dark splash / loading background
                   uaToken      Extra user-agent token the site uses to detect the app
                   embedCss     CSS injected into every page (hide the site footer, ads, …)
                   hosts        Extra hosts allowed to open inside the app (e.g. login pages)
                   shareTarget  true = app appears in Android's Share sheet / text-selection menu
                   shareParam   Shared links are opened as <url>?<shareParam>=<link> (else a "codelove:add" event)
                   build        false = the app has its own APK elsewhere; no shell is built for it
                   hub          true = the main CodeLove app (apps-hub.js): opens games/tools inside itself
  playUrl        Added here: where Play / Open goes inside the hub app.
*/

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const sizeLabel = (bytes) => (bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

// Adds the original artwork (scripts/sync-assets.mjs) and, for the apps built in src/android-apps,
// whether the APK is published (scripts/sync-downloads.mjs) with its real size and date.
function finish(app) {
  const art = assets[app.id] || {};
  const own = app.android?.build !== false; // built here, served from public/downloads
  const apk = own ? downloads[app.id] : null;
  const built = apk ? new Date(apk.built) : null;
  return {
    ...app,
    iconImage: art.icon || app.iconImage,
    cover: art.cover || "",
    tall: art.tall || "",
    gallery: [art.cover, art.wide].filter(Boolean),
    comingSoon: own ? !apk : Boolean(app.comingSoon),
    ...(apk && {
      size: sizeLabel(apk.bytes),
      sha256: apk.sha256,
      updated: `${MONTHS[built.getMonth()]} ${built.getFullYear()}`,
    }),
  };
}
export const apps = [...gameApps, ...webApps].map(finish).map((app) => ({ ...app, playUrl: playUrlFor(app) }));

// Where the app opens inside the CodeLove hub app (the Play / Open button there).
function playUrlFor(app) {
  if (app.android?.url) return app.android.url;
  if (app.category === "Games" && app.id !== "javaplay") return `https://games.codelove.in/${app.id}/play/`;
  return app.webAppUrl || "";
}

// The main CodeLove app (all games and tools in one APK). Not part of `apps`: see apps-hub.js.
export const hub = finish(hubApp);

// ── Helpers ────────────────────────────────────────────────────────────────

export function getAppById(id) {
  return apps.find((app) => app.id === id);
}


export function getRelatedApps(app, limit = 3) {
  const sameCategory = apps.filter((a) => a.id !== app.id && a.category === app.category);
  const others = apps.filter((a) => a.id !== app.id && a.category !== app.category);
  return [...sameCategory, ...others].slice(0, limit);
}
