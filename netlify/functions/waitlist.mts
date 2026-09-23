/**
 * Live waitlist: counts signups and reserves @handles. (Founding badges are
 * given by hand to beta testers, so they are not handled here.) Stored in Netlify Blobs, so there is nothing to set
 * up: it works as soon as this file is deployed.
 *
 *   GET  /api/waitlist                 -> { count }
 *   GET  /api/waitlist?handle=nick     -> { handle, available, reason? }
 *   POST /api/waitlist { email }       -> { position, handle }
 *   POST /api/waitlist { email, handle } claims a handle for that signup
 *
 * Emails are stored only as a SHA-256 hash. The addresses themselves still
 * live in Netlify Forms, exactly as before.
 *
 * Optional env vars (Site settings > Environment variables):
 *   WAITLIST_BASELINE  people who joined before this counter existed, added
 *                      to the public count. Defaults to 153.
 */
import { getStore } from "@netlify/blobs";

type Store = ReturnType<typeof getStore>;
type Signup = { position: number; handle: string | null; at: string };

const RESERVED = new Set([
  "tempo", "tempoapp", "tempoassistant", "admin", "support", "help", "team", "official",
  "founder", "founders", "founding", "staff", "mod", "moderator", "root", "api", "www",
  "null", "undefined", "nick", "axel", "everyone", "here", "me", "you",
]);

const json = (body: unknown, status = 200, cache = "no-store") =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": cache },
  });

export const cleanHandle = (raw: string) => raw.trim().replace(/^@/, "").toLowerCase();

export function checkHandleShape(h: string): string | null {
  if (h.length < 3) return "At least 3 characters.";
  if (h.length > 20) return "20 characters max.";
  if (!/^[a-z0-9._]+$/.test(h)) return "Letters, numbers, dots and underscores only.";
  if (/^[._]|[._]$/.test(h)) return "Can't start or end with a dot or underscore.";
  if (/\.\./.test(h)) return "No double dots.";
  if (/^\d+$/.test(h)) return "Needs at least one letter.";
  if (RESERVED.has(h)) return "That one's reserved.";
  return null;
}

/**
 * One person, one signup, one handle. nick+2@gmail.com and n.i.c.k@gmail.com
 * are the same inbox as nick@gmail.com, so they count as the same person.
 */
export function normaliseEmail(email: string) {
  const [local, domain = ""] = email.trim().toLowerCase().split("@");
  let user = local.split("+")[0];
  if (domain === "gmail.com" || domain === "googlemail.com") user = user.replace(/\./g, "");
  return `${user}@${domain === "googlemail.com" ? "gmail.com" : domain}`;
}

async function hashEmail(email: string) {
  const bytes = new TextEncoder().encode(normaliseEmail(email));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Atomic +1 on the signup counter (compare-and-swap on the blob's ETag). */
async function nextPosition(store: Store): Promise<number> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const current = await store.getWithMetadata("meta/counter", { type: "json" });
    if (!current) {
      const r = await store.setJSON("meta/counter", { n: 1 }, { onlyIfNew: true });
      if (r.modified) return 1;
      continue;
    }
    const n = Number(current.data?.n ?? 0) + 1;
    const r = await store.setJSON("meta/counter", { n }, { onlyIfMatch: current.etag });
    if (r.modified) return n;
    await new Promise((res) => setTimeout(res, 20 + Math.random() * 60));
  }
  throw new Error("counter busy");
}

async function signups(store: Store) {
  const c = await store.get("meta/counter", { type: "json" });
  return Number(c?.n ?? 0);
}

export async function handle(req: Request, store: Store, env: Record<string, string | undefined>) {
  const baseline = env.WAITLIST_BASELINE ? Number(env.WAITLIST_BASELINE) || 0 : 153;
  const url = new URL(req.url);

  if (req.method === "GET") {
    const q = url.searchParams.get("handle");
    if (q !== null) {
      const h = cleanHandle(q);
      const reason = checkHandleShape(h);
      if (reason) return json({ handle: h, available: false, reason });
      const taken = await store.get(`handle/${h}`);
      return json({ handle: h, available: !taken, reason: taken ? "Taken. Try another." : undefined });
    }
    const n = await signups(store);
    return json({ count: n + baseline }, 200, "public, max-age=0, s-maxage=5");
  }

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: { email?: string; handle?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Bad request" }, 400);
  }
  // Honeypot: bots fill every field.
  if (body.website) return json({ error: "Bad request" }, 400);

  const email = String(body.email ?? "").trim();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) return json({ error: "Invalid email" }, 400);
  const key = `signup/${await hashEmail(email)}`;

  // Register once. onlyIfNew stops a double-submit from counting twice.
  let signup = (await store.get(key, { type: "json" })) as Signup | null;
  if (!signup) {
    const claim = await store.setJSON(key, { pending: true }, { onlyIfNew: true });
    if (claim.modified) {
      const position = await nextPosition(store);
      signup = { position, handle: null, at: new Date().toISOString() };
      await store.setJSON(key, signup);
    } else {
      signup = (await store.get(key, { type: "json" })) as Signup | null;
    }
  }
  if (!signup || typeof signup.position !== "number") return json({ error: "Try again" }, 409);

  if (body.handle !== undefined) {
    const h = cleanHandle(String(body.handle));
    const reason = checkHandleShape(h);
    if (reason) return json({ error: reason }, 400);
    // One handle per email, for good.
    if (signup.handle) return json({ error: `You've already claimed @${signup.handle}. It's one handle per email.` }, 409);
    const res = await store.setJSON(`handle/${h}`, { signup: key }, { onlyIfNew: true });
    if (!res.modified) return json({ error: "Taken. Try another." }, 409);
    signup = { ...signup, handle: h };
    await store.setJSON(key, signup);
  }

  return json({ position: signup.position + baseline, handle: signup.handle });
}

export default async (req: Request) =>
  handle(req, getStore({ name: "waitlist", consistency: "strong" }), {
    WAITLIST_BASELINE: Netlify.env.get("WAITLIST_BASELINE"),
  });

declare const Netlify: { env: { get(name: string): string | undefined } };

export const config = { path: "/api/waitlist" };
