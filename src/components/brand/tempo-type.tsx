"use client";

/**
 * Tempo display type
 * ------------------------------------------------------------------
 * Hand-lettered monoline uppercase, drawn on the same grid as the
 * wordmark: cap height 40, baseline 42, one pen weight throughout.
 *
 * THIS IS A DISPLAY FACE. Headlines, empty states, splash copy, ad
 * frames. Do not set body text in it:
 *   - no kerning pairs, no hinting, no lowercase
 *   - illegible below ~20px cap height
 *   - every glyph is 1-3 SVG paths, so a paragraph is thousands of nodes
 * Rule of thumb: four words, one line, 24px cap height or larger.
 *
 * The boil (the wobble) is generated at runtime rather than hand-drawn.
 * Each glyph's path numbers get nudged by a seeded pseudo-random offset
 * to produce frames 2 and 3. Deterministic, so it doesn't change between
 * renders or between server and client.
 *
 * Each glyph also boils on its own slightly offset clock, so a word
 * ripples instead of pulsing in lockstep. That detail is most of why
 * this reads as drawn rather than as a jittering SVG.
 */

import React, { useId, useMemo } from "react";

/* ------------------------------------------------------------------ */
/* Glyphs                                                              */
/* ------------------------------------------------------------------ */

type Glyph = { d: string; adv: number };

export const GLYPHS: Record<string, Glyph> = {
  A: { d: "M1 42 C4 29 7 15 10 2 C13 15 16 29 19 42 M4.5 29 C8 28 12 28 15.5 29", adv: 22 },
  B: { d: "M0 2 C0 16 0 28 0 42 M0 2 C10 2 16 5 16 12 C16 18 10 22 0 22 M0 22 C11 22 18 26 18 32 C18 38 11 42 0 42", adv: 22 },
  C: { d: "M20 9 C16 3 8 1 4 7 C0 14 0 30 4 37 C8 43 16 41 20 35", adv: 22 },
  D: { d: "M0 2 C0 16 0 28 0 42 M0 2 C12 2 19 9 19 22 C19 35 12 42 0 42", adv: 22 },
  E: { d: "M0 2 C0 16 0 28 0 42 M0 2 C6 1.5 13 2 18 3 M0 22 C5 21 10 21 15 22 M0 42 C6 41 13 41 18 42", adv: 20 },
  F: { d: "M0 2 C0 16 0 28 0 42 M0 2 C6 1.5 13 2 18 3 M0 22 C5 21 10 21 15 22", adv: 20 },
  G: { d: "M20 9 C16 3 8 1 4 7 C0 14 0 30 4 37 C9 43 18 41 20 33 C20 30 20 27 20 25 C17 25 14 25 12 25", adv: 23 },
  H: { d: "M0 2 C0 16 0 28 0 42 M18 2 C18 16 18 28 18 42 M0 22 C6 21 12 21 18 22", adv: 21 },
  I: { d: "M2 2 C2 16 2 28 2 42", adv: 8 },
  J: { d: "M14 2 C14 14 14 26 14 34 C14 41 8 44 3 40 C1 38 0 36 0 34", adv: 17 },
  K: { d: "M0 2 C0 16 0 28 0 42 M17 2 C11 10 5 18 1 23 C6 29 12 36 17 42", adv: 20 },
  L: { d: "M0 2 C0 16 0 28 0 42 C6 41 12 41 17 42", adv: 20 },
  M: { d: "M0 42 C0.5 29 1.5 15 2.5 2 C7 11 12 20 16 27 C20 20 25 11 29.5 2 C30.5 15 31.3 29 31.5 42", adv: 34 },
  N: { d: "M0 42 C0.5 29 0.5 15 1 2 C7 15 13 28 18 40 C18.5 27 18.5 14 19 2", adv: 22 },
  O: { d: "M13 2 C22 2 27 11 27 22 C27 33 22 42 13 42 C4 42 0 33 0 22 C0 11 4 2 13 2 Z", adv: 30 },
  P: { d: "M0 2 C0 16 0 28 0 42 M0 2 C11 1.5 18 4.5 18 11 C18 17 11 21 0 22", adv: 21 },
  Q: { d: "M13 2 C22 2 27 11 27 22 C27 33 22 42 13 42 C4 42 0 33 0 22 C0 11 4 2 13 2 Z M17 33 C20 37 23 41 25 45", adv: 30 },
  R: { d: "M0 2 C0 16 0 28 0 42 M0 2 C11 1.5 18 4.5 18 11 C18 17 11 21 0 22 C6 22 10 26 13 31 C15 35 17 39 19 42", adv: 22 },
  S: { d: "M18 8 C15 3 7 1 3 5 C-1 10 2 17 9 20 C16 23 20 28 18 35 C16 41 7 43 2 38", adv: 21 },
  T: { d: "M0 2 C6 1 12 1 18 2 M9 2 C9.3 16 9 28 8.8 42", adv: 20 },
  U: { d: "M0 2 C0 14 0 26 0 32 C0 39 5 43 10 43 C15 43 20 39 20 32 C20 26 20 14 20 2", adv: 23 },
  V: { d: "M0 2 C3 15 7 29 10 42 C13 29 17 15 20 2", adv: 23 },
  W: { d: "M0 2 C2 15 5 29 7 42 C9.5 31 12 20 14 11 C16 20 18.5 31 21 42 C23 29 26 15 28 2", adv: 31 },
  X: { d: "M0 2 C6 15 13 29 19 42 M19 2 C13 15 6 29 0 42", adv: 22 },
  Y: { d: "M0 2 C3 9 7 17 10 23 C13 17 17 9 20 2 M10 23 C10 30 10 36 10 42", adv: 23 },
  Z: { d: "M0 2 C6 1 12 1 18 2 C12 15 6 29 0 42 C6 41 12 41 18 42", adv: 21 },

  "0": { d: "M10 2 C17 2 21 11 21 22 C21 33 17 42 10 42 C3 42 -1 33 -1 22 C-1 11 3 2 10 2 Z", adv: 24 },
  "1": { d: "M2 8 C4 6 7 4 9 2 C9.3 16 9 28 8.8 42", adv: 15 },
  "2": { d: "M0 8 C2 3 8 1 13 3 C18 5 19 12 15 18 C11 24 5 32 0 42 C6 41 13 41 18 42", adv: 21 },
  "3": { d: "M0 5 C5 1 13 1 16 6 C19 11 14 18 8 20 C15 20 20 25 19 32 C18 39 9 44 2 39", adv: 22 },
  "4": { d: "M14 42 C14 29 14 15 14 2 C9 12 5 22 0 31 C6 31 12 31 19 31", adv: 22 },
  "5": { d: "M17 2 C11 2 6 2 2 2 C1.5 10 1 16 1 21 C6 18 13 19 16 24 C19 29 17 37 11 40 C7 42 3 41 1 38", adv: 21 },
  "6": { d: "M17 5 C13 1 7 2 4 8 C1 14 0 26 2 33 C4 40 12 44 16 38 C20 32 17 24 10 24 C6 24 3 27 2 31", adv: 21 },
  "7": { d: "M0 2 C6 1 12 1 18 2 C14 15 10 29 7 42", adv: 20 },
  "8": { d: "M9 2 C14 2 17 6 17 10 C17 15 12 19 9 20 C5 21 0 25 0 31 C0 37 4 42 9 42 C14 42 18 37 18 31 C18 25 13 21 9 20 C6 19 1 15 1 10 C1 6 4 2 9 2 Z", adv: 21 },
  "9": { d: "M3 39 C7 43 13 42 16 36 C19 30 20 18 18 11 C16 4 8 0 4 6 C0 12 3 20 10 20 C14 20 17 17 18 13", adv: 21 },

  ".": { d: "M2 40 L2.2 41.5", adv: 10 },
  ",": { d: "M2 39 C2.5 42 2 45 0.5 47", adv: 10 },
  "-": { d: "M0 24 C4 23 9 23 13 24", adv: 17 },
  "!": { d: "M2 2 C2.3 14 2 22 1.8 30 M2 39 L2.2 40.5", adv: 10 },
  "?": { d: "M0 8 C2 3 8 1 12 3 C16 5 17 11 13 15 C10 18 8 21 8 27 M8 39 L8.2 40.5", adv: 18 },
  "'": { d: "M2 2 C2.3 6 2 9 1.8 12", adv: 8 },
  ":": { d: "M2 18 L2.2 19.5 M2 38 L2.2 39.5", adv: 10 },
  " ": { d: "", adv: 14 },
};

/* ------------------------------------------------------------------ */
/* Boil generation                                                     */
/* ------------------------------------------------------------------ */

/** Deterministic PRNG. Same seed, same number, forever. Keeps SSR and client in sync. */
function seeded(seed: number): number {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Nudges every number in a path by up to ±amount. This is how the second
 * and third boil frames get made without hand-drawing 100 more glyphs.
 * 0.7 is the sweet spot — below 0.4 you can't see it, above 1.2 the
 * letterforms start to come apart.
 */
export function jitterPath(d: string, seed: number, amount = 0.7): string {
  let i = 0;
  return d.replace(/-?\d*\.?\d+/g, (m) => {
    const n = parseFloat(m);
    const off = (seeded(seed * 977 + i++) - 0.5) * 2 * amount;
    return (n + off).toFixed(2);
  });
}

const CSS = `
.tmpt{--tmpt-cycle:.99s}
.tmpt-g path{animation:tmpt-boil var(--tmpt-cycle) steps(1) infinite}
@keyframes tmpt-boil{0%,33.2%{opacity:1}33.3%,100%{opacity:0}}
@media (prefers-reduced-motion:reduce){
.tmpt-g path{animation:none}
.tmpt-g path:nth-child(n+2){display:none}
}`;

/* ------------------------------------------------------------------ */
/* TempoText                                                           */
/* ------------------------------------------------------------------ */

export function TempoText({
  children,
  height = 40,
  boil = false,
  tracking = 8,
  strokeWidth = 4.5,
  className,
}: {
  children: string;
  /** Cap height in px. Below 20 this is unreadable — use a real typeface. */
  height?: number;
  boil?: boolean;
  /** Extra space between glyphs, in glyph units. 8 matches the wordmark. */
  tracking?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const id = useId();
  const text = children.toUpperCase();

  const { chars, width } = useMemo(() => {
    let x = 0;
    const out: Array<{ ch: string; x: number; d: string }> = [];
    for (const ch of text) {
      const g = GLYPHS[ch] ?? GLYPHS[" "];
      if (g.d) out.push({ ch, x, d: g.d });
      x += g.adv + tracking;
    }
    return { chars: out, width: Math.max(0, x - tracking) };
  }, [text, tracking]);

  const scale = height / 40;
  const vbW = width + 6;

  return (
    <svg
      className={`tmpt block ${className ?? ""}`}
      viewBox={`-3 -3 ${vbW} 52`}
      // Prefer parent width on narrow phones; aspect-ratio keeps height in
      // lockstep when max-width clamps (Safari won't from viewBox alone).
      style={{
        width: vbW * scale,
        maxWidth: "100%",
        height: "auto",
        aspectRatio: `${vbW} / 52`,
      }}
      preserveAspectRatio="xMinYMid meet"
      fill="none"
      role="img"
      aria-label={children}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <g
        stroke="currentColor"
        strokeWidth={`calc(${strokeWidth}px * var(--tempo-weight, 1))`}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {chars.map((c, i) => (
          <g key={`${id}-${i}`} transform={`translate(${c.x} 0)`} className={boil ? "tmpt-g" : undefined}>
            <path d={c.d} style={boil ? { animationDelay: `${-i * 0.05}s` } : undefined} />
            {boil && (
              <>
                <path d={jitterPath(c.d, i * 3 + 1)} style={{ animationDelay: `${-0.33 - i * 0.05}s` }} />
                <path d={jitterPath(c.d, i * 3 + 2)} style={{ animationDelay: `${-0.66 - i * 0.05}s` }} />
              </>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Demo                                                                */
/* ------------------------------------------------------------------ */

export default function TempoTypeSpecimen() {
  return (
    <div
      style={{
        color: "#1B1B19",
        background: "#F7F4ED",
        minHeight: "100vh",
        padding: 64,
        display: "flex",
        flexDirection: "column",
        gap: 40,
        alignItems: "flex-start",
      }}
    >
      <TempoText height={44}>Abcdefghijklm</TempoText>
      <TempoText height={44}>Nopqrstuvwxyz</TempoText>
      <TempoText height={44}>0123456789</TempoText>
      <TempoText height={56} boil>
        Nothing on today
      </TempoText>
      <TempoText height={32} boil>
        Good morning, Axel
      </TempoText>
    </div>
  );
}
