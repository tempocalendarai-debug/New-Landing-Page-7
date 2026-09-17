"use client";

/**
 * One expandable question. Still a real <details>, so the answer is in the
 * static HTML, works without JavaScript and opens for find-in-page.
 *
 * JavaScript only adds the motion:
 *   - The answer unfolds with grid-template-rows 0fr to 1fr, the same technique
 *     the app's DraftReplySheet uses for the quoted original. No height maths.
 *   - The plus is drawn, not swapped: its upright stroke retracts with
 *     stroke-dashoffset as the question opens, leaving a minus, and draws back
 *     in when it closes. The whole glyph turns half a circle as it does.
 *
 * A native <details> hides its content the instant `open` goes false, so a
 * close sets data-state="closing" first and only drops `open` once the fold
 * has finished. The timeout matches the transition in globals.css.
 */

import React, { useEffect, useRef } from "react";

const FOLD_MS = 300;

export function FaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function onClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    const el = ref.current;
    if (!el) return;
    window.clearTimeout(timer.current);
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const closing = el.open && el.dataset.state !== "closing";
    if (!closing) {
      el.open = true;
      if (instant) {
        delete el.dataset.state;
        return;
      }
      // Paint once folded, then unfold, so the transition has a start point.
      el.dataset.state = "opening";
      requestAnimationFrame(() => requestAnimationFrame(() => delete el.dataset.state));
      return;
    }

    if (instant) {
      el.open = false;
      return;
    }
    el.dataset.state = "closing";
    timer.current = window.setTimeout(() => {
      el.open = false;
      delete el.dataset.state;
    }, FOLD_MS);
  }

  return (
    <details ref={ref} className="faq__item">
      <summary onClick={onClick}>
        <span>{question}</span>
        <svg className="faq__icon" width={20} height={20} viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M4 11 C9 10.8 13 11 18 11.2" />
          <path className="faq__icon-upright" pathLength={1} d="M11 4 C11.2 9 11 13 10.8 18" />
        </svg>
      </summary>
      <div className="faq__panel">
        <div>
          <div className="faq__answer">{children}</div>
        </div>
      </div>
    </details>
  );
}
