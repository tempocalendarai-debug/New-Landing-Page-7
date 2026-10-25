/** Static SVGs from the locked app brand kit, plus responsive photo variants. */
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import path from "node:path";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const assets = path.join(root, "public/assets");
const require = createRequire(import.meta.url);
// Render our vendored source rather than maintain a second set of mascot paths.
const source = await readFile(path.join(root, "src/components/brand/tempo-agent.tsx"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true } }).outputText;
const brandModule = { exports: {} };
runInNewContext(compiled, { require, exports: brandModule.exports, module: brandModule });
for (const state of ["headsUp", "thinking", "niceOne"]) {
  const html = renderToStaticMarkup(React.createElement(brandModule.exports.TempoAgent, { state, size: 120 }));
  let svg = html.slice(html.indexOf("<svg"), html.lastIndexOf("</svg>") + 6);
  let frames = 0;
  svg = svg.replace(/<g class="tmp-boil"([^>]*)>([\s\S]*?)<\/g>/g, (_, attrs, paths) => {
    const first = paths.match(/<path\b[^>]*><\/path>/)?.[0];
    if (!first) throw new Error(`Missing base brand path for ${state}`);
    frames++;
    return `<g${attrs}>${first}</g>`;
  });
  if (frames !== 3) throw new Error(`Unexpected brand structure for ${state}: ${frames} groups`);
  svg = svg.replace(/ class="[^"]*"/g, "").replace(/ style="[^"]*"/g, "");
  svg = svg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" style="color:#1b1b19;--tempo-paper:#f7f4ed;--tempo-weight:1" ');
  await writeFile(path.join(assets, `tempo-${state}.svg`), svg + "\n");
}
for (const width of [400, 800]) {
  await sharp(path.join(assets, "life-trip.webp")).resize(width, Math.round(width * 9 / 16), { fit: "cover", position: "centre" }).webp({ quality: 78 }).toFile(path.join(assets, `discover-${width}.webp`));
}
for (const width of [240, 480]) {
  await sharp(path.join(assets, "life-thursday.webp")).resize({ width }).webp({ quality: 78 }).toFile(path.join(assets, `memory-${width}.webp`));
}
