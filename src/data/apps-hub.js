/*
  The main CodeLove app: one APK with every game and tool inside it.

  It is the same Android shell (src/android-apps) in "hub" mode (android.hub): it opens this
  store, and on the store every Download button becomes Play (games) or Open (tools), which
  runs the game or tool inside the hub instead of downloading its own APK.
   - Game play pages (games.codelove.in/<game>/play/) switch the hub to landscape, full screen,
     screen kept on; everything else is portrait/auto with the system bars shown.
   - Back: the game first (pause/close panels), then back through the pages, then exit.
  The store detects the hub by the "CodeloveHub" user-agent token (src/app/layout.jsx adds
  html.in-hub, and CSS swaps .hub-only / .hub-hide).
  It is not in the `apps` list (no card, no detail page): the home page has its own banner.
*/

// Hides the network footer and ad slots on every page inside the hub (same as the tool apps).
const EMBED_CSS = "footer,ins.adsbygoogle,.adsbygoogle,[data-ad-slot]{display:none!important}";

export const hubApp = {
  id: "codelove",
  name: "CodeLove",
  tagline: "Every CodeLove game and tool in one app",
  category: "Hub",
  description:
    "One app with all the CodeLove 3D games and tools inside. Pick a game and it plays right in the app, in landscape and full screen; open a tool and use it without installing anything else.",
  version: "1.0.0",
  size: "3 MB",
  androidVersion: "Android 8.0+",
  updated: "November 2026",
  platform: "Android",
  apkUrl: "/downloads/codelove.apk",
  webAppUrl: "https://apps.codelove.in/",
  android: {
    url: "https://apps.codelove.in/",
    hub: true,
    dark: true,
    // CodeloveHub: the store shows Play/Open. KingdomClashApp/: the games hide their browser-only buttons and take the back button.
    uaToken: "CodeloveHub/1.0 KingdomClashApp/1.0.0",
    embedCss: EMBED_CSS,
    hosts: [
      "games.codelove.in",
      "downloader.codelove.in",
      "linkinbio.codelove.in",
      "videocut.codelove.in",
      "videotogif.codelove.in",
      "javaplay.codelove.in",
    ],
  },
  icon: { name: "LayoutGrid", gradient: "linear-gradient(135deg, #3b82f6 0%, #16181f 100%)" },
  accent: "#3b82f6",
};
