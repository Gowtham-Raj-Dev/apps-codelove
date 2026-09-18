/*
  App catalogue.

  This is dummy data — replace it with your real apps.
  Every UI element on the site reads from this array, so you only edit here.

  Field guide
  ───────────
  id             URL slug (used in /apps/<id>)
  name           Display name
  tagline        One-line summary shown on the detail page hero
  category       One of the ids in src/data/categories.js (except "All")
  description    Short description for cards
  about          Longer description for the detail page (array of paragraphs)
  version        Current version string
  rating         Average rating (string, e.g. "4.8")
  downloads      Download count label (string, e.g. "10K+")
  size           Package size label
  androidVersion Minimum Android version label
  updated        Last update label (month + year)
  platform       Platform label ("Android")
  apkUrl         Where the Download buttons point. Replace with your real APK URL.
  webAppUrl      Optional. A browser/desktop version of the app (shown as "Open web app" on the detail page).
  icon           Generated icon: a Lucide icon name + a gradient
  iconImage      Optional real icon image (e.g. "/icons/clipdropper.png"). Overrides "icon".
  accent         Accent color used for card glows and screen mockups
  featured       Shown in the "Featured apps" section on the home page (first 3)
  isNewRelease   Shown in the "Fresh from the studio" section (first match)
  comingSoon     Optional. true = not released yet: download buttons become a "Coming soon"
                 label, rating/download counts are hidden and the app is excluded from
                 structured-data download links. Omit (or false) once the APK is live.
  features       Feature cards on the detail page
  screens        Mock screenshots (rendered with CSS). Replace with "screenshots" when you have real ones.
  screenshots    Optional real screenshots — URL strings or { src, label }. Overrides "screens".
  releaseNotes   Version history shown under "Release notes"
*/

export const apps = [
  {
    id: "clipdropper",
    name: "ClipDropper",
    tagline: "Smart clipboard management for Android",
    category: "Productivity",
    description:
      "Save, organize and manage your copied content with a simple clipboard experience.",
    about: [
      "ClipDropper quietly keeps everything you copy — links, snippets, addresses, one-time codes — and turns it into a searchable, organised history you can actually use.",
      "Pin the clips you reach for every day, group related items into collections and paste anything back with a single tap. Everything stays on your device, nothing is uploaded, and the app is light enough to forget it is running.",
    ],
    version: "1.2.0",
    rating: "4.8",
    downloads: "10K+",
    size: "18 MB",
    androidVersion: "Android 8.0+",
    updated: "September 2026",
    platform: "Android",
    apkUrl: "/downloads/clipdropper.apk",
    webAppUrl: "/clipdropper/app",
    icon: { name: "ClipboardList", gradient: "linear-gradient(135deg, #7c6cff 0%, #b18cff 100%)" },
    iconImage: "",
    accent: "#7c6cff",
    featured: true,
    isNewRelease: true,
    features: [
      { icon: "Zap", title: "Fast & lightweight", text: "Starts instantly and uses almost no battery in the background." },
      { icon: "Feather", title: "Simple interface", text: "One list, one search bar, and the clip you need at the top." },
      { icon: "ShieldCheck", title: "Privacy focused", text: "Clips never leave your phone. No accounts, no sync servers." },
      { icon: "WifiOff", title: "Offline support", text: "Works fully offline — it never needs a connection." },
      { icon: "Layers", title: "No unnecessary complexity", text: "Pin, group and search. Nothing you have to learn." },
      { icon: "RefreshCw", title: "Regular updates", text: "Small, frequent improvements based on real feedback." },
    ],
    screens: [
      {
        title: "Clipboard",
        layout: "list",
        items: [
          { label: "https://codelove.in/launch", meta: "Just now" },
          { label: "Meeting room B, 3rd floor", meta: "12 min ago" },
          { label: "Verification code 482 913", meta: "1 hr ago" },
          { label: "Order #CL-20931", meta: "Yesterday" },
          { label: "Design review notes", meta: "Yesterday" },
        ],
      },
      {
        title: "Collections",
        layout: "grid",
        items: [
          { label: "Work", meta: "24 clips" },
          { label: "Links", meta: "58 clips" },
          { label: "Addresses", meta: "6 clips" },
          { label: "Snippets", meta: "31 clips" },
        ],
      },
      {
        title: "Overview",
        layout: "stats",
        items: [
          { label: "Saved today", meta: "18" },
          { label: "Pinned", meta: "7" },
          { label: "Collections", meta: "4" },
        ],
      },
      {
        title: "Settings",
        layout: "settings",
        items: [
          { label: "Capture in background", meta: "On" },
          { label: "Keep history for", meta: "30 days" },
          { label: "Ignore passwords", meta: "On" },
          { label: "Quick paste bubble", meta: "Off" },
        ],
      },
    ],
    screenshots: [
      { src: "/screenshots/clipdropper-1.png", label: "All clips" },
      { src: "/screenshots/clipdropper-2.png", label: "Pinned" },
      { src: "/screenshots/clipdropper-3.png", label: "Browse" },
      { src: "/screenshots/clipdropper-4.png", label: "New clip" },
    ],
    releaseNotes: [
      { version: "1.2.0", date: "September 2026", notes: ["New collections view for grouping clips", "Quick paste bubble (optional)", "Faster search on long histories"] },
      { version: "1.1.0", date: "July 2026", notes: ["Pin important clips to the top", "Improved battery usage in the background"] },
      { version: "1.0.0", date: "May 2026", notes: ["First public release"] },
    ],
  },
  {
    id: "snaptools",
    name: "SnapTools",
    tagline: "Everyday tools in one lightweight app",
    category: "Utilities",
    description:
      "A collection of lightweight tools designed to make everyday mobile tasks faster.",
    about: [
      "SnapTools bundles the small utilities you keep searching for — a unit converter, a ruler, a level, a colour picker, a text counter and more — into one tidy app with no ads and no clutter.",
      "Each tool opens in a single tap from the home grid and remembers your last input, so quick jobs stay quick.",
    ],
    version: "1.4.1",
    rating: "4.7",
    downloads: "8K+",
    size: "22 MB",
    androidVersion: "Android 8.0+",
    updated: "August 2026",
    platform: "Android",
    comingSoon: true,
    apkUrl: "/downloads/snaptools.apk",
    icon: { name: "Wrench", gradient: "linear-gradient(135deg, #22c1c3 0%, #6ee7b7 100%)" },
    iconImage: "",
    accent: "#22c1c3",
    featured: true,
    isNewRelease: false,
    features: [
      { icon: "Zap", title: "Fast & lightweight", text: "Every tool loads instantly from a single home grid." },
      { icon: "Feather", title: "Simple interface", text: "Big controls, clear labels, nothing hidden in menus." },
      { icon: "ShieldCheck", title: "Privacy focused", text: "No accounts, no tracking, no permissions you do not need." },
      { icon: "WifiOff", title: "Offline support", text: "All 12 tools work without a connection." },
      { icon: "Layers", title: "No unnecessary complexity", text: "Just the tools people actually use, done well." },
      { icon: "RefreshCw", title: "Regular updates", text: "New tools arrive every few months." },
    ],
    screens: [
      {
        title: "Tools",
        layout: "grid",
        items: [
          { label: "Converter", meta: "Units" },
          { label: "Ruler", meta: "cm / in" },
          { label: "Level", meta: "Bubble" },
          { label: "Counter", meta: "Words" },
          { label: "Colour", meta: "Picker" },
          { label: "Timer", meta: "Stopwatch" },
        ],
      },
      {
        title: "Converter",
        layout: "stats",
        items: [
          { label: "Kilometres", meta: "12.5" },
          { label: "Miles", meta: "7.77" },
          { label: "Metres", meta: "12,500" },
        ],
      },
      {
        title: "Recent",
        layout: "list",
        items: [
          { label: "Converted 12.5 km → mi", meta: "Today" },
          { label: "Measured 21.3 cm", meta: "Today" },
          { label: "Picked #7C6CFF", meta: "Yesterday" },
          { label: "Counted 482 words", meta: "Mon" },
        ],
      },
    ],
    screenshots: [],
    releaseNotes: [
      { version: "1.4.1", date: "August 2026", notes: ["Fixed ruler calibration on tablets", "Minor UI polish"] },
      { version: "1.4.0", date: "July 2026", notes: ["New colour picker tool", "Converter remembers last units"] },
    ],
  },
  {
    id: "frameflow",
    name: "FrameFlow",
    tagline: "A clean mobile workflow for your visual content",
    category: "Media",
    description:
      "Create, organize and transform your visual content with a clean mobile workflow.",
    about: [
      "FrameFlow is a focused media organiser for people who shoot a lot. Sort photos and clips into projects, trim and crop on the spot, and export in the right size for wherever it is going.",
      "Version 2.0 rebuilds the editor from scratch: smoother scrubbing, batch exports and a new presets system so a whole project gets the same look in one tap.",
    ],
    version: "2.0.0",
    rating: "4.9",
    downloads: "15K+",
    size: "34 MB",
    androidVersion: "Android 9.0+",
    updated: "September 2026",
    platform: "Android",
    comingSoon: true,
    apkUrl: "/downloads/frameflow.apk",
    icon: { name: "Film", gradient: "linear-gradient(135deg, #ff6b9a 0%, #ffa07a 100%)" },
    iconImage: "",
    accent: "#ff6b9a",
    featured: true,
    isNewRelease: false,
    features: [
      { icon: "Zap", title: "Fast & lightweight", text: "Hardware-accelerated previews even on older phones." },
      { icon: "Feather", title: "Simple interface", text: "Projects, a timeline and an export button. That is it." },
      { icon: "ShieldCheck", title: "Privacy focused", text: "Your media stays in your gallery — no cloud upload." },
      { icon: "WifiOff", title: "Offline support", text: "Edit and export anywhere, no connection required." },
      { icon: "Layers", title: "No unnecessary complexity", text: "Presets replace dozens of fiddly sliders." },
      { icon: "RefreshCw", title: "Regular updates", text: "2.0 is the biggest update yet, with more on the way." },
    ],
    screens: [
      {
        title: "Projects",
        layout: "grid",
        items: [
          { label: "Weekend trip", meta: "48 items" },
          { label: "Product shots", meta: "112 items" },
          { label: "Portfolio", meta: "23 items" },
          { label: "Reels", meta: "9 clips" },
        ],
      },
      {
        title: "Editor",
        layout: "hero",
        items: [
          { label: "Warm film", meta: "Preset" },
          { label: "Trim 0:04 – 0:19", meta: "Timeline" },
          { label: "Crop 4:5", meta: "Portrait" },
          { label: "Soundtrack", meta: "Soft keys" },
          { label: "Export 1080p", meta: "Ready" },
        ],
      },
      {
        title: "Library",
        layout: "list",
        items: [
          { label: "IMG_2041.jpg", meta: "4.2 MB" },
          { label: "Clip_0312.mp4", meta: "0:14" },
          { label: "IMG_2044.jpg", meta: "3.9 MB" },
          { label: "Clip_0315.mp4", meta: "0:27" },
          { label: "IMG_2050.jpg", meta: "4.6 MB" },
        ],
      },
      {
        title: "Export",
        layout: "settings",
        items: [
          { label: "Resolution", meta: "1080p" },
          { label: "Format", meta: "MP4" },
          { label: "Keep metadata", meta: "Off" },
          { label: "Batch export", meta: "On" },
        ],
      },
    ],
    screenshots: [],
    releaseNotes: [
      { version: "2.0.0", date: "September 2026", notes: ["Brand-new editor with smoother scrubbing", "Presets: apply one look to a whole project", "Batch export", "Redesigned project grid"] },
      { version: "1.6.2", date: "June 2026", notes: ["Stability fixes for large libraries"] },
    ],
  },
  {
    id: "notenest",
    name: "NoteNest",
    tagline: "Quick notes that stay out of your way",
    category: "Productivity",
    description:
      "Capture thoughts instantly and keep them organised with folders, tags and a calm interface.",
    about: [
      "NoteNest is for the notes you take in the moment — a thought, a list, a number someone just told you. Open the app and start typing; sorting can wait.",
      "When you do want structure, folders and tags are a swipe away, and full-text search finds anything in a blink.",
    ],
    version: "1.0.3",
    rating: "4.6",
    downloads: "6K+",
    size: "16 MB",
    androidVersion: "Android 8.0+",
    updated: "July 2026",
    platform: "Android",
    comingSoon: true,
    apkUrl: "/downloads/notenest.apk",
    icon: { name: "NotebookPen", gradient: "linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)" },
    iconImage: "",
    accent: "#f59e0b",
    featured: false,
    isNewRelease: false,
    features: [
      { icon: "Zap", title: "Fast & lightweight", text: "Opens straight into a new note." },
      { icon: "Feather", title: "Simple interface", text: "Plain text first, formatting when you want it." },
      { icon: "ShieldCheck", title: "Privacy focused", text: "Notes are stored locally, optionally encrypted." },
      { icon: "WifiOff", title: "Offline support", text: "Everything works without a connection." },
      { icon: "Layers", title: "No unnecessary complexity", text: "Folders and tags — no databases to configure." },
      { icon: "RefreshCw", title: "Regular updates", text: "Steady, careful improvements." },
    ],
    screens: [
      {
        title: "Notes",
        layout: "list",
        items: [
          { label: "Ideas for the garden", meta: "Today" },
          { label: "Grocery list", meta: "Today" },
          { label: "Book recommendations", meta: "Tue" },
          { label: "Call plumber — 9am", meta: "Mon" },
          { label: "Trip packing list", meta: "Last week" },
        ],
      },
      {
        title: "Folders",
        layout: "grid",
        items: [
          { label: "Personal", meta: "42 notes" },
          { label: "Work", meta: "18 notes" },
          { label: "Reading", meta: "11 notes" },
          { label: "Archive", meta: "97 notes" },
        ],
      },
      {
        title: "Settings",
        layout: "settings",
        items: [
          { label: "Open in new note", meta: "On" },
          { label: "Encrypt notes", meta: "Off" },
          { label: "Font size", meta: "Medium" },
        ],
      },
    ],
    screenshots: [],
    releaseNotes: [
      { version: "1.0.3", date: "July 2026", notes: ["Faster search", "Fixed tag colours on some devices"] },
      { version: "1.0.0", date: "April 2026", notes: ["First public release"] },
    ],
  },
  {
    id: "qr-vault",
    name: "QR Vault",
    tagline: "Scan, create and keep your QR codes",
    category: "Tools",
    description:
      "A fast QR and barcode scanner that also generates codes and keeps a private history.",
    about: [
      "QR Vault scans any QR or barcode the instant it enters the frame, then keeps a tidy history so you can find that Wi-Fi code or ticket again later.",
      "It also generates codes for links, contacts, Wi-Fi networks and plain text — with clean, shareable images.",
    ],
    version: "1.5.0",
    rating: "4.7",
    downloads: "12K+",
    size: "12 MB",
    androidVersion: "Android 7.0+",
    updated: "August 2026",
    platform: "Android",
    comingSoon: true,
    apkUrl: "/downloads/qr-vault.apk",
    icon: { name: "QrCode", gradient: "linear-gradient(135deg, #0ea5e9 0%, #67e8f9 100%)" },
    iconImage: "",
    accent: "#0ea5e9",
    featured: false,
    isNewRelease: false,
    features: [
      { icon: "Zap", title: "Fast & lightweight", text: "Scans in under a second, even in low light." },
      { icon: "Feather", title: "Simple interface", text: "Point, scan, done." },
      { icon: "ShieldCheck", title: "Privacy focused", text: "History stays on the device — nothing is sent anywhere." },
      { icon: "WifiOff", title: "Offline support", text: "Scanning and generating work fully offline." },
      { icon: "Layers", title: "No unnecessary complexity", text: "No sign-ups, no ads, no upsells." },
      { icon: "RefreshCw", title: "Regular updates", text: "New code formats added regularly." },
    ],
    screens: [
      {
        title: "Scan",
        layout: "scan",
        items: [{ label: "Align the code inside the frame", meta: "" }],
      },
      {
        title: "History",
        layout: "list",
        items: [
          { label: "Wi-Fi: Studio_5G", meta: "Today" },
          { label: "https://codelove.in", meta: "Today" },
          { label: "Concert ticket #A-2231", meta: "Sat" },
          { label: "Contact: Priya S.", meta: "Fri" },
        ],
      },
      {
        title: "Create",
        layout: "grid",
        items: [
          { label: "Link", meta: "URL" },
          { label: "Wi-Fi", meta: "Network" },
          { label: "Contact", meta: "vCard" },
          { label: "Text", meta: "Plain" },
        ],
      },
    ],
    screenshots: [],
    releaseNotes: [
      { version: "1.5.0", date: "August 2026", notes: ["Generate Wi-Fi QR codes", "History search"] },
      { version: "1.4.0", date: "May 2026", notes: ["Low-light scanning improvements"] },
    ],
  },
  {
    id: "imageswift",
    name: "ImageSwift",
    tagline: "Resize, compress and convert images in seconds",
    category: "Creative",
    description:
      "Batch-resize, compress and convert images with presets built for the web and social.",
    about: [
      "ImageSwift takes the busywork out of preparing images. Pick a preset — web, story, thumbnail, print — and it resizes, compresses and converts a whole batch at once.",
      "Fine controls are there when you need them, but most of the time one tap is enough.",
    ],
    version: "1.1.0",
    rating: "4.8",
    downloads: "9K+",
    size: "27 MB",
    androidVersion: "Android 9.0+",
    updated: "June 2026",
    platform: "Android",
    comingSoon: true,
    apkUrl: "/downloads/imageswift.apk",
    icon: { name: "ImageIcon", gradient: "linear-gradient(135deg, #a855f7 0%, #f472b6 100%)" },
    iconImage: "",
    accent: "#a855f7",
    featured: false,
    isNewRelease: false,
    features: [
      { icon: "Zap", title: "Fast & lightweight", text: "Processes dozens of images in seconds." },
      { icon: "Feather", title: "Simple interface", text: "Presets first, sliders second." },
      { icon: "ShieldCheck", title: "Privacy focused", text: "Images are processed on your phone, never uploaded." },
      { icon: "WifiOff", title: "Offline support", text: "Works anywhere, no connection needed." },
      { icon: "Layers", title: "No unnecessary complexity", text: "Only the options that change the result." },
      { icon: "RefreshCw", title: "Regular updates", text: "New presets and formats over time." },
    ],
    screens: [
      {
        title: "Presets",
        layout: "grid",
        items: [
          { label: "Web", meta: "1600px" },
          { label: "Story", meta: "1080×1920" },
          { label: "Thumbnail", meta: "400px" },
          { label: "Print", meta: "300 dpi" },
        ],
      },
      {
        title: "Batch",
        layout: "list",
        items: [
          { label: "hero-shot.jpg", meta: "4.1 → 0.4 MB" },
          { label: "product-01.png", meta: "2.8 → 0.3 MB" },
          { label: "product-02.png", meta: "2.6 → 0.3 MB" },
          { label: "banner.jpg", meta: "5.2 → 0.6 MB" },
        ],
      },
      {
        title: "Result",
        layout: "stats",
        items: [
          { label: "Images", meta: "24" },
          { label: "Saved", meta: "71 MB" },
          { label: "Time", meta: "6 s" },
        ],
      },
    ],
    screenshots: [],
    releaseNotes: [
      { version: "1.1.0", date: "June 2026", notes: ["WebP export", "New Story preset"] },
      { version: "1.0.0", date: "March 2026", notes: ["First public release"] },
    ],
  },
  {
    id: "filepocket",
    name: "FilePocket",
    tagline: "A calm file manager for your phone",
    category: "Utilities",
    description:
      "Browse, sort and clean up your files with a fast, clutter-free file manager.",
    about: [
      "FilePocket shows you what is on your phone without the noise. Recent files up top, big folders clearly marked, and a one-tap cleaner for downloads and caches.",
      "It is deliberately small — no cloud drive, no media player, just a really good file browser.",
    ],
    version: "1.0.8",
    rating: "4.5",
    downloads: "5K+",
    size: "20 MB",
    androidVersion: "Android 8.0+",
    updated: "May 2026",
    platform: "Android",
    comingSoon: true,
    apkUrl: "/downloads/filepocket.apk",
    icon: { name: "FolderOpen", gradient: "linear-gradient(135deg, #64748b 0%, #94a3b8 100%)" },
    iconImage: "",
    accent: "#64748b",
    featured: false,
    isNewRelease: false,
    features: [
      { icon: "Zap", title: "Fast & lightweight", text: "Indexes large folders without stutter." },
      { icon: "Feather", title: "Simple interface", text: "Folders, files, sizes. Clearly laid out." },
      { icon: "ShieldCheck", title: "Privacy focused", text: "No network permission at all." },
      { icon: "WifiOff", title: "Offline support", text: "By design — it never goes online." },
      { icon: "Layers", title: "No unnecessary complexity", text: "A file manager, not a media suite." },
      { icon: "RefreshCw", title: "Regular updates", text: "Compatibility updates for new Android versions." },
    ],
    screens: [
      {
        title: "Files",
        layout: "list",
        items: [
          { label: "Downloads", meta: "1.2 GB" },
          { label: "Documents", meta: "340 MB" },
          { label: "Camera", meta: "8.4 GB" },
          { label: "Music", meta: "2.1 GB" },
          { label: "Screenshots", meta: "612 MB" },
        ],
      },
      {
        title: "Storage",
        layout: "stats",
        items: [
          { label: "Used", meta: "48 GB" },
          { label: "Free", meta: "80 GB" },
          { label: "Cleanable", meta: "3.4 GB" },
        ],
      },
      {
        title: "Settings",
        layout: "settings",
        items: [
          { label: "Show hidden files", meta: "Off" },
          { label: "Sort by", meta: "Size" },
          { label: "Confirm deletes", meta: "On" },
        ],
      },
    ],
    screenshots: [],
    releaseNotes: [
      { version: "1.0.8", date: "May 2026", notes: ["Android 16 compatibility", "Faster folder size calculation"] },
    ],
  },
  {
    id: "quickscan",
    name: "QuickScan",
    tagline: "Turn paper into clean PDFs",
    category: "Tools",
    description:
      "Scan documents with automatic edge detection and export crisp, searchable PDFs.",
    about: [
      "QuickScan finds the page, straightens it and cleans up the lighting before you have even tapped the shutter. Multi-page scans become one PDF, ready to share.",
      "Optional on-device text recognition makes your scans searchable without sending them anywhere.",
    ],
    version: "1.3.2",
    rating: "4.7",
    downloads: "11K+",
    size: "15 MB",
    androidVersion: "Android 8.0+",
    updated: "July 2026",
    platform: "Android",
    comingSoon: true,
    apkUrl: "/downloads/quickscan.apk",
    icon: { name: "ScanLine", gradient: "linear-gradient(135deg, #10b981 0%, #5eead4 100%)" },
    iconImage: "",
    accent: "#10b981",
    featured: false,
    isNewRelease: false,
    features: [
      { icon: "Zap", title: "Fast & lightweight", text: "Edge detection runs in real time." },
      { icon: "Feather", title: "Simple interface", text: "Shutter, pages, share. Nothing else in the way." },
      { icon: "ShieldCheck", title: "Privacy focused", text: "Text recognition happens on the device." },
      { icon: "WifiOff", title: "Offline support", text: "Scan and export with no connection." },
      { icon: "Layers", title: "No unnecessary complexity", text: "Sensible defaults, quick overrides." },
      { icon: "RefreshCw", title: "Regular updates", text: "Better recognition with every release." },
    ],
    screens: [
      {
        title: "Scan",
        layout: "scan",
        items: [{ label: "Hold steady — page detected", meta: "" }],
      },
      {
        title: "Documents",
        layout: "list",
        items: [
          { label: "Lease agreement.pdf", meta: "6 pages" },
          { label: "Receipt — cafe.pdf", meta: "1 page" },
          { label: "Whiteboard notes.pdf", meta: "3 pages" },
          { label: "ID copy.pdf", meta: "2 pages" },
        ],
      },
      {
        title: "Export",
        layout: "settings",
        items: [
          { label: "Format", meta: "PDF" },
          { label: "Recognise text", meta: "On" },
          { label: "Quality", meta: "High" },
        ],
      },
    ],
    screenshots: [],
    releaseNotes: [
      { version: "1.3.2", date: "July 2026", notes: ["Improved edge detection on dark tables", "Fixed rotation on some devices"] },
    ],
  },
  {
    id: "dailyloop",
    name: "DailyLoop",
    tagline: "Gentle habit tracking, one loop at a time",
    category: "Lifestyle",
    description:
      "Track small daily habits with a calm, streak-friendly design that never nags.",
    about: [
      "DailyLoop helps you keep the small promises you make to yourself — a walk, a glass of water, ten minutes of reading — with one satisfying tap per day.",
      "There are no guilt-trip notifications and no social feeds. Just your loops, your streaks and a quiet monthly view.",
    ],
    version: "1.0.1",
    rating: "4.6",
    downloads: "4K+",
    size: "14 MB",
    androidVersion: "Android 8.0+",
    updated: "August 2026",
    platform: "Android",
    comingSoon: true,
    apkUrl: "/downloads/dailyloop.apk",
    icon: { name: "Repeat", gradient: "linear-gradient(135deg, #fb7185 0%, #fdba74 100%)" },
    iconImage: "",
    accent: "#fb7185",
    featured: false,
    isNewRelease: false,
    features: [
      { icon: "Zap", title: "Fast & lightweight", text: "Check off a habit in one tap from the home screen." },
      { icon: "Feather", title: "Simple interface", text: "A short list and a calendar. That is the whole app." },
      { icon: "ShieldCheck", title: "Privacy focused", text: "Your habits are nobody's business — stored locally." },
      { icon: "WifiOff", title: "Offline support", text: "Fully offline, always." },
      { icon: "Layers", title: "No unnecessary complexity", text: "No points, no leagues, no pressure." },
      { icon: "RefreshCw", title: "Regular updates", text: "Widgets and reminders are on the roadmap." },
    ],
    screens: [
      {
        title: "Today",
        layout: "list",
        items: [
          { label: "Morning walk", meta: "12 day streak" },
          { label: "Drink water", meta: "Done" },
          { label: "Read 10 minutes", meta: "5 day streak" },
          { label: "Stretch", meta: "Skipped yesterday" },
          { label: "No phone after 10pm", meta: "3 day streak" },
          { label: "Journal", meta: "Done" },
        ],
      },
      {
        title: "Month",
        layout: "stats",
        items: [
          { label: "Completed", meta: "86%" },
          { label: "Best streak", meta: "21" },
          { label: "Loops", meta: "4" },
        ],
      },
      {
        title: "Loops",
        layout: "grid",
        items: [
          { label: "Walk", meta: "Daily" },
          { label: "Water", meta: "Daily" },
          { label: "Read", meta: "Weekdays" },
          { label: "Stretch", meta: "Daily" },
        ],
      },
    ],
    screenshots: [],
    releaseNotes: [
      { version: "1.0.1", date: "August 2026", notes: ["Fixed streak counting across time zones"] },
      { version: "1.0.0", date: "August 2026", notes: ["First public release"] },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

export function getAppById(id) {
  return apps.find((app) => app.id === id);
}

export function getFeaturedApps(limit = 3) {
  return apps.filter((app) => app.featured).slice(0, limit);
}

export function getNewRelease() {
  return apps.find((app) => app.isNewRelease) || apps[0];
}

export function getRelatedApps(app, limit = 3) {
  const sameCategory = apps.filter((a) => a.id !== app.id && a.category === app.category);
  const others = apps.filter((a) => a.id !== app.id && a.category !== app.category);
  return [...sameCategory, ...others].slice(0, limit);
}
