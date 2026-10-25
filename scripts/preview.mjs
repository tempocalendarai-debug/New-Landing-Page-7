/**
 * Serves the static export in out/ the way Netlify does, so /privacy finds
 * privacy.html. `python -m http.server` can't, which makes every clean link look
 * broken locally. Run `npm run build` first. No dependencies.
 */
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { createGzip } from "node:zlib";

const root = join(import.meta.dirname, "..", "out");
const port = Number(process.env.PORT ?? 3007);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

const isFile = (p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
};

createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  const base = normalize(join(root, pathname));
  if (!base.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  const file = [base, `${base}.html`, join(base, "index.html")].find(isFile);
  if (!file) {
    const notFound = join(root, "404.html");
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    if (isFile(notFound)) createReadStream(notFound).pipe(res);
    else res.end("Not found");
    return;
  }
  const contentType = TYPES[extname(file)] ?? "application/octet-stream";
  // Match production's compressed text delivery for realistic local audits.
  const gzip = /\bgzip\b/.test(req.headers["accept-encoding"] ?? "") && /^(text\/|application\/json|image\/svg)/.test(contentType);
  res.writeHead(200, { "Content-Type": contentType, Vary: "Accept-Encoding", ...(gzip ? { "Content-Encoding": "gzip" } : {}) });
  const stream = createReadStream(file);
  if (gzip) stream.pipe(createGzip()).pipe(res);
  else stream.pipe(res);
}).listen(port, () => console.log(`Serving out/ at http://localhost:${port}`));
