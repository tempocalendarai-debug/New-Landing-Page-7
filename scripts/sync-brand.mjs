// Keeps src/components/brand/ byte-identical to the Tempo app's brand kit, so the
// landing page runs the exact same TempoText, TempoAgent, InkCard and wobblyRect
// code as the product instead of a reimplementation that slowly drifts.
//
//   npm run brand:sync    copy from the app checkout and rewrite brand.lock.json
//   npm run brand:check   fail if the vendored files no longer match the lock
//
// Source defaults to a sibling checkout of axelgf519-gif/Tempo-Nodejs. Override
// with BRAND_SRC=/path/to/Tempo-Nodejs/src/components/brand.

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dest = path.join(root, "src/components/brand");
const lockPath = path.join(root, "brand.lock.json");
const src = path.resolve(process.env.BRAND_SRC ?? path.join(root, "../Tempo-Nodejs/src/components/brand"));

const sha = (file) => createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const tsxFiles = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith(".tsx")).sort();

if (process.argv.includes("--check")) {
  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  const problems = [];
  for (const [file, hash] of Object.entries(lock.files)) {
    const p = path.join(dest, file);
    if (!fs.existsSync(p)) problems.push(`missing: ${file}`);
    else if (sha(p) !== hash) problems.push(`edited locally: ${file}`);
  }
  for (const file of tsxFiles(dest)) if (!(file in lock.files)) problems.push(`not from app: ${file}`);
  if (fs.existsSync(src)) {
    for (const file of tsxFiles(src)) {
      if (lock.files[file] !== sha(path.join(src, file))) problems.push(`app has newer code: ${file}`);
    }
  }
  if (problems.length) {
    console.error(`Brand kit out of sync with ${lock.source}@${lock.commit.slice(0, 7)}:\n  ${problems.join("\n  ")}`);
    console.error("Run `npm run brand:sync`. Change brand components in the app, never here.");
    process.exit(1);
  }
  console.log(`Brand kit matches ${lock.source}@${lock.commit.slice(0, 7)}.`);
  process.exit(0);
}

if (!fs.existsSync(src)) {
  console.error(`No app brand kit at ${src}. Clone axelgf519-gif/Tempo-Nodejs beside this repo or set BRAND_SRC.`);
  process.exit(1);
}

fs.mkdirSync(dest, { recursive: true });
for (const file of tsxFiles(dest)) fs.rmSync(path.join(dest, file));

const files = {};
for (const file of tsxFiles(src)) {
  fs.copyFileSync(path.join(src, file), path.join(dest, file));
  files[file] = sha(path.join(dest, file));
}

let commit = "unknown";
try {
  commit = execFileSync("git", ["-C", src, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
} catch {}

fs.writeFileSync(
  lockPath,
  JSON.stringify({ source: "axelgf519-gif/Tempo-Nodejs", path: "src/components/brand", commit, files }, null, 2) + "\n"
);
console.log(`Synced ${Object.keys(files).length} brand files from Tempo-Nodejs@${commit.slice(0, 7)}.`);
