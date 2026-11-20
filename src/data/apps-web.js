/*
  Apps that wrap another CodeLove site.

  Each one is the same Android shell (src/android-apps) opening the site's URL in "embed"
  mode: the site footer and ads are hidden (EMBED_CSS), file pickers and downloads go
  through Android, and links to other sites open in the browser.
  Field guide: see apps.js.
*/

// Hides what does not belong in an app: the network footer and ad slots.
const EMBED_CSS = "footer,ins.adsbygoogle,.adsbygoogle,[data-ad-slot]{display:none!important}";

const UPDATED = "November 2026";

export const webApps = [
  {
    id: "insta-downloader",
    name: "Insta Downloader",
    seoTitle: "Instagram Downloader App for Android — Free APK",
    heading: "Insta Downloader: Instagram Downloader App",
    searchAnswer: [
      {
        h: "An Instagram downloader app with Share to download",
        p: "Tap Share on a reel or post in Instagram and pick Insta Downloader: the link opens ready to save, and the video or photo goes to your Downloads folder. It also saves Pinterest videos and images, takes many links at once and never asks for your Instagram password.",
      },
    ],
    tagline: "Save Instagram and Pinterest videos and photos",
    category: "Media",
    description:
      "Paste or share a link and save Instagram reels, posts and Pinterest videos or images straight to your phone.",
    about: [
      "Insta Downloader by CodeLove saves reels, posts and Pinterest pins to your phone. Paste a link, or tap Share in Instagram and pick Insta Downloader — the link opens ready to download.",
      "Download one link or many at once, preview before you save, and find every file in your Downloads folder. No login is needed.",
    ],
    version: "1.0.0",
    size: "2 MB",
    androidVersion: "Android 8.0+",
    updated: UPDATED,
    platform: "Android",
    apkUrl: "/downloads/insta-downloader.apk",
    webAppUrl: "https://downloader.codelove.in/",
    android: {
      url: "https://downloader.codelove.in/instagram/",
      shareTarget: true,
      shareParam: "url",
      embedCss: EMBED_CSS,
    },
    icon: { name: "Download", gradient: "linear-gradient(135deg, #e1306c 0%, #f77737 100%)" },
    iconImage: "",
    accent: "#e1306c",
    features: [
      { icon: "Download", title: "Reels, posts & pins", text: "Instagram videos and photos, Pinterest videos and images." },
      { icon: "Zap", title: "Share to download", text: "Share a link from Instagram and it opens ready to save." },
      { icon: "Layers", title: "Many links at once", text: "Paste a list of links and download them together." },
      { icon: "FolderOpen", title: "Saved to Downloads", text: "Files land in your phone's Downloads folder." },
      { icon: "ShieldCheck", title: "No login", text: "You never enter your Instagram password." },
      { icon: "RefreshCw", title: "Always current", text: "The app updates itself with the website." },
    ],
    releaseNotes: [{ version: "1.0.0", date: UPDATED, notes: ["First Android release", "Share a link from Instagram to download it"] }],
  },
  {
    id: "link-in-bio",
    name: "Link in Bio",
    tagline: "One link for everything you share",
    category: "Productivity",
    description:
      "Build a free link-in-bio page, add your links and socials, pick a theme and track clicks from your phone.",
    about: [
      "Link in Bio by CodeLove gives you one page for all your links. Add links and social profiles, drag them into order, choose a theme and share a single URL in your bio.",
      "The app opens straight into your dashboard, so editing a link or checking today's clicks takes seconds.",
    ],
    version: "1.0.0",
    size: "2 MB",
    androidVersion: "Android 8.0+",
    updated: UPDATED,
    platform: "Android",
    apkUrl: "/downloads/link-in-bio.apk",
    webAppUrl: "https://linkinbio.codelove.in/",
    android: {
      url: "https://linkinbio.codelove.in/dashboard/",
      embedCss: EMBED_CSS,
    },
    icon: { name: "Link", gradient: "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)" },
    iconImage: "",
    accent: "#6366f1",
    features: [
      { icon: "Link", title: "Unlimited links", text: "Add, edit and reorder links by dragging." },
      { icon: "Palette", title: "Themes", text: "Pick a look that matches your brand." },
      { icon: "Sparkles", title: "Social icons", text: "Instagram, YouTube, WhatsApp and more in one row." },
      { icon: "Zap", title: "Click stats", text: "See which links people open." },
      { icon: "Smartphone", title: "Made for phones", text: "The whole dashboard works with one thumb." },
      { icon: "ShieldCheck", title: "Free", text: "No paid plan needed to publish your page." },
    ],
    releaseNotes: [{ version: "1.0.0", date: UPDATED, notes: ["First Android release"] }],
  },
  {
    id: "videocut",
    name: "VideoCut",
    seoTitle: "Video Cutter App for Android — Free APK",
    heading: "VideoCut: Video Cutter App",
    searchAnswer: [
      {
        h: "A free video cutter app for Shorts and parts",
        p: "VideoCut cuts a long video from your phone into vertical Shorts (up to 60 seconds) or equal parts, with a preview of every cut. Save the clips one by one or as a ZIP. The cutting happens on your phone, nothing is uploaded and there is no watermark.",
      },
    ],
    tagline: "Cut long videos into Shorts and parts",
    category: "Media",
    description:
      "Pick a video from your phone, cut it into Shorts or equal parts and save every clip — nothing is uploaded.",
    about: [
      "VideoCut Studio splits a long video into ready-to-post clips. Choose Shorts (vertical, up to 60 seconds) or equal parts, preview each cut and save them one by one or as a ZIP.",
      "All the cutting happens on your phone. Your video never leaves the device.",
    ],
    version: "1.0.0",
    size: "2 MB",
    androidVersion: "Android 8.0+",
    updated: UPDATED,
    platform: "Android",
    apkUrl: "/downloads/videocut.apk",
    webAppUrl: "https://videocut.codelove.in/",
    android: {
      url: "https://videocut.codelove.in/video-cutter/",
      embedCss: EMBED_CSS,
    },
    icon: { name: "Scissors", gradient: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)" },
    iconImage: "",
    accent: "#f43f5e",
    features: [
      { icon: "Scissors", title: "Shorts & parts", text: "Cut by Shorts length or into equal parts." },
      { icon: "ShieldCheck", title: "Stays on your phone", text: "Videos are cut on the device, never uploaded." },
      { icon: "FolderOpen", title: "Pick from gallery", text: "Open any video from your phone's files." },
      { icon: "Download", title: "Save clips or ZIP", text: "Every clip is saved to Downloads." },
      { icon: "Film", title: "Preview each cut", text: "Check a clip before you save it." },
      { icon: "Zap", title: "No watermark", text: "Clean clips, free." },
    ],
    releaseNotes: [{ version: "1.0.0", date: UPDATED, notes: ["First Android release", "Pick videos from the gallery, save clips to Downloads"] }],
  },
  {
    id: "video-to-gif",
    name: "Video to GIF",
    seoTitle: "Video to GIF App for Android — Free APK",
    heading: "Video to GIF App",
    searchAnswer: [
      {
        h: "How to download a video as a GIF on Android",
        p: "Install the free Video to GIF APK from this page, open it and pick a video from your gallery. Trim the part you want, crop it, choose the size, frame rate and speed, then save: the GIF goes to your Downloads folder, ready to share on WhatsApp or Instagram. The conversion runs on your phone, so the video is not uploaded.",
      },
    ],
    tagline: "Turn any video into a GIF",
    category: "Creative",
    description:
      "Convert videos to GIFs on your phone: trim, crop, set size and speed, then save or share the GIF.",
    about: [
      "Video to GIF by CodeLove converts a clip from your gallery into a GIF. Trim the part you want, crop it, choose the size, frame rate and speed, and save the result.",
      "It also includes the site's other tools — GIF to video, compress, resize and more — and everything runs on your phone.",
    ],
    version: "1.0.0",
    size: "2 MB",
    androidVersion: "Android 8.0+",
    updated: UPDATED,
    platform: "Android",
    apkUrl: "/downloads/video-to-gif.apk",
    webAppUrl: "https://videotogif.codelove.in/",
    android: {
      url: "https://videotogif.codelove.in/",
      embedCss: EMBED_CSS,
    },
    icon: { name: "Clapperboard", gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" },
    iconImage: "",
    accent: "#8b5cf6",
    features: [
      { icon: "Clapperboard", title: "Video to GIF", text: "Any clip from your gallery becomes a GIF." },
      { icon: "Scissors", title: "Trim & crop", text: "Keep only the moment you want." },
      { icon: "Layers", title: "Size, FPS & speed", text: "Control quality and file size." },
      { icon: "Wrench", title: "More tools", text: "GIF to video, compress, resize and others." },
      { icon: "ShieldCheck", title: "Stays on your phone", text: "Files are converted on the device." },
      { icon: "Download", title: "Save to Downloads", text: "GIFs are saved ready to share." },
    ],
    releaseNotes: [{ version: "1.0.0", date: UPDATED, notes: ["First Android release", "Pick videos from the gallery, save GIFs to Downloads"] }],
  },
  {
    id: "javaplay",
    name: "JavaPlay",
    seoTitle: "Java Game Emulator APK — JavaPlay for Android",
    heading: "JavaPlay: Java Game Emulator",
    searchAnswer: [
      {
        h: "A Java game emulator APK for old keypad-phone games",
        p: "JavaPlay is a free J2ME emulator APK for Android. Open any .jar game from your phone's storage or pick one of the 160+ free, open-licence games in the catalogue, then play with the on-screen keypad. The whole app is about 245 KB and plays offline.",
      },
    ],
    tagline: "Play classic Java (J2ME) phone games",
    category: "Games",
    description:
      "A Java game emulator for Android: run .jar keypad-phone games, with 160+ free games built in.",
    about: [
      "JavaPlay runs the Java (J2ME) games from keypad phones on your Android phone. Open a .jar file or pick one of the 160+ free, open-licence games in the catalogue.",
      "It has an on-screen keypad, landscape play, saved games and a built-in browser for finding more games. The engine is CodeLove's own and also runs at javaplay.codelove.in.",
    ],
    version: "2.6.6",
    size: "245 KB",
    androidVersion: "Android 5.0+",
    updated: "October 2026",
    platform: "Android",
    // JavaPlay is a full native app with its own project (java-game-emu) and APK.
    apkUrl: "https://javaplay.codelove.in/download/JavaPlay.apk",
    webAppUrl: "https://javaplay.codelove.in/",
    android: { build: false },
    icon: { name: "Gamepad2", gradient: "linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)" },
    iconImage: "",
    accent: "#0ea5e9",
    features: [
      { icon: "Gamepad2", title: "Runs .jar games", text: "Open Java games from your phone's storage." },
      { icon: "LayoutGrid", title: "160+ free games", text: "A catalogue of open-licence games, one tap to play." },
      { icon: "Smartphone", title: "On-screen keypad", text: "The classic phone keys, sized for touch." },
      { icon: "WifiOff", title: "Plays offline", text: "The engine is inside the app." },
      { icon: "Feather", title: "Tiny download", text: "The whole app is about 245 KB." },
      { icon: "RefreshCw", title: "In-app updates", text: "The app tells you when a new version is out." },
    ],
    releaseNotes: [
      { version: "2.6.6", date: "October 2026", notes: ["The home screen looks the same after every game"] },
      { version: "2.6.0", date: "October 2026", notes: ["Built-in browser for finding more Java games"] },
    ],
  },
];
