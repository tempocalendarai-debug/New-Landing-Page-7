/** Exercise real clipboard outcomes without contacting a provider or changing a user's clipboard. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const script = await readFile(new URL("../public/assets/ask-ai.js", import.meta.url), "utf8");
const prompt = "How can Tempo help me make plans with friends? https://tempoassistant.com";
async function click(clipboard, modifiers = {}) {
  let handler;
  let prevented = false;
  const fallback = { open: false };
  const status = { textContent: "" };
  const elements = { "ai-question-text": { textContent: prompt }, "ai-question": fallback, "ai-copy-status": status };
  const document = {
    querySelector: () => ({ addEventListener: (_, listener) => { handler = listener; } }),
    getElementById: id => elements[id],
  };
  runInNewContext(script, { document, navigator: { clipboard } });
  handler({ preventDefault: () => { prevented = true; }, ...modifiers });
  await new Promise(resolve => setImmediate(resolve));
  return { fallback, status, prevented };
}
let copied;
const success = await click({ writeText: async value => { copied = value; } });
assert.equal(copied, prompt);
assert.equal(success.prevented, false, "Successful copying must not block the native new-tab link");
assert.match(success.status.textContent, /Question copied/);
const denied = await click({ writeText: async () => { throw new Error("Clipboard permission denied"); } });
assert.equal(denied.fallback.open, true);
assert.doesNotMatch(denied.status.textContent, /Question copied/);
const absent = await click(undefined);
assert.equal(absent.prevented, true);
assert.equal(absent.fallback.open, true);
copied = undefined;
await click({ writeText: async value => { copied = value; } }, { metaKey: true });
assert.equal(copied, undefined, "Modified navigation should leave the clipboard alone");
console.log("AI copy checks passed: successful copy, denied permission, absent API and modified navigation.");
