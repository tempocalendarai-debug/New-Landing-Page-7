"use client";

/**
 * Tempo peeking poses
 * ------------------------------------------------------------------
 * The agent hiding behind a card and gripping its edge. Not a face
 * state — a position. That's why it's a separate component instead of
 * another entry in TempoState.
 *
 * The whole trick is the clip. The character is cut off exactly at the
 * container's edge, and the hands are drawn OUTSIDE that clip so their
 * fingers land on top of the card. Without the hands it looks like a
 * sticker that got cropped. With them it looks like something is
 * actually behind there holding on.
 *
 * REQUIRES four exports added to tempo-agent.tsx. Change:
 *     const BAND = [...]      ->  export const BAND = [...]
 *     const HEAD = [...]      ->  export const HEAD = [...]
 *     const CUPS = [...]      ->  export const CUPS = [...]
 *     const HAND = "..."      ->  export const HAND = "..."
 * Nothing else in that file changes.
 *
 * Usage — the parent must be position:relative:
 *
 *   <div className="relative">
 *     <TempoPeek edge="top" at="72%" />
 *     <CalendarCard />
 *   </div>
 *
 * Use it sparingly. One peek per screen, and never on a screen where
 * someone is trying to concentrate. A character that appears on every
 * card stops being a delight and becomes Clippy.
 */

import React, { useId } from "react";
import { BAND, HEAD, CUPS, HAND } from "./tempo-agent";

const ink = "currentColor";
const paper = "var(--tempo-paper, #F7F4ED)";
const w = (n: number) => `calc(${n}px * var(--tempo-weight, 1))`;

/** Eyes glance toward the edge it's peeking over, not straight ahead. */
const PEEK_BROWS: [string, string] = [
  "M35 20 C38 17.5 42 17.5 45.5 19.5",
  "M54.5 19 C57.5 17 61.5 17.5 64.5 20",
];
const PEEK_EYES: [string, string] = ["M41 28 L41 40", "M59.5 29 L59.5 41"];

const CSS = `
.tmpp{--tmpp-cycle:.99s}
.tmpp-b>path{animation:tmpp-boil var(--tmpp-cycle) steps(1) infinite}
.tmpp-b>path:nth-child(2){animation-delay:-.33s}
.tmpp-b>path:nth-child(3){animation-delay:-.66s}
@keyframes tmpp-boil{0%,33.2%{opacity:1}33.3%,100%{opacity:0}}
.tmpp-in{transform-box:fill-box;transform-origin:bottom center;animation:tmpp-in .42s cubic-bezier(.34,1.35,.5,1) both}
@keyframes tmpp-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@media (prefers-reduced-motion:reduce){
.tmpp-b>path{animation:none}
.tmpp-b>path:nth-child(n+2){display:none}
.tmpp-in{animation-duration:.01ms}
}`;

function Boil({ frames, width, fill = "none" }: { frames: string[]; width: number; fill?: string }) {
  return (
    <g className="tmpp-b" stroke={ink} strokeWidth={w(width)} fill={fill}>
      {frames.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */

export function TempoPeek({
  edge = "top",
  at = "50%",
  size = 96,
  className,
}: {
  /** Which edge of the parent it hides behind. */
  edge?: "top" | "left" | "right";
  /** Position along that edge. Percentage or px. Avoid dead centre, it looks staged. */
  at?: string;
  /** Head width in px. Below 64 the brows disappear and it reads as a blob. */
  size?: number;
  className?: string;
}) {
  const id = useId();
  const clipId = `tmpp-clip-${id.replace(/:/g, "")}`;

  if (edge === "top") {
    // viewBox runs -6..112 across, -4..58 down. Cut line at y=46, so the
    // chin is hidden and the eyes clear the edge with room to spare.
    const VB_H = 62;
    const CUT = 46;
    const px = size / 100; // one glyph unit in px
    const overhang = (VB_H - 4 - CUT) * px;

    return (
      <div
        className={`tmpp ${className ?? ""}`}
        style={{
          position: "absolute",
          left: at,
          bottom: `calc(100% - ${overhang}px)`,
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      >
        <svg
          width={118 * px}
          height={VB_H * px}
          viewBox={`-6 -4 118 ${VB_H}`}
          fill="none"
          role="img"
          aria-label="Tempo agent peeking over"
        >
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <defs>
            <clipPath id={clipId}>
              <rect x="-10" y="-10" width="140" height={CUT + 10} />
            </clipPath>
          </defs>
          <g className="tmpp-in">
            <g clipPath={`url(#${clipId})`} strokeLinecap="round" strokeLinejoin="round">
              <Boil frames={BAND} width={4.6} />
              <Boil frames={HEAD} width={4.4} fill={paper} />
              <g stroke={ink} strokeWidth={w(3.3)} strokeLinecap="round">
                <path d={PEEK_BROWS[0]} />
                <path d={PEEK_BROWS[1]} />
              </g>
              <g stroke={ink} strokeWidth={w(4.8)} strokeLinecap="round">
                <path d={PEEK_EYES[0]} />
                <path d={PEEK_EYES[1]} />
              </g>
              <Boil frames={CUPS} width={4.6} fill={paper} />
            </g>
            {/* Hands live outside the clip. This is the whole illusion. */}
            <g strokeLinecap="round" strokeLinejoin="round">
              <g transform="translate(18 39)">
                <path d={HAND} stroke={ink} strokeWidth={w(3.3)} fill={paper} />
              </g>
              <g transform="translate(68 39)">
                <path d={HAND} stroke={ink} strokeWidth={w(3.3)} fill={paper} />
              </g>
            </g>
          </g>
        </svg>
      </div>
    );
  }

  // Side peek. One eye showing. Cut at x=53 so the far eye stays hidden —
  // two visible eyes reads as "standing next to" rather than "peeking around".
  const CUT_X = 53;
  const VB_W = 66;
  const px = size / 100;
  const overhang = (VB_W - 6 - CUT_X) * px;
  const mirrored = edge === "right";

  return (
    <div
      className={`tmpp ${className ?? ""}`}
      style={{
        position: "absolute",
        top: at,
        [mirrored ? "left" : "right"]: `calc(100% - ${overhang}px)`,
        transform: "translateY(-50%)",
        pointerEvents: "none",
      }}
    >
      <svg
        width={VB_W * px}
        height={66 * px}
        viewBox={`-6 -4 ${VB_W} 66`}
        fill="none"
        role="img"
        aria-label="Tempo agent peeking around"
        style={mirrored ? { transform: "scaleX(-1)" } : undefined}
      >
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <defs>
          <clipPath id={clipId}>
            <rect x="-10" y="-10" width={CUT_X + 10} height="90" />
          </clipPath>
        </defs>
        <g className="tmpp-in">
          <g clipPath={`url(#${clipId})`} strokeLinecap="round" strokeLinejoin="round">
            <Boil frames={BAND} width={4.6} />
            <Boil frames={HEAD} width={4.4} fill={paper} />
            <g stroke={ink} strokeWidth={w(3.3)} strokeLinecap="round">
              <path d={PEEK_BROWS[0]} />
            </g>
            <g stroke={ink} strokeWidth={w(4.8)} strokeLinecap="round">
              <path d={PEEK_EYES[0]} />
            </g>
            <Boil frames={CUPS} width={4.6} fill={paper} />
          </g>
          <g strokeLinecap="round" strokeLinejoin="round">
            <g transform="translate(46 27)">
              <path d={HAND} stroke={ink} strokeWidth={w(3.3)} fill={paper} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Demo                                                                */
/* ------------------------------------------------------------------ */

export default function TempoPeekDemo() {
  const card: React.CSSProperties = {
    position: "relative",
    background: "#FFFDF8",
    border: "1px solid #E3DDCF",
    borderRadius: 14,
    padding: 24,
    width: 320,
  };

  return (
    <div
      style={{
        color: "#1B1B19",
        background: "#F7F4ED",
        minHeight: "100vh",
        padding: 96,
        display: "flex",
        gap: 96,
        fontFamily: "system-ui",
      }}
    >
      <div style={card}>
        <TempoPeek edge="top" at="68%" />
        <p>Today</p>
        <p>9:00 Standup</p>
        <p>14:00 Investor call</p>
      </div>

      <div style={card}>
        <TempoPeek edge="left" at="55%" />
        <p>Your morning</p>
        <p>Three meetings, one conflict.</p>
      </div>
    </div>
  );
}
