/** Regression checks for the published document, after npm run build. */
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { parse } from "parse5";

const root = path.resolve(import.meta.dirname, "../out");
const html = await readFile(path.join(root, "index.html"), "utf8");
const nodes = [];
const collect = node => { nodes.push(node); (node.childNodes ?? []).forEach(collect); };
collect(parse(html));
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const text = node => node.value ?? (node.childNodes ?? []).map(text).join("");
const all = tag => nodes.filter(n => n.tagName === tag);
const ids = new Set(nodes.map(n => attr(n, "id")).filter(Boolean));

assert.equal(all("h1").length, 1);
assert.equal(all("script").length, 2, "Only structured data and the clipboard enhancement belong in the homepage");
const schema = all("script").find(n => attr(n, "type") === "application/ld+json");
const helper = all("script").find(n => attr(n, "src") === "/assets/ask-ai.js");
assert.ok(helper?.attrs.some(a => a.name === "defer"));
await access(path.join(root, "assets/ask-ai.js"));
const graph = JSON.parse(text(schema))["@graph"];
const questions = graph.find(n => n["@type"] === "FAQPage").mainEntity;
assert.equal(questions.length, 6);
for (const q of questions) {
  assert.ok(all("summary").some(n => text(n) === q.name), q.name);
  assert.ok(all("p").some(n => text(n) === q.acceptedAnswer.text), q.name);
}
assert.ok(!html.includes("Web on other devices"));
assert.ok(!html.includes("beta.tempoassistant.com"));
assert.ok(all("link").some(n => attr(n, "rel") === "canonical" && attr(n, "href") === "https://tempoassistant.com"));
assert.ok(!html.includes("Free on iPhone · iOS 17 or later"));
const aiSection = all("div").find(n => attr(n, "class") === "footer__ai");
assert.ok(aiSection.attrs.some(a => a.name === "data-nosnippet"), "AI UI must stay out of Google snippets");
const prompt = text(nodes.find(n => attr(n, "id") === "ai-question-text"));
assert.ok(prompt.length < 100 && prompt.includes("https://tempoassistant.com"));
assert.equal([...all("a"), ...all("summary")].filter(n => attr(n, "class")?.startsWith("ai-link ")).length, 5);

for (const a of all("a")) {
  const href = attr(a, "href");
  if (href?.startsWith("#") || href?.startsWith("/#")) assert.ok(ids.has(href.split("#")[1]), href);
  if (attr(a, "aria-label")?.startsWith("Ask ")) {
    const url = new URL(href);
    assert.equal(url.searchParams.get("q"), prompt);
    assert.equal(attr(a, "target"), "_blank");
    assert.ok(attr(a, "rel").includes("noopener"));
  }
  if (attr(a, "data-copy-question")) {
    assert.equal(attr(a, "href"), "https://gemini.google.com/app");
    assert.equal(attr(a, "target"), "_blank");
    assert.ok(attr(a, "rel").includes("noopener"));
  }
}
for (const img of all("img")) {
  assert.ok(attr(img, "alt") !== undefined);
  assert.ok(Number(attr(img, "width")) > 0 && Number(attr(img, "height")) > 0);
}
for (const n of [...all("img"), ...all("source")]) {
  const urls = [attr(n, "src"), ...(attr(n, "srcset") ?? "").split(",").filter(Boolean).map(x => x.trim().split(" ")[0])].filter(Boolean);
  for (const url of urls) if (url.startsWith("/")) await access(path.join(root, url));
}
const css = all("style").map(text).join("\n");
assert.match(css, /scroll-behavior:smooth/);
assert.match(css, /prefers-reduced-motion:reduce[^}]*scroll-behavior:auto/);
for (const match of css.matchAll(/url\(["']?(\/_next\/static\/media\/[^"')]+)["']?\)/g)) await access(path.join(root, match[1]));
const contact = await readFile(path.join(root, "contact.html"), "utf8");
assert.match(contact, /<script[^>]+src="\/_next\//, "Contact must keep its copy-button runtime");
assert.ok(contact.includes("Copy address"));
console.log("Static homepage checks passed: content, FAQ schema, assets, native anchors, AI links and Contact runtime.");
