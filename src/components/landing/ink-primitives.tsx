"use client";

/**
 * Landing-only ink primitives, built on the app's brand kit rather than beside it.
 * The wobble comes from brand/ink (wobblyRect, useSize, hashId, wob) and the
 * lettering from brand/tempo-type, so a button border here is drawn by the same
 * generator as a card border in the app.
 *
 * Motion rule from the brief: lines draw themselves in with stroke-dashoffset and
 * that is the only entry animation. Everything that draws uses `.draw` plus a
 * `data-drawn` flag on an ancestor; globals.css owns the transition and turns it
 * into an instant cut under prefers-reduced-motion.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { hashId, useSize, wob, wobblyRect } from "@/components/brand/ink";
import { GLYPHS, TempoText } from "@/components/brand/tempo-type";

/* ------------------------------------------------------------------ */
/* Draw on view                                                        */
/* ------------------------------------------------------------------ */

/** Flips once the element is on screen, then stays drawn. Never redraws on scroll back. */
export function useDrawn<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, drawn] as const;
}

/**
 * A loose line between two things, drawn in once when it scrolls into view.
 * Built in measured pixels like wobblyRect: a stretched viewBox would warp the
 * stroke, and Chrome miscounts pathLength dashes under non-scaling-stroke.
 */
export function DrawnWire({ className }: { className?: string }) {
  const [drawRef, drawn] = useDrawn<HTMLSpanElement>(0.5);
  const [boxRef, { w, h }] = useSize<HTMLSpanElement>();
  const d =
    w && h
      ? `M2 ${h * 0.78} C${w * 0.2} ${h * 0.12} ${w * 0.36} ${h * 0.06} ${w * 0.5} ${h * 0.36} C${w * 0.64} ${
          h * 0.66
        } ${w * 0.8} ${h * 0.74} ${w - 2} ${h * 0.2}`
      : "";

  return (
    <span ref={drawRef} className={className} data-drawn={drawn} aria-hidden="true">
      <span ref={boxRef} className="wire__box">
        {d && (
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
            <path className="draw" pathLength={1} d={d} />
          </svg>
        )}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Headings in the hand face                                           */
/* ------------------------------------------------------------------ */

const TRACKING = 8;

/** Width of a TempoText line in glyph units, matching TempoText's own layout maths. */
function lineUnits(text: string): number {
  let x = 0;
  for (const ch of text.toUpperCase()) x += (GLYPHS[ch] ?? GLYPHS[" "]).adv + TRACKING;
  return Math.max(0, x - TRACKING) + 6;
}

/**
 * Multi-line hand-lettered heading. Each line is its own TempoText, and every
 * line is sized as a share of the widest one, so when a narrow phone clamps the
 * heading all lines shrink together and keep one cap height. Letting each SVG
 * clamp on its own gives two lines of visibly different sizes.
 *
 * The lettering is aria-hidden and a plain-text copy carries the heading for
 * screen readers and search engines. Keep lines to A-Z, 0-9 and . , - ! ? ' :
 * because the hand face has no other glyphs.
 */
export function HandHeading({
  lines,
  label,
  as: Tag = "h2",
  height = 44,
  boil = false,
  align = "start",
  id,
  className,
}: {
  lines: string[];
  /** Sentence-case text for screen readers and search. The lettering is caps-only. */
  label: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  /** Cap height in px at full width. Never below 20. */
  height?: number;
  boil?: boolean;
  align?: "start" | "center";
  className?: string;
}) {
  const units = lines.map(lineUnits);
  const widest = Math.max(...units);
  const scale = height / 40;

  return (
    <Tag id={id} className={`hand-heading ${className ?? ""}`} data-align={align}>
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="hand-heading__lines"
        style={{ width: `min(100%, ${Math.round(widest * scale)}px)`, gap: `${Math.round(height * 0.14)}px` }}
      >
        {lines.map((line, i) => (
          <span key={line} className="hand-heading__line" style={{ width: `${(units[i] / widest) * 100}%` }}>
            <TempoText height={height} boil={boil}>
              {line}
            </TempoText>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Fluoro highlighter swipe                                            */
/* ------------------------------------------------------------------ */

/**
 * The fluoro's one job: a translucent marker swipe UNDER the single thing in a
 * viewport that needs attention. Never a fill, never a background, never just
 * "Tempo orange". Use it once per screen at most.
 */
export function Highlight({ seed, children }: { seed: string; children: React.ReactNode }) {
  const n = useMemo(() => hashId(seed), [seed]);
  const [drawRef, drawn] = useDrawn<HTMLSpanElement>(0.6);
  const [boxRef, size] = useSize<HTMLSpanElement>();

  const sw = Math.max(10, size.h * 0.62);
  const y = size.h * 0.6;
  const d = size.w
    ? `M${-5 + sw / 2} ${y + wob(n, 1, 1.2)} C${size.w * 0.32} ${y + wob(n, 2, 2.4)} ${size.w * 0.68} ${
        y + wob(n, 3, 2.4)
      } ${size.w + 5 - sw / 2} ${y - 1 + wob(n, 4, 1.2)}`
    : "";

  return (
    <span ref={drawRef} className="highlight" data-drawn={drawn}>
      <span ref={boxRef} className="highlight__box">
        {d && (
          <svg aria-hidden="true" className="highlight__swipe" width={size.w} height={size.h}>
            <path className="draw" pathLength={1} d={d} strokeWidth={sw} />
          </svg>
        )}
        <span className="highlight__text">{children}</span>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons and fields with generated borders                           */
/* ------------------------------------------------------------------ */

function InkBorder({ seed, radius = 12 }: { seed: string; radius?: number }) {
  const n = useMemo(() => hashId(seed), [seed]);
  const [ref, size] = useSize<HTMLSpanElement>();
  const d = size.w && size.h ? wobblyRect(size.w, size.h, n, radius, 1.3, 3) : "";

  return (
    <span ref={ref} className="ink-border" aria-hidden="true">
      {d && (
        <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} fill="none">
          <path d={d} />
        </svg>
      )}
    </span>
  );
}

type InkButtonProps = {
  seed: string;
  children: React.ReactNode;
  /** Puts the fluoro swipe under the label. Only for the one CTA on screen. */
  highlight?: boolean;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
};

export function InkButton({
  seed,
  children,
  highlight = false,
  href,
  type = "button",
  disabled,
  size = "md",
  className,
  onClick,
}: InkButtonProps) {
  const label = <span className="ink-button__label">{highlight ? <Highlight seed={`${seed}-hl`}>{children}</Highlight> : children}</span>;
  const cls = `ink-button ink-button--${size} ${className ?? ""}`;

  if (href) {
    return (
      <a className={cls} href={href}>
        <InkBorder seed={seed} />
        {label}
      </a>
    );
  }
  return (
    <button className={cls} type={type} disabled={disabled} onClick={onClick}>
      <InkBorder seed={seed} />
      {label}
    </button>
  );
}

/** Wraps a native input in a drawn border. The input stays a real, unstyled-by-hand control. */
export function InkField({ seed, children }: { seed: string; children: React.ReactNode }) {
  return (
    <span className="ink-field">
      <InkBorder seed={seed} radius={10} />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Drawn glyphs the kit doesn't have yet                               */
/* ------------------------------------------------------------------ */

const LANDING_GLYPHS = {
  check: "M3 11.5 C5 13.5 7 15.5 8.5 17 C11.5 12 15 7.5 19 4",
  lock: "M5 10 C5 9 5.6 8.5 6.5 8.5 L15.5 8.5 C16.4 8.5 17 9 17 10 L17 18 C17 19 16.4 19.5 15.5 19.5 L6.5 19.5 C5.6 19.5 5 19 5 18 Z M7.5 8.5 C7.5 5.5 8.8 3.2 11 3.2 C13.2 3.2 14.5 5.5 14.5 8.5",
} as const;

export function Glyph({ name, size = 18 }: { name: keyof typeof LANDING_GLYPHS; size?: number }) {
  return (
    <svg className={`glyph glyph--${name}`} width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d={LANDING_GLYPHS[name]} />
    </svg>
  );
}
