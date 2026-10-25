/**
 * The homepage is deliberately a document: links, native disclosures, CSS motion.
 * It has no executable JavaScript; AI destinations are ordinary links.
 * Publish its prerendered HTML without the React router/hydration runtime.
 * Other routes retain Next's runtime (e.g. Contact's Copy address button).
 * Run after next build, and review this contract before adding React interactions.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse, parseFragment, serialize } from "parse5";

const root = path.resolve(import.meta.dirname, "../out");
const file = path.join(root, "index.html");
const source = await readFile(file, "utf8");
const doc = parse(source);
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
let removedScripts = 0;
let stylesheets = 0;
let schemas = 0;

async function optimize(node) {
  const children = [];
  for (const child of node.childNodes ?? []) {
    if (["button", "input", "form", "textarea", "select"].includes(child.tagName)) {
      throw new Error(`Homepage now contains <${child.tagName}>; review its static interaction contract.`);
    }
    if (attr(child, "id")?.startsWith("S:")) throw new Error("Unexpected streamed boundary in static homepage");
    if (child.tagName === "script") {
      if (attr(child, "type") === "application/ld+json") {
        JSON.parse(child.childNodes.map(n => n.value ?? "").join(""));
        schemas++;
      } else {
        const src = attr(child, "src");
        const text = child.childNodes.map(n => n.value ?? "").join("");
        if (!(src?.startsWith("/_next/") || /^(?:\(self\.__next_f|self\.__next_f)/.test(text))) {
          throw new Error(`Unexpected homepage script; review before removing: ${src ?? text.slice(0, 80)}`);
        }
        removedScripts++;
        continue;
      }
    }
    if (child.tagName === "link") {
      if (attr(child, "as") === "script" || attr(child, "rel") === "modulepreload") continue;
      // The QR remains available on demand, without a request on first paint.
      if (attr(child, "as") === "image" && attr(child, "href") === "/assets/download-qr.svg") continue;
      if (attr(child, "rel") === "stylesheet") {
        const href = attr(child, "href");
        if (!href?.startsWith("/_next/static/")) throw new Error(`Unexpected stylesheet: ${href}`);
        const cssFile = path.join(root, href);
        let css = await readFile(cssFile, "utf8");
        css = css.replace(/url\((['"]?)([^)'"\s]+)\1\)/g, (match, quote, url) => {
          if (/^(?:\/|data:|https?:|#)/.test(url)) return match;
          return `url("${path.posix.resolve(path.posix.dirname(href), url)}")`;
        });
        const style = parseFragment(`<style data-home-styles>${css}</style>`).childNodes[0];
        style.parentNode = node;
        children.push(style);
        stylesheets++;
        continue;
      }
    }
    await optimize(child);
    children.push(child);
  }
  if (node.childNodes) node.childNodes = children;
}

await optimize(doc);
if (!removedScripts || stylesheets !== 1 || schemas !== 1) throw new Error("Unexpected Next export structure");
const result = serialize(doc);
if (/__next_f|<script[^>]+src="\/_next\//.test(result)) throw new Error("Next runtime remained in the static homepage");
await writeFile(file, result);
console.log(`Static homepage: ${removedScripts} runtime scripts removed; ${Buffer.byteLength(source)} → ${Buffer.byteLength(result)} HTML bytes.`);
