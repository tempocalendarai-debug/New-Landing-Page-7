"use client";

/**
 * Context notes
 * ------------------------------------------------------------------
 * Paper cards taped to a wall. Used on the Context page.
 *
 * The border is NOT a fixed SVG path. It's generated from the card's
 * measured size every time that size changes, so the card can be any
 * height and the wobble still looks drawn rather than stretched. This
 * is the whole reason this file is more complicated than a div with a
 * border-radius.
 *
 * Everything random here is seeded off the note's id:
 *   - card tilt (±1.5°)
 *   - tape angle and horizontal position
 *   - the wobble of the border itself
 * So a note looks identical on every render, on every device, forever.
 * If you swap any of this for Math.random() the notes will visibly
 * jiggle on re-render and the page will feel broken.
 *
 * Type split, and it matters:
 *   - Category labels are hand-lettered. Six fixed strings we control.
 *   - Body text is the user's own words in the UI font. Never lettered.
 * The hand face is uppercase-only with a limited glyph set, so user
 * input would silently lose accents and punctuation, and forcing caps
 * on something someone typed in lowercase reads as shouting.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { TempoText } from "./tempo-type";

/* ------------------------------------------------------------------ */
/* Seeded randomness                                                   */
/* ------------------------------------------------------------------ */

export function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function seeded(seed: number): number {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Seeded value in [-range, range]. */
function wob(seed: number, i: number, range: number): number {
  return (seeded(seed * 131 + i) - 0.5) * 2 * range;
}

/* ------------------------------------------------------------------ */
/* The drawn border                                                    */
/* ------------------------------------------------------------------ */

/**
 * Builds a rounded rectangle whose edges sag and bow slightly, like a
 * line drawn freehand against a straightedge.
 *
 * Each edge is one cubic with both control points nudged. Corners stay
 * as clean quadratics — jittering those too makes the card look damaged
 * rather than hand-drawn.
 *
 * `pad` keeps the wobble inside the viewBox so it never clips.
 */
function wobblyRect(w: number, h: number, seed: number, r = 14, amp = 2.1, pad = 5): string {
  const x0 = pad;
  const y0 = pad;
  const x1 = w - pad;
  const y1 = h - pad;
  const iw = x1 - x0;
  const ih = y1 - y0;

  const t = (i: number) => wob(seed, i, amp);

  return [
    `M${x0 + r} ${y0 + t(1)}`,
    `C${x0 + iw * 0.33} ${y0 + t(2)} ${x0 + iw * 0.66} ${y0 + t(3)} ${x1 - r} ${y0 + t(4)}`,
    `Q${x1} ${y0} ${x1 + t(5)} ${y0 + r}`,
    `C${x1 + t(6)} ${y0 + ih * 0.33} ${x1 + t(7)} ${y0 + ih * 0.66} ${x1 + t(8)} ${y1 - r}`,
    `Q${x1} ${y1} ${x1 - r} ${y1 + t(9)}`,
    `C${x0 + iw * 0.66} ${y1 + t(10)} ${x0 + iw * 0.33} ${y1 + t(11)} ${x0 + r} ${y1 + t(12)}`,
    `Q${x0} ${y1} ${x0 + t(13)} ${y1 - r}`,
    `C${x0 + t(14)} ${y0 + ih * 0.66} ${x0 + t(15)} ${y0 + ih * 0.33} ${x0 + t(16)} ${y0 + r}`,
    `Q${x0} ${y0} ${x0 + r} ${y0 + t(1)}`,
    "Z",
  ].join(" ");
}

/** Tracks an element's border box in CSS pixels. */
function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const read = (entry?: ResizeObserverEntry) => {
      // Prefer borderBoxSize (includes padding). Fall back to contentRect,
      // then offsetWidth — some WebKits have reported borderBoxSize in
      // device pixels, which makes a ~2px stroke render as a hairline once
      // the SVG is laid out in CSS pixels.
      const box = entry?.borderBoxSize?.[0];
      let w = box?.inlineSize;
      let h = box?.blockSize;
      if (w == null || h == null || w <= 0 || h <= 0) {
        w = entry?.contentRect.width ?? el.offsetWidth;
        h = entry?.contentRect.height ?? el.offsetHeight;
      }
      if (w > el.offsetWidth * 1.5 || h > el.offsetHeight * 1.5) {
        w = el.offsetWidth;
        h = el.offsetHeight;
      }
      setSize({ w: Math.round(w), h: Math.round(h) });
    };

    const ro = new ResizeObserver(([entry]) => read(entry));
    ro.observe(el, { box: "border-box" });
    read();
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
}

/* ------------------------------------------------------------------ */
/* Ink glyphs — replacements for emoji                                 */
/* ------------------------------------------------------------------ */

const GLYPH_PATHS = {
  moon: "M7 1 C3 3 1 6 1 10 C1 15 5 19 10 19 C13 19 16 17 17 15 C12 16 7 12 7 8 C7 5 7 3 7 1 Z",
  sun: "M10 4 C15 4 19 8 19 13 C19 18 15 22 10 22 C5 22 1 18 1 13 C1 8 5 4 10 4 Z M10 0 L10 -3 M10 26 L10 29 M23 13 L26 13 M-3 13 L-6 13 M19 4 L21 2 M-1 24 L-3 26",
  book: "M1 3 C5 1 10 1 13 3 C16 1 21 1 25 3 L25 17 C21 15 16 15 13 17 C10 15 5 15 1 17 Z M13 3 L13 17",
  clock: "M11 2 C16 2 20 6 20 11 C20 16 16 20 11 20 C6 20 2 16 2 11 C2 6 6 2 11 2 Z M11 6 L11 11 L15 13",
  person: "M10 3 C13 3 15 5 15 8 C15 11 13 13 10 13 C7 13 5 11 5 8 C5 5 7 3 10 3 Z M2 22 C3 17 6 15 10 15 C14 15 17 17 18 22",
} as const;

export type NoteGlyph = keyof typeof GLYPH_PATHS;

function InkGlyph({ name, size = 18 }: { name: NoteGlyph; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-7 -4 34 34"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: 2 }}
    >
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
/* ContextNote                                                         */
/* ------------------------------------------------------------------ */

const BODY_TEXT_STYLE: React.CSSProperties = {
  margin: 0,
  color: "var(--ctx-ink, #1B1B19)",
  fontSize: 17,
  lineHeight: 1.45,
  overflowWrap: "anywhere",
  flex: 1,
  minWidth: 0,
};

const BODY_BUTTON_STYLE: React.CSSProperties = {
  padding: 0,
  border: "none",
  background: "none",
  font: "inherit",
  textAlign: "left",
  cursor: "pointer",
  // Spread after `font` so fontSize / lineHeight win over the shorthand reset.
  ...BODY_TEXT_STYLE,
};

const PILL_STYLE: React.CSSProperties = {
  border: "1.2px solid var(--ctx-rule, #C4B9A8)",
  borderRadius: 999,
  padding: "3px 11px",
  fontSize: 10.5,
  color: "var(--ctx-muted, #8A8175)",
};

function VisibilityPill({
  visibility,
  onClick,
}: {
  visibility: "visible" | "private";
  onClick?: () => void;
}) {
  const label = visibility === "visible" ? "Visible" : "Just me";
  if (!onClick) {
    return <span style={PILL_STYLE}>{label}</span>;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        visibility === "visible"
          ? "Keep this just for you"
          : "Let friends' agents see this"
      }
      style={{
        ...PILL_STYLE,
        background: "transparent",
        cursor: "pointer",
        font: "inherit",
      }}
    >
      {label}
    </button>
  );
}

export type ContextNoteProps = {
  /** Stable id. Drives tilt, tape and wobble — must not change between renders. */
  id: string;
  /** Category. One of the six fixed strings. Rendered hand-lettered. */
  label: string;
  /** The user's own words. Rendered in the UI font, wraps freely. */
  body: string;
  /** Optional detail line, e.g. "weekdays 18:00 to 23:00". */
  meta?: string;
  /** Shown as a pill. */
  visibility?: "visible" | "private";
  glyph?: NoteGlyph;
  /** Tap the body to open / edit. */
  onClick?: () => void;
  /** When set, the visibility pill is a control rather than a label. */
  onVisibilityClick?: () => void;
  /** Optional delete control in the footer. */
  onDelete?: () => void;
};

export function ContextNote({
  id,
  label,
  body,
  meta,
  visibility,
  glyph,
  onClick,
  onVisibilityClick,
  onDelete,
}: ContextNoteProps) {
  const seed = useMemo(() => hashId(id), [id]);
  const [ref, size] = useSize<HTMLDivElement>();

  const tilt = wob(seed, 91, 1.5);
  const tapeAngle = wob(seed, 92, 7);
  const tapeLeft = 24 + seeded(seed * 131 + 93) * 52; // percent

  const border = useMemo(
    () => (size.w && size.h ? wobblyRect(size.w, size.h, seed) : ""),
    [size.w, size.h, seed]
  );

  return (
    <div
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        textAlign: "left",
        transform: `rotate(${tilt}deg)`,
      }}
    >
      {/* Tape — opaque enough to read as masking tape, not a wash. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -10,
          left: `${tapeLeft}%`,
          width: 72,
          height: 22,
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--ctx-tape, #D9CFBE) 88%, #fff) 0%, var(--ctx-tape, #D9CFBE) 45%, color-mix(in srgb, var(--ctx-tape, #D9CFBE) 82%, #8a7a62) 100%)",
          opacity: 0.92,
          borderRadius: 1,
          boxShadow:
            "0 1px 0 color-mix(in srgb, #5c4e3a 18%, transparent), 0 2px 4px color-mix(in srgb, #3a3024 14%, transparent)",
          // Slightly ragged ends so it reads as torn tape, not a UI chip.
          clipPath:
            "polygon(2% 8%, 6% 0%, 94% 3%, 100% 12%, 98% 88%, 93% 100%, 7% 97%, 0% 90%)",
          transform: `translateX(-50%) rotate(${tapeAngle}deg)`,
          zIndex: 2,
        }}
      />

      <div ref={ref} style={{ position: "relative", padding: "20px 22px 18px", overflow: "visible" }}>
        {/* Generated border, sitting behind the content at 1:1 pixel scale
            so the stroke weight never distorts. Fill + stroke are separate
            so the ink line can't get swallowed by the paper fill. */}
        {border && (
          <svg
            aria-hidden="true"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            fill="none"
            style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
          >
            <path d={border} fill="var(--ctx-paper, #FFFDF8)" stroke="none" />
            <path
              d={border}
              fill="none"
              stroke="var(--ctx-ink, #1B1B19)"
              strokeWidth={2.6}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        )}

        <div style={{ position: "relative" }}>
          <div style={{ color: "var(--ctx-muted, #9A9186)", marginBottom: 12 }}>
            <TempoText height={11} tracking={9}>
              {label}
            </TempoText>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            {glyph ? (
              <span style={{ color: "var(--ctx-ink, #1B1B19)" }}>
                <InkGlyph name={glyph} />
              </span>
            ) : null}
            {onClick ? (
              <button type="button" onClick={onClick} style={BODY_BUTTON_STYLE}>
                {body}
              </button>
            ) : (
              <p style={BODY_TEXT_STYLE}>{body}</p>
            )}
          </div>

          {meta || visibility || onDelete ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 14,
              }}
            >
              <span style={{ color: "var(--ctx-muted, #9A9186)", fontSize: 11.5 }}>
                {meta}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {visibility ? (
                  <VisibilityPill
                    visibility={visibility}
                    onClick={onVisibilityClick}
                  />
                ) : null}
                {onDelete ? (
                  <button
                    type="button"
                    onClick={onDelete}
                    aria-label="Delete"
                    className="context-row-delete"
                    style={{
                      border: "none",
                      background: "transparent",
                      padding: 4,
                      cursor: "pointer",
                      color: "var(--ctx-muted, #8A8175)",
                      lineHeight: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : null}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The thread between notes                                            */
/* ------------------------------------------------------------------ */

/**
 * Hand-drawn string running from one note to the next. Unlike a straight
 * rule it actually implies the notes connect, which is the idea behind
 * the page.
 */
export function NoteThread({ flip, seed }: { flip: boolean; seed: number }) {
  const t = (i: number) => wob(seed, i, 3);
  const d = `M${18 + t(1)} 0 C${26 + t(2)} 14 ${44 + t(3)} 20 ${54 + t(4)} 32 C${62 + t(5)} 41 ${58 + t(6)} 44 ${61 + t(7)} 50`;
  return (
    <svg
      aria-hidden="true"
      width={80}
      height={50}
      viewBox="0 0 80 50"
      fill="none"
      style={{
        display: "block",
        marginLeft: flip ? "auto" : undefined,
        marginRight: flip ? 48 : undefined,
        transform: flip ? "scaleX(-1)" : undefined,
        marginTop: -6,
        marginBottom: -6,
      }}
    >
      <path
        d={d}
        stroke="var(--ctx-rule, #C4B9A8)"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* ContextNoteList                                                     */
/* ------------------------------------------------------------------ */

export function ContextNoteList({
  notes,
  stagger = 28,
  onSelect,
}: {
  notes: ContextNoteProps[];
  /** Horizontal offset between alternating notes, in px. 0 turns it off. */
  stagger?: number;
  onSelect?: (id: string) => void;
}) {
  // Past a dozen notes the tilt and the zigzag stop being charming and
  // start being tiring to read. Settle the layout down instead.
  const calm = notes.length > 12;
  const offset = calm ? 0 : stagger;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {notes.map((note, i) => {
        const right = i % 2 === 1;
        return (
          <React.Fragment key={note.id}>
            <div
              style={{
                marginLeft: right ? offset : 0,
                marginRight: right ? 0 : offset,
              }}
            >
              <ContextNote {...note} onClick={onSelect ? () => onSelect(note.id) : undefined} />
            </div>
            {i < notes.length - 1 && !calm && (
              <NoteThread flip={right} seed={hashId(note.id) + i} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Demo                                                                */
/* ------------------------------------------------------------------ */

export default function ContextNotesDemo() {
  const notes: ContextNoteProps[] = [
    {
      id: "n1",
      label: "What's going on",
      body: "building a startup on the side",
      visibility: "private",
      glyph: "book",
    },
    {
      id: "n2",
      label: "When you're free",
      body: "weekends are usually open",
      meta: "weekends 09:00 to 21:00",
      visibility: "visible",
      glyph: "sun",
    },
    {
      id: "n3",
      label: "When you're free",
      body: "free weeknights after 6",
      meta: "weekdays 18:00 to 23:00",
      visibility: "visible",
      glyph: "moon",
    },
    {
      id: "n4",
      label: "How I should sound",
      body: "keep it short and direct, skip the pleasantries, and don't hedge everything. if something's a bad idea just say so rather than listing nine considerations first.",
      visibility: "private",
    },
    {
      id: "n5",
      label: "When you're free",
      body: "day usually wraps up around 9:30 pm",
      meta: "every day 21:30 to 23:59, blocked",
      visibility: "visible",
      glyph: "clock",
    },
  ];

  return (
    <div
      style={{
        background: "#F7F4ED",
        minHeight: "100vh",
        padding: "64px 24px",
        fontFamily: "system-ui",
      }}
    >
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <ContextNoteList notes={notes} />
      </div>
    </div>
  );
}
