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
assert.equal(all("script").length, 1, "Only structured data belongs in the homepage; no executable scripts");
const schema = all("script").find(n => attr(n, "type") === "application/ld+json");
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
const aiNav = all("nav").find(n => attr(n, "class") === "footer__ai-links");
let ancestor = aiNav.parentNode;
while (ancestor) {
  assert.notEqual(ancestor.tagName, "details", "AI links must stay visible without a disclosure");
  ancestor = ancestor.parentNode;
}
assert.ok(!html.includes("ai-question-text") && !html.includes("data-copy-question"), "No copy/paste UI");
assert.ok(all("img").some(n => attr(n, "src") === "/assets/ai/linkedin.webp" && attr(n, "width") === "46" && attr(n, "height") === "46"));
const prompt = "How can Tempo help me make plans with friends? https://tempoassistant.com";
assert.equal(all("a").filter(n => attr(n, "class")?.startsWith("ai-link ")).length, 5);
const google = all("a").find(n => attr(n, "class") === "ai-link ai-link--gemini");
const googleUrl = new URL(attr(google, "href"));
assert.equal(googleUrl.origin, "https://www.google.com");
assert.equal(googleUrl.pathname, "/search");
assert.equal(googleUrl.searchParams.get("udm"), "50");
assert.match(attr(google, "aria-label"), /Google AI Mode/);

for (const a of all("a")) {
  const href = attr(a, "href");
  if (href?.startsWith("#") || href?.startsWith("/#")) assert.ok(ids.has(href.split("#")[1]), href);
  if (attr(a, "aria-label")?.startsWith("Ask ")) {
    const url = new URL(href);
    assert.equal(url.searchParams.get("q"), prompt);
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
// Native demo controls survive the export without React, with one default per group.
for (const name of ["example-plan", "planning-step"]) {
  const radios = all("input").filter(n => attr(n, "name") === name);
  assert.equal(radios.length, 3, `${name}: three choices`);
  assert.equal(radios.filter(n => attr(n, "checked") !== undefined).length, 1, `${name}: one default`);
  for (const radio of radios) {
    assert.equal(attr(radio, "type"), "radio");
    assert.equal(radio.parentNode.tagName, "label", "Every choice has a native label");
    assert.ok(ids.has(attr(radio, "aria-controls")), "Every choice names an existing panel");
  }
}
assert.ok(all("main").some(n => attr(n, "id") === "main" && attr(n, "tabindex") === "-1"));
assert.ok(all("a").some(n => attr(n, "class") === "skip-link" && attr(n, "href") === "#main"));
const css = all("style").map(text).join("\n");
assert.match(css, /scroll-behavior:smooth/);
assert.match(css, /prefers-reduced-motion:reduce[^}]*scroll-behavior:auto/);
for (const match of css.matchAll(/url\(["']?(\/_next\/static\/media\/[^"')]+)["']?\)/g)) await access(path.join(root, match[1]));
const contact = await readFile(path.join(root, "contact.html"), "utf8");
assert.match(contact, /<script[^>]+src="\/_next\//, "Contact must keep its copy-button runtime");
assert.ok(contact.includes("Copy address"));
console.log("Static homepage checks passed: content, FAQ schema, assets, native anchors and demos, AI links and Contact runtime.");
