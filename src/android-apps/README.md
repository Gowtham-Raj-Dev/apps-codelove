# Codelove Android apps

One Android project that builds **every app in `src/data/apps.js`** as its own APK.
Each app is a thin native shell (WebView) around its web app on `apps.codelove.in`,
so the UI lives on the website and updates without shipping a new APK.

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
| **Share to \<app\>** from any app (text is handed to the web app) | `MainActivity.kt` → `codelove:add` event |
| **Select text → "\<app\>"** in the text-selection toolbar (`ACTION_PROCESS_TEXT`) | same |
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
```

and should listen for shared text:
`window.addEventListener("codelove:add", e => save(e.detail))`.
Reference implementation: `src/components/clipdropper/ClipDropperApp.jsx`.

## Signing

Release builds are signed automatically from `keystore.properties` + `keystore/codelove.jks`.
Both are git-ignored — **back them up**; without the keystore you can never ship an update
to existing installs. Without those files `assembleRelease` produces an *unsigned* APK,
which Android refuses to install ("package appears to be invalid").

## Testing against localhost

Phones cannot reach your PC's `localhost`. Either deploy the site, or for the emulator
uncomment the two `buildConfigField` lines in the `debug` block of `app/build.gradle.kts`
(`http://10.0.2.2:3000/...`) and set `android:usesCleartextTraffic="true"` in the manifest.
For a real phone on the same Wi-Fi use your PC's LAN IP instead of `10.0.2.2`.
