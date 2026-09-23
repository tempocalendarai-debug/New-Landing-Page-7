"use client";

/**
 * "239 plans made. Make the next one." Counts up once when it scrolls into
 * view, then sits still. The number is in the hand face, so it boils.
 */

import React, { useEffect, useState } from "react";
import { TempoAgent } from "@/components/brand/tempo-agent";
import { TempoText } from "@/components/brand/tempo-type";
import { PLANS_MADE } from "./content";
import { InkButton, useDrawn } from "./ink-primitives";

export function PlansCounter() {
  const [ref, seen] = useDrawn<HTMLDivElement>(0.4);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(PLANS_MADE);
      return;
    }
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * PLANS_MADE));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen]);

  return (
    <section className="section section--tight" aria-labelledby="plans-title">
      <div ref={ref} className="wrap plans">
        <h2 id="plans-title" className="sr-only">
          {PLANS_MADE} plans made. Make the next one.
        </h2>
        <div className="plans__agent" aria-hidden="true">
          <TempoAgent state={n >= PLANS_MADE ? "niceOne" : "thinking"} size={96} />
        </div>
        <div className="plans__number" aria-hidden="true">
          <TempoText height={120} boil={n >= PLANS_MADE}>
            {String(n)}
          </TempoText>
        </div>
        <div className="plans__label" aria-hidden="true">
          <TempoText height={30}>PLANS MADE</TempoText>
        </div>
        <p className="plans__next">Make the next one.</p>
        <InkButton seed="plans-cta" href="#waitlist">
          Join the waitlist
        </InkButton>
      </div>
    </section>
  );
}
