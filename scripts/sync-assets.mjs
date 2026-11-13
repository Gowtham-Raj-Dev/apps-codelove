/*
  Copy every app's ORIGINAL artwork from its own project into this site.

    node scripts/sync-assets.mjs        (run from the repo root; the sibling projects must sit next to it)

  Writes
    public/icons/<id>.png          512×512 app icon   (site + Android launcher icon)
    public/covers/<id>.webp        1200×630 cover     (cards, detail page)
    public/covers/<id>-wide.webp   wide game art      (detail gallery, home hero)
    public/covers/<id>-tall.webp   portrait game art  (home hero)
    src/data/assets.js           which of those exist, read by src/data/apps.js

  The generated files are committed, so the site builds without the sibling projects.
*/

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sites = path.resolve(root, ".."); // folder holding all CodeLove projects
const games = path.join(sites, "games.codelove.in/public/games");

const GAME_IDS = [
  "turbo-karts", "skate-rush", "sky-hop", "crypt-knight", "cannon-cove", "saucer-siege", "siege-smash",
  "putt-paradise", "hex-haven", "order-up", "beat-street", "aisle-zero", "kingdom-clash", "patti-veedu",
];

// id → where its original icon and cover live
const SOURCES = {
  "insta-downloader": { icon: "downloader/src/app/favicon.ico", cover: "downloader/public/og.png" },
  "link-in-bio": { icon: "link-in-bio/public/icon-512.png", cover: "link-in-bio/public/og.png" },
  videocut: { icon: "video-cut/public/icons/icon-512.png", cover: "video-cut/public/og-image.png" },
  "video-to-gif": { icon: "video-to-gif/app/icon.svg", cover: "video-to-gif/public/og.png" },
  javaplay: { icon: "java-game-emu/web/icon-512.png", cover: "java-game-emu/web/assets/og.png" },
};

const exists = (file) => access(file).then(() => true, () => false);

// A .ico holds several images; return the biggest one as a sharp image.
// Each is stored either as a PNG file or as a 32-bit bitmap (BGRA, bottom row first).
async function largestInIco(file) {
  const buf = await readFile(file);
  const count = buf.readUInt16LE(4);
  let best = null;
  for (let i = 0; i < count; i++) {
    const at = 6 + i * 16;
    const data = buf.subarray(buf.readUInt32LE(at + 12), buf.readUInt32LE(at + 12) + buf.readUInt32LE(at + 8));
    if (!best || data.length > best.length) best = data;
  }
  if (!best) throw new Error(`${file}: empty .ico`);
  if (best.readUInt32BE(0) === 0x89504e47) return sharp(best);

  const headerSize = best.readUInt32LE(0);
  const width = best.readInt32LE(4);
  const height = best.readInt32LE(8) / 2; // stored height covers image + mask
  if (best.readUInt16LE(14) !== 32) throw new Error(`${file}: only 32-bit .ico bitmaps are supported`);
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    const from = headerSize + (height - 1 - y) * width * 4;
    for (let x = 0; x < width; x++) {
      const s = from + x * 4;
      const d = (y * width + x) * 4;
      rgba[d] = best[s + 2];
      rgba[d + 1] = best[s + 1];
      rgba[d + 2] = best[s];
      rgba[d + 3] = best[s + 3];
    }
  }
  return sharp(rgba, { raw: { width, height, channels: 4 } });
}

async function icon(source, out, { crop = false } = {}) {
  const image = source.endsWith(".ico") ? await largestInIco(source) : sharp(source, source.endsWith(".svg") ? { density: 600 } : {});
  await image
    // Game covers are wide: take the most interesting square. Real icons are only scaled.
    .resize(512, 512, crop ? { fit: "cover", position: sharp.strategy.attention } : { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
}

const webp = (source, out, width, height) =>
  sharp(source).resize(width, height, { fit: "cover", withoutEnlargement: !height }).webp({ quality: 82 }).toFile(out);

await mkdir(path.join(root, "public/icons"), { recursive: true });
await mkdir(path.join(root, "public/covers"), { recursive: true });

const manifest = {};
const out = (dir, name) => path.join(root, "public", dir, name);

for (const [id, src] of Object.entries(SOURCES)) {
  await icon(path.join(sites, src.icon), out("icons", `${id}.png`));
  await webp(path.join(sites, src.cover), out("covers", `${id}.webp`), 1200, 630);
  manifest[id] = { icon: `/icons/${id}.png`, cover: `/covers/${id}.webp` };
  console.log(`✓ ${id.padEnd(18)} icon + cover`);
}

for (const id of GAME_IDS) {
  const dir = path.join(games, id);
  const cover = path.join(dir, "cover.webp");
  if (!(await exists(cover))) {
    console.warn(`! ${id}: no cover.webp, skipped`);
    continue;
  }
  await icon(cover, out("icons", `${id}.png`), { crop: true });
  await webp(cover, out("covers", `${id}.webp`), 1200, 630);
  const entry = { icon: `/icons/${id}.png`, cover: `/covers/${id}.webp` };
  if (await exists(path.join(dir, "backdrop-wide-1920.webp"))) {
    await webp(path.join(dir, "backdrop-wide-1920.webp"), out("covers", `${id}-wide.webp`), 1600);
    entry.wide = `/covers/${id}-wide.webp`;
  }
  if (await exists(path.join(dir, "backdrop-tall-1170.webp"))) {
    await webp(path.join(dir, "backdrop-tall-1170.webp"), out("covers", `${id}-tall.webp`), 640);
    entry.tall = `/covers/${id}-tall.webp`;
  }
  manifest[id] = entry;
  console.log(`✓ ${id.padEnd(18)} icon + cover${entry.wide ? " + wide" : ""}${entry.tall ? " + tall" : ""}`);
}

await writeFile(
  path.join(root, "src/data/assets.js"),
  `// GENERATED by scripts/sync-assets.mjs — do not edit by hand\nexport const assets = ${JSON.stringify(manifest, null, 2)};\n`,
);
console.log(`\n${Object.keys(manifest).length} apps → src/data/assets.js`);
