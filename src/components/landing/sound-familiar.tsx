"use client";

/**
 * "Sound familiar? (Tick all that apply)". The problem check from the brand
 * strategy: real things people say about plans that never happen. Ticking
 * them changes Tempo's mood and the verdict card, so the visitor diagnoses
 * themselves before we pitch anything.
 */

import React, { useState } from "react";
import { InkCard } from "@/components/brand/ink";
import { TempoAgent } from "@/components/brand/tempo-agent";
import { TempoText } from "@/components/brand/tempo-type";
import { Glyph, HandHeading, InkButton } from "./ink-primitives";

const LINES = [
  { id: "restaurant", text: "ohh, remember that restaurant we wanted to try?", meta: "Group chat · 6 people" },
  { id: "poker", text: "we forgot to have poker night at your place", meta: "Seen by 5" },
  { id: "roadtrip", text: "can't believe we still haven't done that road trip", meta: "First planned in first year" },
  { id: "exams", text: "let's lock something in after exams", meta: "Also said last semester" },
  { id: "mum", text: "mum's asking when we're all home for dinner", meta: "Family chat" },
  { id: "date", text: "date night next week? definitely next week.", meta: "Said last week too" },
  { id: "hangout", text: "wait, when did we last actually hang out?", meta: "Seen by 4" },
  { id: "catchup", text: "we should catch up soon!!", meta: "Sent 4 months ago" },
];

/**
 * One verdict per tick count. Tempo gets more surprised, then more delighted,
 * the more plans are stuck: brows climb, hands come up, the lines get louder.
 */
const VERDICTS: Array<{ state: "listening" | "headsUp" | "foundIt" | "niceOne"; title: string; body: string }> = [
  { state: "listening", title: "TICK AWAY", body: "Be honest. Everyone's got at least one." },
  { state: "headsUp", title: "BEEN THERE", body: "Everyone means it. Nobody books it. That's the bit Tempo does." },
  { state: "headsUp", title: "WE CAN HELP", body: "Two plans stuck in the group chat? Easy." },
  { state: "foundIt", title: "WE CAN HELP!", body: "Three. Now we're talking. Your Tempo's keen." },
  { state: "foundIt", title: "OH, WE CAN HELP", body: "Half the list. Tempo's already warming up." },
  { state: "niceOne", title: "OKAY, WOW", body: "Five plans waiting. This is exactly what Tempo's for." },
  { state: "niceOne", title: "WE CAN SO HELP", body: "Six? Tempo hasn't been this excited all week." },
  { state: "niceOne", title: "SAY LESS!", body: "Seven. Clear some space, your weekends are about to fill up." },
  { state: "niceOne", title: "ALL OF THEM?!", body: "The full set. You might be our favourite person. Welcome to Tempo." },
];

/** Cartoon surprise lines around Tempo's head. More ticks, more lines. */
const BURSTS = [
  "M14 30 C10 27 7 24 4 21",
  "M86 30 C90 27 93 24 96 21",
  "M50 8 C50 6 50 3 50 1",
  "M26 14 C24 11 22 8 20 5",
  "M74 14 C76 11 78 8 80 5",
];

function Bursts({ count }: { count: number }) {
  const n = count >= 7 ? 5 : count >= 5 ? 3 : count >= 3 ? 2 : 0;
  if (!n) return null;
  return (
    <svg className="verdict__bursts" viewBox="0 0 100 40" fill="none" aria-hidden="true">
      {BURSTS.slice(0, n).map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** A small hand-drawn box. Static path, slightly off-square on purpose. */
function DrawnBox() {
  return (
    <svg className="check__box" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M4 5 C9 3.6 16 3.8 22 4.6 C22.6 10 22.4 16 21.6 21.8 C15.6 22.6 9.6 22.4 4.4 21.6 C3.6 16 3.4 10 4 5 Z" />
    </svg>
  );
}

export function SoundFamiliar() {
  const [ticked, setTicked] = useState<Record<string, boolean>>({});
  const count = Object.values(ticked).filter(Boolean).length;

  const v = VERDICTS[Math.min(count, VERDICTS.length - 1)];
  const agentSize = 84 + count * 6;

  return (
    <section id="familiar" className="section" aria-labelledby="familiar-title">
      <div className="wrap familiar">
        <div className="familiar__head">
          <HandHeading id="familiar-title" lines={["SOUND", "FAMILIAR?"]} label="Sound familiar?" />
          <p className="small familiar__hint">(Tick all that apply)</p>
        </div>

        <div className="familiar__grid">
          <ul className="familiar__list">
            {LINES.map((l) => {
              const on = !!ticked[l.id];
              return (
                <li key={l.id}>
                  <label className="check" data-on={on}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() => setTicked((t) => ({ ...t, [l.id]: !t[l.id] }))}
                    />
                    <span className="check__mark">
                      <DrawnBox />
                      {on && <Glyph name="check" size={22} />}
                    </span>
                    <span className="check__text">
                      <span className="check__quote">{l.text}</span>
                      <span className="check__meta">{l.meta}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="familiar__verdict" data-hot={count > 0}>
            <InkCard seed="familiar-verdict" padding="28px 26px 26px" radius={16}>
              <div className="verdict" data-level={count}>
                <div className="verdict__agent" key={count}>
                  <Bursts count={count} />
                  <TempoAgent state={v.state} size={agentSize} />
                </div>
                <TempoText height={24 + Math.min(count, 8)} boil={count >= 5}>
                  {v.title}
                </TempoText>
                <p className="verdict__body">{v.body}</p>
                {count > 0 && (
                  <InkButton seed="familiar-cta" href="#waitlist">
                    Join the waitlist
                  </InkButton>
                )}
                <p className="verdict__count">
                  {count} of {LINES.length} ticked
                </p>
              </div>
            </InkCard>
          </div>
        </div>
      </div>
    </section>
  );
}
