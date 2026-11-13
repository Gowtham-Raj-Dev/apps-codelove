# Codelove Android apps

One Android project that builds **every app in `src/data/apps.js`** as its own APK.
Each app is a thin native shell (WebView) around a CodeLove web app or game, opened by its
embed URL, so the UI lives on the website and updates without shipping a new APK.

```
src/android-apps/
├─ build-app.ps1          ← build one app by id (see below)
├─ tools/sync-apps.mjs    ← apps.js → app/apps.json + per-app icons
├─ app/
│  ├─ apps.json           ← GENERATED list of apps (flavors)
│  ├─ build.gradle.kts    ← one product flavor per entry in apps.json
│  └─ src/
│     ├─ main/            ← shared shell: MainActivity, NativeBridge, offline page, theme
│     ├─ clipdropper/res/ ← GENERATED icon for ClipDropper
│     ├─ qrvault/res/     ← GENERATED icon for QR Vault
│     └─ …                ← one folder per app
├─ keystore/ + keystore.properties   ← release signing (git-ignored — BACK THESE UP)
└─ dist/                  ← built APKs land here
```

Next.js ignores this folder (it only builds `src/app`); ESLint and git ignore the Gradle output.
Open **this folder** (not the website root) in Android Studio.

## The apps

| App | Embed URL | Mode |
|---|---|---|
| ClipDropper | `apps.codelove.in/clipdropper/app` | portrait/auto, share target |
| Insta Downloader | `downloader.codelove.in/instagram/` | share a link from Instagram → opens as `?url=…` |
| Link in Bio | `linkinbio.codelove.in/dashboard/` | auto |
| VideoCut | `videocut.codelove.in/video-cutter/` | file picker + clips saved to Downloads |
| Video to GIF | `videotogif.codelove.in/` | file picker + GIFs saved to Downloads |
| 12 games (Turbo Karts, Skate Rush, …) | `games.codelove.in/<game>/play/` | **landscape, full screen**, one app per game |

JavaPlay, Kingdom Clash and Patti Veedu are listed on the website but have their own native
projects and APKs (`android: { build: false }`), so no shell is built for them.

## Per-app settings (`android` in apps.js)

```js
android: {
  url: "https://games.codelove.in/turbo-karts/play/", // embed URL (default: webAppUrl, else /<id>/app)
  orientation: "landscape",   // "auto" | "portrait" | "landscape" (sensor landscape, both ways up)
  immersive: true,            // hide status + navigation bars, keep the screen on, sound without a tap
  dark: true,                 // dark splash / loading background
  uaToken: "KingdomClashApp/1.0.0", // extra user-agent token the site looks for
  embedCss: "footer{display:none!important}", // CSS added to every page (hide footer, ads)
  hosts: ["accounts.example.com"],            // extra hosts allowed inside the app
  shareTarget: true,          // show the app in Android's Share sheet / text-selection menu
  shareParam: "url",          // shared links open as <url>?url=<link> instead of a "codelove:add" event
  build: false,               // app has its own APK elsewhere: skip it
}
```

Game apps are defined in `src/data/apps-games.js` (one `game({...})` call each, sharing
`GAME_ANDROID`); the site wrappers are in `src/data/apps-web.js`.
## Ads (AdMob)

Every app except Insta Downloader has Google AdMob built in (`AdsManager.kt`):

| App type | Formats |
|---|---|
| Tools (VideoCut, Video to GIF, Link in Bio) | adaptive banner under the page + app-open ad when you come back |
| Games | interstitial when the game calls `CodeloveNative.showAd()` at a break + app-open ad when you come back |

- Consent (GDPR etc.) is asked first with Google's UMP form.
- At most one full-screen ad every 3 minutes; app-open only after 30 s away.
- **Debug builds** always show Google's test ads.
- **Release builds show no ads until the app's real AdMob IDs are in `src/data/ads.js`.** So:
  add each app in AdMob → create its ad units → paste the IDs into `ads.js` → `.\build-app.ps1 <id> -Publish`.
- `public/app-ads.txt` (served at apps.codelove.in/app-ads.txt) lists the publisher ID.
- Insta Downloader has no ads on purpose: downloading other people's posts breaks Google's ad policies.

## Launcher icons

`tools/sync-apps.mjs` turns each app's original icon (`public/icons/<id>.png`, copied from its own
project by `scripts/sync-assets.mjs`) into the adaptive launcher icon and splash icon of that flavor.
## Build an app

```powershell
cd src\android-apps
.\build-app.ps1                      # lists the app ids
.\build-app.ps1 clipdropper          # signed release → dist\clipdropper-v1.2.0.apk
.\build-app.ps1 clipdropper -Publish # …and copy to public\downloads\clipdropper.apk (the site's download button)
.\build-app.ps1 clipdropper -Debug   # debug build
.\build-app.ps1 -All                 # every app
```

Under the hood: `node tools/sync-apps.mjs` then `gradlew assemble<Flavor>Release`.
Requirements: JDK 17 + Android SDK 36 (or Android Studio). Gradle 8.14 / AGP 8.11 / Kotlin 2.2.
`local.properties` (git-ignored) must point at your SDK: `sdk.dir=C:/Users/<you>/AppData/Local/Android/Sdk`.

## Add a new app

1. Add it to `src/data/apps.js` (id, name, version, icon, gradient — the usual fields).
2. Build its web app at `/<id>/app` on the website (or set `webAppUrl` to another path).
3. `.\build-app.ps1 <id>` — that's it. The script generates the flavor, package id
   `com.codelove.<id>`, app name, version, accent colours and a launcher/splash icon
   from the app's Lucide icon.

Per app, the flavor decides: `applicationId`, `app_name`, `brand`/`brand_light` colours,
`BuildConfig.APP_URL` / `APP_HOST` / `APP_ID`, the deep-link path, and the icon drawables.
To hand-draw an icon instead of the generated one, edit
`app/src/<flavor>/res/drawable/ic_launcher_foreground.xml` / `ic_splash.xml` and stop running
the sync for that app (or make the script skip it).

`versionCode` is derived from the version: `1.2.0` → `10200`. Bump the version in `apps.js`
before every release so Android accepts the update.

## What the native shell adds

| Feature | Where |
|---|---|
| Clipboard bridge (`window.CodeloveNative`) — copy / read clipboard / share / toast | `NativeBridge.kt` |
| **Share to \<app\>** from any app, for apps with `shareTarget` (text is handed to the web app) | `MainActivity.kt` → `codelove:add` event or `shareParam` |
| **Select text → "\<app\>"** in the text-selection toolbar (`ACTION_PROCESS_TEXT`) | same |
| Per-app orientation: games are locked to landscape | `AndroidManifest.xml` (`screenOrientation` placeholder) |
| Immersive full screen + screen kept on (games) | `MainActivity.kt` |
| Back button and pause/resume handed to the game (`window.__nativeBack`, `nativeapp` event) | `MainActivity.kt` |
| File picker for `<input type="file">` (video tools) | `MainActivity.kt` → `onShowFileChooser` |
| Downloads: `blob:` / `data:` / http files saved to the Downloads folder | page script in `MainActivity.kt` + `NativeBridge.kt` |
| Embed CSS: hides the site footer and ads inside the app | page script in `MainActivity.kt` |
| Offline screen with retry | `assets/offline.html` |
| Splash screen, edge-to-edge, keyboard-safe layout | `MainActivity.kt`, `themes.xml` |
| Deep link: opening the app's web URL on the phone lands in the app | `AndroidManifest.xml` (placeholders) |
| External links open in the browser; only the app's host stays in the WebView | `MainActivity.kt` |
| WebView localStorage backed up with the app | `res/xml/backup_rules.xml` |

## Web app contract

A web app detects the shell with `window.CodeloveNative` and may call:

```js
CodeloveNative.copy(text)        // → system clipboard
CodeloveNative.readClipboard()   // → string ("" when empty)
CodeloveNative.share(text)       // → Android share sheet
CodeloveNative.toast(message)
CodeloveNative.reload()          // used by the offline page
CodeloveNative.version()         // e.g. "1.2.0"
CodeloveNative.appId()           // e.g. "clipdropper"
CodeloveNative.appName()         // e.g. "ClipDropper"
CodeloveNative.download(url, name) // save an http(s) file with Android's download manager
```

and should listen for shared text:
`window.addEventListener("codelove:add", e => save(e.detail))`.
Reference implementation: `src/components/clipdropper/ClipDropperApp.jsx`.

## Signing

Release builds are signed automatically from `keystore.properties` + `keystore/codelove.jks`.
The key was created on 2026-11-12 (the earlier one was never used for a published APK).
Both are git-ignored — **back them up**; without the keystore you can never ship an update
to existing installs. Without those files `assembleRelease` produces an *unsigned* APK,
which Android refuses to install ("package appears to be invalid").

## Testing against localhost

Phones cannot reach your PC's `localhost`. Either deploy the site, or for the emulator
uncomment the two `buildConfigField` lines in the `debug` block of `app/build.gradle.kts`
(`http://10.0.2.2:3000/...`) and set `android:usesCleartextTraffic="true"` in the manifest.
For a real phone on the same Wi-Fi use your PC's LAN IP instead of `10.0.2.2`.
