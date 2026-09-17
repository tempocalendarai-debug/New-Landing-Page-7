"use client";

/**
 * Ink primitives
 * ------------------------------------------------------------------
 * Shared foundation for anything drawn in the Tempo hand style.
 *
 * The important one is InkCard. Its border is generated from the card's
 * measured size on every resize, so a card can be any height and the
 * wobble still looks drawn rather than stretched. A fixed SVG path
 * scaled to fit would distort the corners and thin the long edges.
 *
 * Everything random is seeded off a stable string. Never Math.random() —
 * a border that reshapes on re-render reads as a bug, not as handwork.
 *
 * context-note.tsx has its own copies of hashId/wobblyRect/useSize from
 * before this file existed. Safe to leave, or slim it down to import
 * from here. Not urgent either way.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Seeded randomness                                                   */
/* ------------------------------------------------------------------ */

export function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function seeded(seed: number): number {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Seeded value in [-range, range]. */
export const wob = (seed: number, i: number, range: number) =>
  (seeded(seed * 131 + i) - 0.5) * 2 * range;

/* ------------------------------------------------------------------ */
/* Generated border                                                    */
/* ------------------------------------------------------------------ */

/**
 * Rounded rectangle whose edges sag slightly. One cubic per edge with both
 * control points nudged; corners stay clean, because jittering those reads
 * as damage rather than as a hand-drawn line.
 */
export function wobblyRect(
  w: number,
  h: number,
  seed: number,
  r = 12,
  amp = 1.7,
  pad = 4
): string {
  const x0 = pad;
  const y0 = pad;
  const x1 = w - pad;
  const y1 = h - pad;
  const t = (i: number) => wob(seed, i, amp);

  return [
    `M${x0 + r} ${y0 + t(1)}`,
    `C${x0 + w * 0.33} ${y0 + t(2)} ${x0 + w * 0.66} ${y0 + t(3)} ${x1 - r} ${y0 + t(4)}`,
    `Q${x1} ${y0} ${x1 + t(5)} ${y0 + r}`,
    `C${x1 + t(6)} ${y0 + h * 0.33} ${x1 + t(7)} ${y0 + h * 0.66} ${x1 + t(8)} ${y1 - r}`,
    `Q${x1} ${y1} ${x1 - r} ${y1 + t(9)}`,
    `C${x0 + w * 0.66} ${y1 + t(10)} ${x0 + w * 0.33} ${y1 + t(11)} ${x0 + r} ${y1 + t(12)}`,
    `Q${x0} ${y1} ${x0 + t(13)} ${y1 - r}`,
    `C${x0 + t(14)} ${y0 + h * 0.66} ${x0 + t(15)} ${y0 + h * 0.33} ${x0 + t(16)} ${y0 + r}`,
    `Q${x0} ${y0} ${x0 + r} ${y0 + t(1)}`,
    "Z",
  ].join(" ");
}

/**
 * Tracks an element's border box. contentRect would exclude padding and
 * the border would end up drawn at the wrong size.
 */
export function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0];
      const w = box ? box.inlineSize : entry.contentRect.width;
      const h = box ? box.blockSize : entry.contentRect.height;
      // Round or sub-pixel reflow re-renders forever.
      setSize({ w: Math.round(w), h: Math.round(h) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
}

/* ------------------------------------------------------------------ */
/* InkCard                                                             */
/* ------------------------------------------------------------------ */

export function InkCard({
  seed,
  children,
  tape = false,
  tilt = false,
  padding = "20px 22px",
  radius = 12,
  className,
  style,
}: {
  /** Stable string. Drives the wobble, the tilt and the tape. */
  seed: string;
  children: React.ReactNode;
  tape?: boolean;
  /** Notes tilt. Cards in a feed shouldn't — it makes text harder to scan. */
  tilt?: boolean;
  padding?: string;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const n = useMemo(() => hashId(seed), [seed]);
  const [ref, size] = useSize<HTMLDivElement>();

  const d = useMemo(
    () => (size.w && size.h ? wobblyRect(size.w, size.h, n, radius) : ""),
    [size.w, size.h, n, radius]
  );

  return (
    <div
      className={className}
      style={{
        position: "relative",
        transform: tilt ? `rotate(${wob(n, 91, 1.5)}deg)` : undefined,
        ...style,
      }}
    >
      {tape && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -8,
            left: `${24 + seeded(n * 131 + 93) * 52}%`,
            width: 58,
            height: 17,
            background: "var(--ink-tape, #D9CFBE)",
            opacity: 0.62,
            borderRadius: 1,
            transform: `translateX(-50%) rotate(${wob(n, 92, 7)}deg)`,
            zIndex: 2,
          }}
        />
      )}

      <div ref={ref} style={{ position: "relative", padding }}>
        {d && (
          <svg
            aria-hidden="true"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            fill="none"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <path
              d={d}
              fill="var(--ink-card, #FFFDF8)"
              stroke="var(--ink-line, #1B1B19)"
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
          </svg>
        )}
        <div style={{ position: "relative" }}>{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ink glyphs — emoji replacements                                     */
/* ------------------------------------------------------------------ */

export const GLYPH_PATHS = {
  moon: "M7 1 C3 3 1 6 1 10 C1 15 5 19 10 19 C13 19 16 17 17 15 C12 16 7 12 7 8 C7 5 7 3 7 1 Z",
  sun: "M10 4 C15 4 19 8 19 13 C19 18 15 22 10 22 C5 22 1 18 1 13 C1 8 5 4 10 4 Z M10 0 L10 -3 M10 26 L10 29 M23 13 L26 13 M-3 13 L-6 13 M19 4 L21 2 M-1 24 L-3 26",
  book: "M1 3 C5 1 10 1 13 3 C16 1 21 1 25 3 L25 17 C21 15 16 15 13 17 C10 15 5 15 1 17 Z M13 3 L13 17",
  clock: "M11 2 C16 2 20 6 20 11 C20 16 16 20 11 20 C6 20 2 16 2 11 C2 6 6 2 11 2 Z M11 6 L11 11 L15 13",
  person: "M10 3 C13 3 15 5 15 8 C15 11 13 13 10 13 C7 13 5 11 5 8 C5 5 7 3 10 3 Z M2 22 C3 17 6 15 10 15 C14 15 17 17 18 22",
  mail: "M1 4 L23 4 L23 20 L1 20 Z M1 4 L12 13 L23 4",
} as const;

export type InkGlyphName = keyof typeof GLYPH_PATHS;

export function InkGlyph({ name, size = 18 }: { name: InkGlyphName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-7 -4 34 34" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        d={GLYPH_PATHS[name]}
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Shared palette                                                      */
/* ------------------------------------------------------------------ */

/** Put this on a page wrapper. Dark values go in a .dark override. */
export const inkTheme: React.CSSProperties = {
  ["--ink-paper" as string]: "#F7F4ED",
  ["--ink-card" as string]: "#FFFDF8",
  ["--ink-line" as string]: "#1B1B19",
  ["--ink-muted" as string]: "#9A9186",
  ["--ink-rule" as string]: "#DDD4C4",
  ["--ink-tape" as string]: "#D9CFBE",
  ["--ink-fluoro" as string]: "#F27E63",
};

/* ------------------------------------------------------------------ */
/* InkSkeleton                                                         */
/* ------------------------------------------------------------------ */

/**
 * Loading state in the brand's own hand.
 *
 * The app's skeletons were grey `animate-pulse` bars left over from the
 * pre-brand UI, and they stood in for cards that arrive as hand-drawn InkCards.
 * The substitution is what reads as broken: a pulsing rectangle resolving into a
 * wobbling ink card looks like two different apps handing off to each other.
 *
 * This reuses the exact stroke and the exact dash animation as the draft sheet's
 * "Tempo is writing" state, so a loading card and a card being written look like
 * the same thing happening, because they are: something arriving in ink.
 *
 * Uneven line lengths on purpose. Four identical bars read as a loader; uneven
 * ones read as prose, which is what is actually coming.
 */
const SKELETON_CSS = `
.ink-skel-line{stroke-dasharray:900;stroke-dashoffset:900;animation:ink-skel-write 2.6s ease-out infinite}
@keyframes ink-skel-write{
0%{stroke-dashoffset:900}
45%{stroke-dashoffset:0}
75%{stroke-dashoffset:0;opacity:1}
100%{stroke-dashoffset:0;opacity:0}
}
@media (prefers-reduced-motion:reduce){
.ink-skel-line{animation:none;stroke-dashoffset:0;opacity:.45}
}`;

/** One line of handwriting: a flat wave, 16 units per crest. */
function skeletonStroke(x: number, y: number, width: number): string {
  const units = Math.max(1, Math.round(width / 16));
  return `M${x} ${y}` + " c5 -3.5 11 3.5 16 0".repeat(units);
}

export function InkSkeleton({
  /** Stable string, so the card's wobble does not change between frames. */
  seed = "skeleton",
  lines = [520, 470, 300],
  /**
   * Drop the card shell. Set this where the skeleton stands in for content that
   * is NOT a card - the briefing sits in its own aurora shell, so drawing an ink
   * card inside it nests two surfaces that the loaded state never has.
   */
  bare = false,
  className,
}: {
  seed?: string;
  lines?: number[];
  bare?: boolean;
  className?: string;
}) {
  const Shell = bare ? BareSkeletonShell : InkCard;
  return (
    <Shell seed={seed} padding="20px 22px" className={className}>
      <style dangerouslySetInnerHTML={{ __html: SKELETON_CSS }} />
      <svg
        width="100%"
        height={lines.length * 30}
        viewBox={`0 0 560 ${lines.length * 30}`}
        preserveAspectRatio="xMinYMin meet"
        fill="none"
        role="status"
        aria-label="Loading"
      >
        <g
          stroke="var(--ink-muted, #9A9186)"
          strokeWidth={2.1}
          strokeLinecap="round"
        >
          {lines.map((w, i) => (
            <path
              key={i}
              className="ink-skel-line"
              style={{ animationDelay: `${i * 0.28}s` }}
              d={skeletonStroke(2, 16 + i * 30, w)}
            />
          ))}
        </g>
      </svg>
    </Shell>
  );
}

/** Same padding contract as InkCard, no border. */
function BareSkeletonShell({
  children,
  padding,
  className,
}: {
  seed: string;
  children: React.ReactNode;
  padding?: string;
  className?: string;
}) {
  return (
    <div className={className} style={{ padding, paddingLeft: 0, paddingRight: 0 }}>
      {children}
    </div>
  );
}
