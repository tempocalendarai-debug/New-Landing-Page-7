"use client";

/**
 * Tempo brand animation kit
 * ------------------------------------------------------------------
 * Hand-drawn ink character + logo system. Everything here is SVG paths
 * and CSS keyframes. No dependencies, no Lottie, no Rive.
 *
 * Exports:
 *   <TempoMark />        static logo, never animates, use for app icon / favicon
 *   <TempoWordmark />    hand-lettered "TEMPO", optionally boiling
 *   <TempoAgent />       the character, 8 states
 *   <TempoSplash />      loading sequence: mark draws, splits into the agent's eyes, wordmark fades in
 *   <TempoInlineLoader />  small spinner replacement (agent stuck in "thinking")
 *
 * Colour: everything strokes with `currentColor`, so set `color` on a
 * parent and the whole system follows. The head needs an opaque fill so
 * the headphone band passes behind it — that comes from --tempo-paper.
 *
 *   .light { color: #1B1B19; --tempo-paper: #F7F4ED; }
 *   .dark  { color: #F0ECE1; --tempo-paper: #1A1917; --tempo-weight: 0.87; }
 *
 * --tempo-weight scales every stroke. Light-on-dark lines bloom optically,
 * so dark mode wants ~0.87 or the character looks fatter than it does on paper.
 *
 * "Boil" = the wobble. Three slightly different drawings of the same shape,
 * swapped on a loop. It is the single thing that makes this feel hand-drawn.
 * Rate is per-state and set by --tempo-boil.
 */

import React, { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

/** The logo. Two halves of an hourglass. */
const MARK_TOP =
  "M20 16 C36 23 64 23 80 16 C70 29 57 42 50 50 C43 42 30 29 20 16 Z";
const MARK_BOTTOM =
  "M20 84 C36 77 64 77 80 84 C70 71 57 58 50 50 C43 58 30 71 20 84 Z";
const MARK_FULL = `${MARK_TOP} ${MARK_BOTTOM}`;

/** Headphone band, 3 boil frames. Deliberately lopsided — right cup sits lower. */
export const BAND = [
  "M20 24 C20 7 33 2 50 2 C67 2 80 10 80 28",
  "M19 25 C21 8 32 3 50 2.5 C68 2 81 11 80.5 27",
  "M20.5 23 C19 6 34 2.5 49.5 3 C67 1.5 79 9 79.5 29",
];

/** Head, 3 boil frames. Slightly wider than tall so it reads drawn, not geometric. */
export const HEAD = [
  "M50 12 C67 12 75 22 75 34 C75 47 65 56 50 56 C35 56 25 47 25 34 C25 22 33 12 50 12 Z",
  "M51 11 C68 13 76 23 74 35 C74 48 64 57 50 55 C34 57 26 46 26 33 C26 21 34 11 51 11 Z",
  "M49 13 C66 11 74 23 76 33 C76 48 66 55 50 57 C36 55 24 48 26 34 C24 23 32 13 49 13 Z",
];

/** Earcups, 3 boil frames. Drawn last, filled with paper, so they sit on top of the head. */
export const CUPS = [
  "M20 24 C25 24 27 28 27 33 C27 38 25 42 20 42 C15 42 13 38 13 33 C13 28 15 24 20 24 Z M80 28 C85 28 87 32 87 37 C87 42 85 46 80 46 C75 46 73 42 73 37 C73 32 75 28 80 28 Z",
  "M20.5 23.5 C25.5 24.5 27.5 28 27 33.5 C27 38 25.5 42.5 20 42 C15 42.5 12.5 37.5 13.5 32.5 C13 28 15.5 23.5 20.5 23.5 Z M80.5 27.5 C85 28.5 87.5 32 87 37.5 C87 42 85 46.5 80 46 C74.5 46.5 72.5 41.5 73.5 36.5 C73 32 75.5 27.5 80.5 27.5 Z",
  "M19.5 24.5 C25 23.5 26.5 28.5 27.5 33 C27.5 38.5 24.5 41.5 20.5 42.5 C15.5 41.5 13.5 38.5 12.5 33.5 C13.5 27.5 15.5 24.5 19.5 24.5 Z M79.5 28.5 C84.5 27.5 86.5 32.5 87.5 37 C87.5 42.5 84.5 45.5 80.5 46.5 C75.5 45.5 73.5 42.5 72.5 37.5 C73.5 31.5 75.5 28.5 79.5 28.5 Z",
];

/** Mitten hand. Positioned per state. No body — hands float. */
export const HAND =
  "M7 1 C11 1 14 4 14 8 C14 12 11 15 7 15 C4 15 1.8 13.4 0.8 11 C-1 10.6 -1.8 8.6 -0.9 7.2 C-0.2 6 1 5.8 2 6.2 C2.2 3.2 4.2 1 7 1 Z";

/** Hand-lettered TEMPO, 3 boil frames. Cap height 40, total width 205. */
const WORDMARK = [
  "M0 3 C10 1.5 20 1.5 30 3 M15 3 C15.5 16 15 30 14.8 42 M43 3 C42.5 16 43 30 43.5 42 M43 3 C53 1.6 62 2 70 3 M43.4 22.5 C51 21.4 58 21.6 64.5 22.4 M43.5 42 C53 40.7 62 41 70.5 42 M83 42 C83.5 29 84.5 15 85.5 3 C91 11 96.5 19 101 26 C106 19 111.5 11 117 3 C118 15 118.8 29 119 42 M132 3 C132.5 16 132 30 132.2 42 M132 3 C143 2.5 154 4.5 157.5 10 C160 15.5 152 21 132.6 22.5 M188 2 C198 2 205 11 205 22 C205 33 198 42 188 42 C178 42 171 33 171 22 C171 11 178 2 188 2 Z",
  "M1 2 C11 2 21 1 31 2.5 M15.5 2.5 C15 16 15.5 30 14.3 42.5 M43.5 2.5 C43 16 42.5 30 43 42.5 M43.5 2.5 C53.5 2 62.5 1.5 70.5 2.5 M43 22 C51.5 22 58.5 21 65 22 M43 41.5 C53.5 41.5 62.5 40.5 71 41.5 M83.5 41.5 C83 29 85 15 86 2.5 C91.5 10.5 97 19.5 101.5 26.5 C106.5 19.5 112 10.5 117.5 2.5 C118.5 15 119.3 29 119.5 41.5 M132.5 2.5 C132 16 132.5 30 131.7 41.5 M132.5 2.5 C143.5 2 154.5 5 158 10.5 C160.5 16 152.5 21.5 133 22 M188.5 1.5 C198.5 2.5 205.5 11 205.5 22.5 C205.5 33 198.5 41.5 188 41.5 C178.5 42 170.5 33.5 170.5 21.5 C170.5 10.5 178.5 1.5 188.5 1.5 Z",
  "M0.5 3.5 C10.5 2 20.5 2.5 30.5 1.8 M14.6 3 C15 16 14.6 30 15.2 41.6 M43.2 3.5 C43.5 16 43.2 30 42.8 41.6 M43.2 3.5 C53.2 2.5 62.2 3 70.2 1.8 M43.8 23 C51.2 22 58.8 22.5 64.8 21.8 M43.8 42.4 C53.2 41 62.2 41.5 70.8 40.8 M82.8 42.4 C84 29 84 15 85 3.4 C91.3 11.5 96 18.5 101.2 25.5 C105.6 18.5 111 11.5 116.6 3.4 C117.6 15 118.5 29 118.8 42.4 M131.7 3.4 C132.8 16 131.7 30 132.5 42.4 M131.7 3.4 C143.2 3 153.6 4 157 9.5 C159.6 15 151.6 20.5 132.2 23 M187.6 2.5 C197.6 1.5 204.6 10.5 204.5 21.5 C204.5 32.5 197.6 42.5 188.5 42.5 C177.6 41.5 171.5 32.5 171.5 22.5 C171.5 11.5 177.6 2.5 187.6 2.5 Z",
];

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

export type TempoState =
  | "asleep"
  | "idle"
  | "listening"
  | "thinking"
  | "foundIt"
  | "headsUp"
  | "sorry"
  | "niceOne"
  /** Context easter egg — one eye closed. */
  | "wink"
  /** Agents coordination — holding / passing a note. */
  | "passingNote";

type Face = {
  brows: [string, string];
  eyes: [string, string];
  /** Hand positions. Empty means no hands — hands signal "doing something". */
  hands: Array<{ x: number; y: number }>;
  /** Seconds per boil frame. Lower = more agitated. */
  boil: number;
  extras?: "notes" | "arcs" | "zzz" | "noteCard";
};

const FACES: Record<TempoState, Face> = {
  asleep: {
    brows: ["M35 24 C38 23 42 23 45.5 24", "M54.5 24 C57.5 23 61.5 23 64.5 24"],
    eyes: ["M36 34 C39 39 44 39 47 34", "M54 35 C57 40 62 40 65 35"],
    hands: [],
    boil: 0.6,
    extras: "zzz",
  },
  idle: {
    // Soft friendly resting face — raised brows, calm eyes. Music notes stay.
    brows: ["M35 20 C38 17.5 42 17.5 45.5 19.5", "M54.5 19.5 C57.5 17.5 61.5 17.5 64.5 20"],
    eyes: ["M41 29 L41 41", "M59.5 30 L59.5 42"],
    hands: [],
    boil: 0.33,
    extras: "notes",
  },
  listening: {
    brows: ["M35 20 C38 17 42 17 45.5 19.5", "M54.5 19 C57.5 17 61.5 17 64.5 19.5"],
    eyes: ["M41 29 L41 41", "M59.5 30 L59.5 42"],
    hands: [],
    boil: 0.33,
    extras: "arcs",
  },
  thinking: {
    // Curious tilt — one brow slightly higher, never a scowl.
    brows: ["M35 19 C38 16.5 42 16.5 45.5 19", "M54.5 20.5 C57.5 19 61.5 19 64.5 20.5"],
    eyes: ["M41 29 L41 41", "M59.5 30 L59.5 42"],
    hands: [{ x: 52, y: 50 }],
    boil: 0.18,
  },
  foundIt: {
    brows: ["M35 20 C38 16.5 42 16.5 45.5 20", "M54.5 20 C57.5 16.5 61.5 16.5 64.5 20"],
    eyes: ["M36 40 C39 33 44 33 47 40", "M54 41 C57 34 62 34 65 41"],
    hands: [{ x: 76, y: 6 }],
    boil: 0.33,
  },
  headsUp: {
    // Friendly peek — soft raised brows + slight smile eyes, never an angry V.
    brows: ["M35 20 C38 17 42 17 45.5 19.5", "M54.5 19.5 C57.5 17 61.5 17 64.5 20"],
    eyes: ["M41 29 L41 41", "M59.5 30 L59.5 42"],
    hands: [{ x: 78, y: 10 }],
    boil: 0.33,
  },
  sorry: {
    // Soft concern, not a frown-scowl — brows stay gentle.
    brows: ["M35 21 C38 19.5 42 19 45.5 20", "M54.5 20 C57.5 19 61.5 19.5 64.5 21"],
    eyes: ["M41 31 L41 40", "M59.5 32 L59.5 41"],
    hands: [{ x: 38, y: 48 }],
    boil: 0.33,
  },
  niceOne: {
    brows: ["M35 19 C38 15.5 42 15.5 45.5 19", "M54.5 19 C57.5 15.5 61.5 15.5 64.5 19"],
    eyes: ["M36 40 C39 33 44 33 47 40", "M54 41 C57 34 62 34 65 41"],
    hands: [
      { x: -1, y: 4 },
      { x: 77, y: 4 },
    ],
    boil: 0.22,
  },
  wink: {
    brows: ["M35 20 C38 17 42 17 45.5 19.5", "M54.5 19 C57.5 16.5 61.5 17 64.5 19.5"],
    // Left eye open (pill), right eye a closed wink curve.
    eyes: ["M41 29 L41 41", "M54 36 C57 32 62 32 65 36"],
    hands: [{ x: 76, y: 8 }],
    boil: 0.4,
  },
  passingNote: {
    brows: ["M35 20 C38 17.5 42 17.5 45.5 19.5", "M54.5 19.5 C57.5 17.5 61.5 17.5 64.5 20"],
    eyes: ["M41 29 L41 41", "M59.5 30 L59.5 42"],
    hands: [{ x: 72, y: 42 }],
    boil: 0.28,
    extras: "noteCard",
  },
};

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const CSS = `
.tmp{--tempo-boil:.33s;color:inherit}
.tmp-boil>path{animation:tmp-boil calc(var(--tempo-boil)*3) steps(1) infinite}
.tmp-boil>path:nth-child(2){animation-delay:calc(var(--tempo-boil)*-1)}
.tmp-boil>path:nth-child(3){animation-delay:calc(var(--tempo-boil)*-2)}
@keyframes tmp-boil{0%,33.2%{opacity:1}33.3%,100%{opacity:0}}
.tmp-jit{transform-box:fill-box;transform-origin:center;animation:tmp-jit calc(var(--tempo-boil)*3) steps(1) infinite}
@keyframes tmp-jit{0%{transform:translate(0,0)}33%{transform:translate(.5px,-.4px)}66%{transform:translate(-.4px,.4px)}100%{transform:translate(0,0)}}
.tmp-blink{transform-box:fill-box;transform-origin:center;animation:tmp-blink 5.2s linear infinite}
@keyframes tmp-blink{0%,88%{transform:scaleY(1)}91%{transform:scaleY(.1)}94%,100%{transform:scaleY(1)}}
.tmp-face{transform-box:fill-box;transform-origin:center;animation:tmp-pop .26s cubic-bezier(.34,1.4,.5,1) both}
@keyframes tmp-pop{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
.tmp-lag{animation:tmp-pop .26s cubic-bezier(.34,1.4,.5,1) both;animation-delay:60ms}
.tmp-note{transform-box:fill-box;transform-origin:center;animation:tmp-note 3s ease-out infinite}
@keyframes tmp-note{0%{opacity:0;transform:translate(0,0) scale(.75)}18%,65%{opacity:1}100%{opacity:0;transform:translate(10px,-16px) scale(1.05)}}
.tmp-arc{transform-box:fill-box;transform-origin:center;animation:tmp-arc 1.8s ease-out infinite}
@keyframes tmp-arc{0%{opacity:0;transform:translateX(-5px)}35%{opacity:1}100%{opacity:0;transform:translateX(5px)}}
.tmp-draw{stroke-dasharray:var(--tmp-len,220);stroke-dashoffset:var(--tmp-len,220);animation:tmp-draw .9s ease-out forwards}
@keyframes tmp-draw{to{stroke-dashoffset:0}}
.tmp-split-l{transform-box:fill-box;transform-origin:center;animation:tmp-split-l .7s cubic-bezier(.5,0,.25,1) .9s both}
@keyframes tmp-split-l{from{transform:translate(0,0) rotate(0) scale(1)}to{opacity:0;transform:translate(-9px,2.5px) rotate(-72deg) scale(.2)}}
.tmp-split-r{transform-box:fill-box;transform-origin:center;animation:tmp-split-r .7s cubic-bezier(.5,0,.25,1) .9s both}
@keyframes tmp-split-r{from{transform:translate(0,0) rotate(0) scale(1)}to{opacity:0;transform:translate(9.5px,-31px) rotate(78deg) scale(.2)}}
.tmp-fade-in{animation:tmp-fade .5s ease-out both}
@keyframes tmp-fade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){
.tmp-boil>path,.tmp-jit,.tmp-blink,.tmp-note,.tmp-arc{animation:none}
.tmp-boil>path:nth-child(2),.tmp-boil>path:nth-child(3){display:none}
.tmp-face,.tmp-lag,.tmp-draw,.tmp-split-l,.tmp-split-r,.tmp-fade-in{animation-duration:.01ms}
}`;

/**
 * Injects the keyframes once, no matter how many components mount.
 *
 * `href` + `precedence` is what makes that true: React dedupes styles by href
 * and hoists them into <head>. It only does that from HTML context though — a
 * <style> rendered inside an <svg> stays put in the SVG namespace and every
 * instance keeps its own copy, so callers render this beside the svg, not in it.
 */
function TempoStyles() {
  return (
    <style href="tempo-brand" precedence="default">
      {CSS}
    </style>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ink = "currentColor";
const paper = "var(--tempo-paper, #F7F4ED)";
const w = (n: number) => `calc(${n}px * var(--tempo-weight, 1))`;

function Boil({
  frames,
  width,
  fill = "none",
}: {
  frames: string[];
  width: number;
  fill?: string;
}) {
  return (
    <g className="tmp-boil" stroke={ink} strokeWidth={w(width)} fill={fill}>
      {frames.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* TempoMark — the static logo. Never animates.                        */
/* ------------------------------------------------------------------ */

export function TempoMark({
  size = 48,
  strokeWidth = 6,
  className,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="10 6 80 88"
      fill="none"
      role="img"
      aria-label="Tempo"
    >
      <path
        d={MARK_FULL}
        stroke={ink}
        strokeWidth={w(strokeWidth)}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* TempoWordmark                                                       */
/* ------------------------------------------------------------------ */

export function TempoWordmark({
  height = 32,
  boil = false,
  strokeWidth = 5,
  className,
}: {
  height?: number;
  /** Static everywhere formal. Boil only in motion pieces. */
  boil?: boolean;
  strokeWidth?: number;
  className?: string;
}) {
  const ratio = 211 / 46;
  return (
    <>
      <TempoStyles />
      <svg
        className={`tmp ${className ?? ""}`}
        width={height * ratio}
        height={height}
        viewBox="-3 -2 211 46"
        fill="none"
        role="img"
        aria-label="Tempo"
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          {boil ? (
            <Boil frames={WORDMARK} width={strokeWidth} />
          ) : (
            <path d={WORDMARK[0]} stroke={ink} strokeWidth={w(strokeWidth)} />
          )}
        </g>
      </svg>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* TempoAgent — the character                                          */
/* ------------------------------------------------------------------ */

export function TempoAgent({
  state = "idle",
  size = 96,
  crop = "full",
  className,
}: {
  state?: TempoState;
  size?: number;
  /** "head" crops tight for small avatars. "full" leaves room for hands and notes. */
  crop?: "full" | "head";
  className?: string;
}) {
  const face = FACES[state];

  // Below ~44px the brows and cups turn to mud. Use <TempoMark /> instead.
  const box = crop === "head" ? "8 -2 84 62" : "-10 -8 136 74";
  const ratio = crop === "head" ? 84 / 62 : 136 / 74;

  return (
    <>
      <TempoStyles />
      <svg
        className={`tmp ${className ?? ""}`}
        width={size * ratio}
        height={size}
        viewBox={box}
        fill="none"
        style={{ ["--tempo-boil" as string]: `${face.boil}s` }}
        role="img"
        aria-label={`Tempo agent, ${state}`}
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Headphones lag the head by 60ms on any state change. This one
              detail does more for "alive" than anything else in the file. */}
          <g className="tmp-lag" key={`band-${state}`}>
            <Boil frames={BAND} width={4.6} />
          </g>

          <Boil frames={HEAD} width={4.4} fill={paper} />

          {/* Face remounts on state change so the pop replays. */}
          <g className="tmp-face" key={state}>
            <g className="tmp-jit" stroke={ink} strokeWidth={w(3.3)}>
              <path d={face.brows[0]} />
              <path d={face.brows[1]} />
            </g>

            <g className={state === "asleep" ? undefined : "tmp-blink"}>
              <g className="tmp-jit" stroke={ink} strokeWidth={w(4.8)}>
                <path d={face.eyes[0]} />
                <path d={face.eyes[1]} />
              </g>
            </g>
          </g>

          <g className="tmp-lag" key={`cups-${state}`}>
            <Boil frames={CUPS} width={4.6} fill={paper} />
          </g>

          <g className="tmp-face" key={`extras-${state}`}>
            {face.hands.map((h, i) => (
              <g key={i} transform={`translate(${h.x} ${h.y})`}>
                <path d={HAND} stroke={ink} strokeWidth={w(3.3)} fill={paper} />
              </g>
            ))}
            {face.extras === "notes" && <Notes />}
            {face.extras === "arcs" && <Arcs />}
            {face.extras === "zzz" && <Zzz />}
            {face.extras === "noteCard" && <NoteCard />}
          </g>
        </g>
      </svg>
    </>
  );
}

/** Idle. Notes drift AWAY from the head — it's humming, not tuned out. */
function Notes() {
  const note = (
    <>
      <path
        d="M0 11.5 C0 9 2 7.5 4.5 7.5 C6.5 7.5 8 8.7 8 10.5 C8 13 6 14.5 3.5 14.5 C1.5 14.5 0 13.3 0 11.5 Z"
        fill={ink}
        stroke={ink}
        strokeWidth={w(2.4)}
      />
      <path d="M8 10.5 L8 0" stroke={ink} strokeWidth={w(2.6)} />
      <path d="M8 0 C11 1 13.5 3 12.5 6.5" stroke={ink} strokeWidth={w(2.6)} />
    </>
  );
  return (
    <>
      <g transform="translate(84 38)">
        <g className="tmp-note">{note}</g>
      </g>
      <g transform="translate(95 27) scale(0.85)">
        <g className="tmp-note" style={{ animationDelay: "-1s" }}>
          <path
            d="M0 13 C0 10.5 2 9 4.5 9 C6.5 9 8 10.2 8 12 C8 14.5 6 16 3.5 16 C1.5 16 0 14.8 0 13 Z"
            fill={ink}
            stroke={ink}
            strokeWidth={w(2.6)}
          />
          <path
            d="M14 11 C14 8.5 16 7 18.5 7 C20.5 7 22 8.2 22 10 C22 12.5 20 14 17.5 14 C15.5 14 14 12.8 14 11 Z"
            fill={ink}
            stroke={ink}
            strokeWidth={w(2.6)}
          />
          <path d="M8 12 L8 1.5" stroke={ink} strokeWidth={w(2.8)} />
          <path d="M22 10 L22 0" stroke={ink} strokeWidth={w(2.8)} />
          <path d="M8 1.5 C13 1.5 18 .6 22 0" stroke={ink} strokeWidth={w(3)} />
        </g>
      </g>
      <g transform="translate(88 18) scale(0.6)">
        <g className="tmp-note" style={{ animationDelay: "-2s" }}>
          {note}
        </g>
      </g>
    </>
  );
}

/** Listening. Arcs arrive — sound coming IN. Never use notes here. */
function Arcs() {
  const arcs = [
    { d: "M92 27 C96 31 96 41 92 45", delay: "0s" },
    { d: "M99 21 C104 28 104 43 99 50", delay: "-0.6s" },
    { d: "M106 15 C112 24 112 46 106 55", delay: "-1.2s" },
  ];
  return (
    <>
      {arcs.map((a) => (
        <g key={a.d}>
          <g className="tmp-arc" style={{ animationDelay: a.delay }}>
            <path d={a.d} stroke={ink} strokeWidth={w(2.8)} />
          </g>
        </g>
      ))}
    </>
  );
}

function Zzz() {
  return (
    <>
      <path d="M84 16 L94 15 L84 23 L95 22" stroke={ink} strokeWidth={w(2.8)} />
      <path d="M94 3 L101 2 L94 8 L102 7" stroke={ink} strokeWidth={w(2.4)} />
    </>
  );
}

/** Agents cameo — a little folded note beside the hand. */
function NoteCard() {
  return (
    <g transform="translate(88 44)" className="tmp-jit">
      <path
        d="M0 2 C0 0.5 1 0 2.5 0 L14 0 C15.5 0 16 0.5 16 2 L16 12 C16 13.5 15.5 14 14 14 L2.5 14 C1 14 0 13.5 0 12 Z"
        stroke={ink}
        strokeWidth={w(2.4)}
        fill={paper}
      />
      <path d="M3 4 L13 4 M3 7 L11 7 M3 10 L9 10" stroke={ink} strokeWidth={w(1.8)} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* TempoSplash — the launch sequence                                   */
/* ------------------------------------------------------------------ */

/**
 * Mark draws itself, splits at the waist, the two halves fly out and become
 * the agent's eyes, wordmark fades in underneath.
 *
 * Total ~2.4s. That's the marketing cut. For an actual app launch screen,
 * pass speed={0.5} — nobody should wait 2.4s to see their calendar.
 */
export function TempoSplash({
  size = 220,
  speed = 1,
  onDone,
  className,
}: {
  size?: number;
  speed?: number;
  onDone?: () => void;
  className?: string;
}) {
  const total = 2400 / speed;

  useEffect(() => {
    if (!onDone) return;
    const t = setTimeout(onDone, total);
    return () => clearTimeout(t);
  }, [onDone, total]);

  const d = (ms: number) => `${ms / speed}ms`;

  return (
    <div
      className={`tmp ${className ?? ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: size * 0.12,
      }}
    >
      <TempoStyles />
      <svg
        width={size}
        height={size * 0.62}
        viewBox="-6 -6 112 70"
        fill="none"
        role="img"
        aria-label="Tempo"
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          <g
            className="tmp-fade-in"
            style={{ animationDelay: d(950), animationDuration: d(500) }}
          >
            <Boil frames={BAND} width={4.6} />
          </g>

          <g
            className="tmp-fade-in"
            style={{ animationDelay: d(1050), animationDuration: d(500) }}
          >
            <Boil frames={HEAD} width={4.4} fill={paper} />
          </g>

          <g
            className="tmp-fade-in"
            style={{ animationDelay: d(1500), animationDuration: d(400) }}
          >
            <g className="tmp-jit" stroke={ink} strokeWidth={w(3.3)}>
              <path d="M35 22 C38 20 42 20 45.5 21.5" />
              <path d="M54.5 21 C57.5 19.5 61.5 20 64.5 21.5" />
            </g>
            <g className="tmp-jit" stroke={ink} strokeWidth={w(4.8)}>
              <path d="M41 29 L41 41" />
              <path d="M59.5 31 L59.5 42" />
            </g>
          </g>

          <g
            className="tmp-fade-in"
            style={{ animationDelay: d(1100), animationDuration: d(500) }}
          >
            <Boil frames={CUPS} width={4.6} fill={paper} />
          </g>

          {/* The mark, drawing itself then splitting into the eye positions. */}
          <g
            className="tmp-split-l"
            style={{ animationDelay: d(900), animationDuration: d(700) }}
          >
            <path
              className="tmp-draw"
              style={{ ["--tmp-len" as string]: 175, animationDuration: d(900) }}
              d={MARK_TOP}
              stroke={ink}
              strokeWidth={w(6)}
            />
          </g>
          <g
            className="tmp-split-r"
            style={{ animationDelay: d(900), animationDuration: d(700) }}
          >
            <path
              className="tmp-draw"
              style={{ ["--tmp-len" as string]: 175, animationDuration: d(900) }}
              d={MARK_BOTTOM}
              stroke={ink}
              strokeWidth={w(6)}
            />
          </g>
        </g>
      </svg>

      <div
        className="tmp-fade-in"
        style={{ animationDelay: d(1750), animationDuration: d(500) }}
      >
        <TempoWordmark height={size * 0.16} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TempoInlineLoader — replaces the orb                                */
/* ------------------------------------------------------------------ */

/**
 * Drop-in replacement for a spinner. The agent thinking IS the loading state.
 *
 * Deliberately does NOT escalate when the wait gets long. Adding motion as
 * time passes reads as the agent panicking and makes people anxious.
 */
export function TempoInlineLoader({ size = 48 }: { size?: number }) {
  // crop="head" is 84×62 (1.36:1). size is height, so 48 → ~65px wide —
  // above the 44×60 floor where brows and cups turn to mud.
  return <TempoAgent state="thinking" size={size} crop="head" />;
}

/* ------------------------------------------------------------------ */
/* Demo                                                                */
/* ------------------------------------------------------------------ */

const ALL: TempoState[] = [
  "asleep",
  "idle",
  "listening",
  "thinking",
  "foundIt",
  "headsUp",
  "sorry",
  "niceOne",
  "wink",
  "passingNote",
];

export default function TempoDemo() {
  const [state, setState] = useState<TempoState>("idle");
  const [dark, setDark] = useState(false);
  const [splash, setSplash] = useState(true);

  const theme = useMemo(
    () =>
      dark
        ? { color: "#F0ECE1", background: "#1A1917", ["--tempo-paper"]: "#1A1917", ["--tempo-weight"]: 0.87 }
        : { color: "#1B1B19", background: "#F7F4ED", ["--tempo-paper"]: "#F7F4ED", ["--tempo-weight"]: 1 },
    [dark]
  ) as React.CSSProperties;

  return (
    <div style={{ ...theme, minHeight: "100vh", padding: 48, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
        <button onClick={() => setDark((v) => !v)}>{dark ? "Paper" : "Ink"}</button>
        <button onClick={() => setSplash(true)}>Replay splash</button>
      </div>

      {splash ? (
        <TempoSplash onDone={() => setSplash(false)} />
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <TempoAgent state={state} size={160} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {ALL.map((s) => (
              <button key={s} onClick={() => setState(s)} style={{ opacity: s === state ? 1 : 0.5 }}>
                {s}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center", justifyContent: "center", marginTop: 48 }}>
            <TempoMark size={44} />
            <TempoWordmark height={28} />
            <TempoInlineLoader />
          </div>
        </>
      )}
    </div>
  );
}
