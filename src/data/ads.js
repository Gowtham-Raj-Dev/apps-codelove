/*
  AdMob (mobile ads) for the Android apps.

  How to go live with ads
  ───────────────────────
  1. In AdMob (admob.google.com): Apps → Add app → Android → "not listed on a store" → name it
     like the app below. AdMob gives an App ID ("ca-app-pub-…~…").
  2. In that app: Ad units → create the formats listed for it below (Banner / Interstitial /
     App open). Each gives an ad unit ID ("ca-app-pub-…/…").
  3. Paste the IDs here, then rebuild + publish:  cd src\android-apps;  .\build-app.ps1 <id> -Publish
  4. public/app-ads.txt must be live on apps.codelove.in (it is, once the site is deployed).

  Until an app has its App ID here, its release APK shows NO ads (so nobody sees test ads).
  Debug builds always show Google's test ads, so the placement can be checked on a phone.

  Formats used
  - Games:  interstitial (when the game calls CodeloveNative.showAd() at a break) + app open
            (when you come back to the game after a while). No banner: it would cover the controls.
  - Tools:  adaptive banner at the bottom + app open.
*/

export const admob = {
  // Your AdMob publisher ID (same Google account as AdSense). Used for public/app-ads.txt.
  publisherId: "pub-1282068947061740",

  apps: {
    // The main CodeLove app (all games + tools). No banner: it would cover the game controls.
    codelove: { appId: "", interstitial: "", appOpen: "" },

    "link-in-bio": { appId: "", banner: "", appOpen: "" },
    videocut: { appId: "", banner: "", appOpen: "" },
    "video-to-gif": { appId: "", banner: "", appOpen: "" },

    "turbo-karts": { appId: "", interstitial: "", appOpen: "" },
    "skate-rush": { appId: "", interstitial: "", appOpen: "" },
    "sky-hop": { appId: "", interstitial: "", appOpen: "" },
    "crypt-knight": { appId: "", interstitial: "", appOpen: "" },
    "cannon-cove": { appId: "", interstitial: "", appOpen: "" },
    "saucer-siege": { appId: "", interstitial: "", appOpen: "" },
    "siege-smash": { appId: "", interstitial: "", appOpen: "" },
    "putt-paradise": { appId: "", interstitial: "", appOpen: "" },
    "hex-haven": { appId: "", interstitial: "", appOpen: "" },
    "order-up": { appId: "", interstitial: "", appOpen: "" },
    "beat-street": { appId: "", interstitial: "", appOpen: "" },
  },

  // No ads on purpose:
  //  insta-downloader — downloading other people's posts breaks Google's ad policies
  //  (the same reason AdSense is off on downloader.codelove.in); ads there could get the
  //  whole account suspended.
};
