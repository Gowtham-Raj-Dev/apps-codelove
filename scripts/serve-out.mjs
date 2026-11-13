/*
  Serve the static export (out/) locally — lighter than `next dev` on low-memory PCs.

    npm run build && node scripts/serve-out.mjs [port]     (default port 3020)
*/
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../out");
const port = Number(process.argv[2]) || 3020;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
  ".apk": "application/vnd.android.package-archive",
};

async function resolve(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^([/\\])+/, "");
  const file = path.join(out, clean);
  if (!file.startsWith(out)) return null;
  for (const candidate of [file, path.join(file, "index.html"), `${file}.html`]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // try the next one
    }
  }
  return null;
}

createServer(async (req, res) => {
  const file = (await resolve(req.url)) || path.join(out, "404.html");
  const status = file.endsWith("404.html") && !req.url.startsWith("/404") ? 404 : 200;
  res.writeHead(status, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  res.end(await readFile(file));
}).listen(port, () => console.log(`Serving out/ at http://localhost:${port}`));
