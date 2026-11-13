/*
  One Android app per game on games.codelove.in.

  Every game app is the same shell (src/android-apps) opening the game's /play/ page:
  locked to landscape, full screen (system bars hidden), screen kept on, sound allowed
  without a tap, and the Android back button handed to the game.
  Field guide: see apps.js.
*/

const GAMES_SITE = "https://games.codelove.in";
const UPDATED = "November 2026";

// The games detect the Android app by this user-agent token (games.codelove.in → shared/native-app.ts):
// it hides the browser-only "Full screen" / "Rotate your phone" buttons and wires up the back button.
const GAME_UA = "KingdomClashApp/1.0.0";

// Settings shared by every game app.
const GAME_ANDROID = { orientation: "landscape", immersive: true, dark: true, uaToken: GAME_UA };

function game({ id, name, genre, tagline, description, accent, accent2, icon, highlights, extra = {} }) {
  return {
    id,
    name,
    tagline,
    category: "Games",
    genre,
    description,
    about: [
      `${name} is a free 3D ${genre.toLowerCase()} game by CodeLove. ${description}`,
      "The app opens the game full screen in landscape, with touch controls and no browser bars. It is the same game as on games.codelove.in, so new levels and fixes arrive without updating the app.",
    ],
    version: "1.0.0",
    size: "2 MB",
    androidVersion: "Android 8.0+",
    updated: UPDATED,
    platform: "Android",
    apkUrl: `/downloads/${id}.apk`,
    webAppUrl: `${GAMES_SITE}/${id}/`,
    android: { ...GAME_ANDROID, url: `${GAMES_SITE}/${id}/play/` },
    icon: { name: icon, gradient: `linear-gradient(135deg, ${accent} 0%, ${accent2} 100%)` },
    iconImage: "",
    accent,
    features: [
      ...highlights.map((text, i) => ({ icon: i === 0 ? icon : i === 1 ? "Sparkles" : "Layers", title: text.title, text: text.text })),
      { icon: "Smartphone", title: "Landscape, full screen", text: "Locked to landscape with the system bars hidden." },
      { icon: "Gamepad2", title: "Touch controls", text: "On-screen controls made for phones." },
      { icon: "RefreshCw", title: "Always the latest", text: "Game updates arrive without a new APK." },
    ],
    releaseNotes: [{ version: "1.0.0", date: UPDATED, notes: ["First Android release: landscape, full screen"] }],
    ...extra,
  };
}

export const gameApps = [
  game({
    id: "turbo-karts",
    name: "Turbo Karts",
    genre: "Kart racing",
    tagline: "Drift, boost and banana-slip your way to the podium",
    description: "Race four rivals over nine circuits, drift for mini-turbos, grab items and win three cups — or race friends online.",
    accent: "#f97316",
    accent2: "#facc15",
    icon: "CarFront",
    highlights: [
      { title: "9 circuits in 3 cups", text: "Grand Prix, Turbo and Champion cups, plus Time Trial." },
      { title: "Online races", text: "Quick match with up to six players, or private rooms." },
      { title: "Shop & upgrades", text: "Unlock karts, upgrades and fourteen kart designs." },
    ],
  }),
  game({
    id: "skate-rush",
    name: "Skate Rush",
    genre: "Endless runner",
    tagline: "Skate through the city, dodge the traffic, grab every coin",
    description: "An endless skateboard run through city streets: swipe to switch lanes, jump and slide past traffic and collect coins.",
    accent: "#f59e0b",
    accent2: "#fb7185",
    icon: "Zap",
    highlights: [
      { title: "Endless city run", text: "The street keeps going and keeps getting faster." },
      { title: "Swipe controls", text: "Swipe to change lane, jump and slide." },
      { title: "Coins & high scores", text: "Beat your best distance every run." },
    ],
  }),
  game({
    id: "sky-hop",
    name: "Sky Hop",
    genre: "3D platformer",
    tagline: "Run, double-jump and stomp across floating sky islands",
    description: "A 3D platformer set on floating islands: run, double-jump, stomp enemies and reach the flag.",
    accent: "#facc15",
    accent2: "#38bdf8",
    icon: "Cloud",
    highlights: [
      { title: "Floating islands", text: "Levels built high above the clouds." },
      { title: "Double jump & stomp", text: "Tight controls with a virtual stick." },
      { title: "Coins & secrets", text: "Collect everything on each island." },
    ],
  }),
  game({
    id: "crypt-knight",
    name: "Crypt Knight",
    genre: "Action roguelite",
    tagline: "Sword, shield and a crypt full of restless skeletons",
    description: "Fight room by room through a crypt of skeleton warriors, mages and rogues, picking upgrades between fights.",
    accent: "#f43f5e",
    accent2: "#a855f7",
    icon: "Sword",
    highlights: [
      { title: "Sword & shield combat", text: "Attack, block and dodge with touch buttons." },
      { title: "Upgrades every room", text: "Build a different knight each run." },
      { title: "Skeleton bosses", text: "Warriors, mages and rogues guard the crypt." },
    ],
  }),
  game({
    id: "cannon-cove",
    name: "Cannon Cove",
    genre: "Naval trading & action",
    tagline: "Trade across the open sea, build a fleet, battle friends online",
    description: "Sail between ports, trade goods, upgrade your ship and fight cannon battles — against pirates or friends online.",
    accent: "#38bdf8",
    accent2: "#34d399",
    icon: "Ship",
    highlights: [
      { title: "Open sea trading", text: "Buy low, sell high and grow your fleet." },
      { title: "Cannon battles", text: "Broadside fights against pirates." },
      { title: "Play online", text: "Battle friends in the same sea." },
    ],
  }),
  game({
    id: "saucer-siege",
    name: "Saucer Siege",
    genre: "Tower defense",
    tagline: "Medieval towers versus flying saucers. Hold the valley!",
    description: "Build and upgrade medieval towers to stop waves of flying saucers from crossing the valley.",
    accent: "#a78bfa",
    accent2: "#22d3ee",
    icon: "Rocket",
    highlights: [
      { title: "Towers vs saucers", text: "Archers, cannons and mages against UFOs." },
      { title: "Upgrade paths", text: "Spend gold on stronger towers between waves." },
      { title: "Wave after wave", text: "Each wave brings new saucer types." },
    ],
  }),
  game({
    id: "siege-smash",
    name: "Siege Smash",
    genre: "Physics puzzle",
    tagline: "Aim the trebuchet, topple the towers, rout the defenders",
    description: "A physics puzzle: aim a trebuchet, pick your shot and knock down castles in as few throws as you can.",
    accent: "#a3e635",
    accent2: "#facc15",
    icon: "Target",
    highlights: [
      { title: "Real physics", text: "Walls crack, towers fall, defenders scatter." },
      { title: "Drag to aim", text: "Pull back, set the angle and let go." },
      { title: "Three-star levels", text: "Finish with shots to spare for more stars." },
    ],
  }),
  game({
    id: "putt-paradise",
    name: "Putt Paradise",
    genre: "Mini golf",
    tagline: "Nine dreamy mini-golf holes. Ramps, loops and windmills",
    description: "Nine holes of mini golf with ramps, loops and windmills. Drag to aim and set power, and go for a hole in one.",
    accent: "#2dd4bf",
    accent2: "#a3e635",
    icon: "Flag",
    highlights: [
      { title: "Nine holes", text: "Each hole has its own trick." },
      { title: "Drag to putt", text: "Simple aim and power with one finger." },
      { title: "Beat par", text: "Scorecard and best scores are saved." },
    ],
  }),
  game({
    id: "hex-haven",
    name: "Hex Haven",
    genre: "Puzzle",
    tagline: "Lay hex tiles, match the edges, grow a tiny kingdom",
    description: "A calm tile puzzle: place hex tiles so forests, fields and towns line up, and grow the biggest kingdom you can.",
    accent: "#34d399",
    accent2: "#60a5fa",
    icon: "Hexagon",
    highlights: [
      { title: "Match the edges", text: "Forests to forests, water to water." },
      { title: "Relaxed pace", text: "No timer — think about every tile." },
      { title: "Chase a high score", text: "Perfect placements give bonus tiles." },
    ],
  }),
  game({
    id: "order-up",
    name: "Order Up!",
    genre: "Cooking time management",
    tagline: "Grill, stack and serve burgers before the customers walk out",
    description: "Run a burger counter: grill patties, stack the right toppings and serve each order before the customer leaves.",
    accent: "#f472b6",
    accent2: "#fb923c",
    icon: "ChefHat",
    highlights: [
      { title: "Grill & stack", text: "Tap to cook and build each burger." },
      { title: "Busy shifts", text: "More customers and longer orders every day." },
      { title: "Kitchen upgrades", text: "Spend tips on faster grills." },
    ],
  }),
  game({
    id: "beat-street",
    name: "Beat Street",
    genre: "Rhythm",
    tagline: "Hit the notes on the beat and make the crowd dance",
    description: "A rhythm game: tap the notes in time with the music, build combos and get the whole street dancing.",
    accent: "#e879f9",
    accent2: "#60a5fa",
    icon: "Music",
    highlights: [
      { title: "Tap to the beat", text: "Four lanes, original songs." },
      { title: "Combos & ranks", text: "Chain perfect hits for a higher rank." },
      { title: "Dancing crowd", text: "The better you play, the bigger the party." },
    ],
  }),
  // Aisle Zero is "Coming soon" on games.codelove.in, so it has no app for now (hidden here, no APK).
  // To bring it back, put this entry back in the list:
  // game({
  //   id: "aisle-zero",
  //   name: "Aisle Zero",
  //   genre: "Horror stealth",
  //   tagline: "A huge abandoned supermarket at night. A cart, a list, and something in the aisles",
  //   description: "A horror stealth game: finish your shopping list in a dark, empty supermarket without being caught by what roams the aisles.",
  //   accent: "#e2261a",
  //   accent2: "#7c3aed",
  //   icon: "ShoppingCart",
  //   highlights: [
  //     { title: "Shop in the dark", text: "Find every item on the list." },
  //     { title: "Hide and listen", text: "Sound tells you how close it is." },
  //     { title: "Best with headphones", text: "3D audio in landscape." },
  //   ],
  // }),
  // These two have their own offline APKs, built in the games.codelove.in project.
  game({
    id: "kingdom-clash",
    name: "Kingdom Clash",
    genre: "Base-building strategy",
    tagline: "Build your village, train an army, raid rival villages",
    description: "Build a village, train an army and raid rival villages online, or play the 100-stage campaign.",
    accent: "#fbbf24",
    accent2: "#f97316",
    icon: "Castle",
    highlights: [
      { title: "Build & defend", text: "Walls, towers and traps protect your gold." },
      { title: "Raid online", text: "Attack other players' villages." },
      { title: "100-stage campaign", text: "A long single-player path." },
    ],
    extra: {
      version: "1.3.0",
      size: "30 MB",
      androidVersion: "Android 7.0+",
      updated: "October 2026",
      apkUrl: `${GAMES_SITE}/downloads/kingdom-clash.apk`,
      android: { build: false },
      releaseNotes: [{ version: "1.3.0", date: "October 2026", notes: ["Offline app with the game files inside the APK"] }],
    },
  }),
  game({
    id: "patti-veedu",
    name: "Patti Veedu",
    genre: "Horror puzzle",
    tagline: "Grandma's house. Five nights. Listen for her anklet bells",
    description: "A Tamil horror puzzle: survive five nights in grandma's house, solve the rooms and listen for her anklet bells.",
    accent: "#e2563b",
    accent2: "#7c2d12",
    icon: "Ghost",
    highlights: [
      { title: "Five nights", text: "Each night opens more of the house." },
      { title: "Puzzles in every room", text: "Find keys, notes and hiding places." },
      { title: "Listen for the bells", text: "Her anklets tell you where she is." },
    ],
    extra: {
      version: "10.7",
      size: "4.5 MB",
      androidVersion: "Android 7.0+",
      updated: "October 2026",
      apkUrl: `${GAMES_SITE}/downloads/patti-veedu.apk`,
      android: { build: false },
      releaseNotes: [{ version: "10.7", date: "October 2026", notes: ["Offline app with the game files inside the APK"] }],
    },
  }),
];
