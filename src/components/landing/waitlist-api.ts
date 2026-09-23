"use client";

/**
 * Client side of the live waitlist (netlify/functions/waitlist.mts).
 *
 * `npm run dev` has no Netlify Functions, so in development this falls back to
 * a demo store in localStorage. That lets you click through the whole flow on
 * localhost:3000. In production it only ever shows real numbers: if the API is
 * down, the counters simply hide.
 */

import { useEffect, useState } from "react";
import { WAITLIST_START } from "./content";

export type Stats = { count: number };
export type Signup = { position: number; handle: string | null };
export type HandleCheck = { handle: string; available: boolean; reason?: string };

const API = "/api/waitlist";
const DEV = process.env.NODE_ENV === "development";
const CHANGED = "tempo:waitlist-changed";

/* ---------------- demo store (development only) ---------------- */

const DEMO_KEY = "tempo-demo-waitlist";
type Demo = { n: number; signups: Record<string, { position: number; handle: string | null }>; handles: string[] };

function demo(): Demo {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KEY) ?? "") as Demo;
  } catch {
    return { n: 0, signups: {}, handles: [] };
  }
}
function saveDemo(d: Demo) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(d));
  } catch {}
}

const RESERVED = ["tempo", "admin", "support", "help", "team", "official", "founder", "founding", "nick", "axel"];

export function handleProblem(raw: string): string | null {
  const h = raw.trim().replace(/^@/, "").toLowerCase();
  if (h.length < 3) return "At least 3 characters.";
  if (h.length > 20) return "20 characters max.";
  if (!/^[a-z0-9._]+$/.test(h)) return "Letters, numbers, dots and underscores only.";
  if (/^[._]|[._]$/.test(h)) return "Can't start or end with a dot or underscore.";
  if (/\.\./.test(h)) return "No double dots.";
  if (/^\d+$/.test(h)) return "Needs at least one letter.";
  if (RESERVED.includes(h)) return "That one's reserved.";
  return null;
}

async function call<T>(init: RequestInit & { query?: string }, demoFn: () => T): Promise<T> {
  try {
    const res = await fetch(API + (init.query ?? ""), {
      ...init,
      headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    });
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("application/json")) throw new Error("no api");
    const body = await res.json();
    if (!res.ok) throw Object.assign(new Error(body.error ?? "Something went wrong"), { api: true });
    return body as T;
  } catch (err) {
    if (DEV && !(err as { api?: boolean }).api) return demoFn();
    throw err;
  }
}

/* ---------------- public API ---------------- */

export function getStats(): Promise<Stats> {
  return call({ method: "GET" }, () => {
    return { count: WAITLIST_START + demo().n };
  });
}

export function checkHandle(raw: string): Promise<HandleCheck> {
  const h = raw.trim().replace(/^@/, "").toLowerCase();
  return call({ method: "GET", query: `?handle=${encodeURIComponent(h)}` }, () => {
    const reason = handleProblem(h) ?? (demo().handles.includes(h) ? "Taken. Try another." : null);
    return { handle: h, available: !reason, reason: reason ?? undefined };
  });
}

export async function register(email: string, handle?: string): Promise<Signup> {
  const result = await call<Signup>(
    { method: "POST", body: JSON.stringify(handle === undefined ? { email } : { email, handle }) },
    () => {
      const d = demo();
      const key = email.trim().toLowerCase();
      let s = d.signups[key];
      if (!s) {
        d.n += 1;
        s = d.signups[key] = { position: d.n, handle: null };
      }
      if (handle !== undefined) {
        const h = handle.trim().replace(/^@/, "").toLowerCase();
        const problem = handleProblem(h);
        if (problem) throw Object.assign(new Error(problem), { api: true });
        if (s.handle) throw Object.assign(new Error(`You've already claimed @${s.handle}.`), { api: true });
        if (d.handles.includes(h)) throw Object.assign(new Error("Taken. Try another."), { api: true });
        d.handles.push(h);
        s.handle = h;
      }
      saveDemo(d);
      return { position: WAITLIST_START + s.position, handle: s.handle };
    },
  );
  window.dispatchEvent(new Event(CHANGED));
  return result;
}

/** Live stats: polls every 15 seconds and refreshes the moment anyone on this page signs up. */
export function useWaitlistStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () =>
      getStats()
        .then((s) => alive && setStats(s))
        .catch(() => alive && setStats(null));
    load();
    const id = window.setInterval(load, 15000);
    window.addEventListener(CHANGED, load);
    return () => {
      alive = false;
      window.clearInterval(id);
      window.removeEventListener(CHANGED, load);
    };
  }, []);
  return stats;
}
