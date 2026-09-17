"use client";

/**
 * Connection wiring
 * ------------------------------------------------------------------
 * Connected accounts drawn as wires. Connected means the line reaches
 * Tempo; not connected means it stops short and goes dashed. A green
 * pill tells you a connection exists but not what it's for, which is the
 * actual question people have on this screen.
 *
 * Descriptions say what the connection DOES, in outcomes: "Finds replies
 * you owe people", not "Connected, refreshes every 2 minutes". Nobody
 * needs the poll interval.
 *
 * SCOPE: this reads beautifully at four to six services and turns into
 * spaghetti past about eight. If you're building a big integrations
 * directory, use a plain list instead.
 *
 * This belongs in Settings, not on Updates. A broken connection is news
 * and goes in the feed; a working one is configuration.
 */

import React, { useId } from "react";
import { useSize } from "./ink";

const MARK =
  "M20 16 C36 23 64 23 80 16 C70 29 57 42 50 50 C43 42 30 29 20 16 Z M20 84 C36 77 64 77 80 84 C70 71 57 58 50 50 C43 58 30 71 20 84 Z";

export type Service = {
  id: string;
  name: string;
  /** What it does for the user, phrased as an outcome. */
  description: string;
  connected: boolean;
  onPress?: () => void;
};

const ROW = 62;
const MARK_SIZE = 56;

export function ConnectionWiring({ services }: { services: Service[] }) {
  const id = useId().replace(/:/g, "");
  const [ref, size] = useSize<HTMLDivElement>();

  const height = services.length * ROW + 20;
  const w = size.w || 600;

  // Where the wires start, where they end.
  const startX = Math.min(280, w * 0.46);
  const markX = w - MARK_SIZE - 8;
  const markCY = height / 2;
  const stopX = startX + Math.max(60, (markX - startX) * 0.32);

  const rowY = (i: number) => 22 + i * ROW;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${w} ${height}`}
        fill="none"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        {services.map((s, i) => {
          const y = rowY(i);
          if (s.connected) {
            // Curves into the left flank of the mark.
            const ex = markX + 4;
            const ey = markCY;
            return (
              <path
                key={s.id}
                d={`M${startX} ${y} C${startX + (ex - startX) * 0.45} ${y + 2} ${ex - (ex - startX) * 0.3} ${ey - (ey - y) * 0.42} ${ex} ${ey}`}
                stroke="var(--ink-line, #1B1B19)"
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            );
          }
          return (
            <path
              key={s.id}
              d={`M${startX} ${y} C${startX + 34} ${y - 2} ${stopX - 26} ${y - 5} ${stopX} ${y - 7}`}
              stroke="var(--ink-rule, #C4B9A8)"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeDasharray="5 6"
            />
          );
        })}

        <g transform={`translate(${markX} ${markCY - MARK_SIZE / 2}) scale(${MARK_SIZE / 100})`}>
          <path
            d={MARK}
            stroke="var(--ink-line, #1B1B19)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>

      {/* Labels and buttons sit on top of the drawing so they stay real
          text — selectable, translatable, readable by a screen reader. */}
      <ul
        style={{ position: "absolute", inset: 0, margin: 0, padding: 0, listStyle: "none" }}
        aria-label="Connected accounts"
      >
        {services.map((s, i) => {
          const y = rowY(i);
          return (
            <li key={s.id}>
              <div style={{ position: "absolute", top: y - 18, left: 0, width: startX - 16 }}>
                <div
                  style={{
                    fontSize: 16,
                    color: s.connected ? "var(--ink-line, #1B1B19)" : "var(--ink-muted, #8A8175)",
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    marginTop: 3,
                    color: s.connected ? "var(--ink-muted, #9A9186)" : "#B0A79A",
                  }}
                >
                  {s.description}
                </div>
              </div>

              {!s.connected && (
                <button
                  onClick={s.onPress}
                  style={{
                    position: "absolute",
                    top: y - 21,
                    left: stopX + 16,
                    border: "1.4px solid var(--ink-line, #1B1B19)",
                    borderRadius: 999,
                    background: "none",
                    padding: "5px 15px",
                    font: "inherit",
                    fontSize: 12,
                    color: "var(--ink-line, #1B1B19)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Connect
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <p id={`${id}-note`} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {services.filter((s) => s.connected).length} of {services.length} accounts connected.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Demo                                                                */
/* ------------------------------------------------------------------ */

export default function ConnectionWiringDemo() {
  const noop = () => {};
  return (
    <div style={{ background: "#F7F4ED", minHeight: "100vh", padding: 64, fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <ConnectionWiring
          services={[
            { id: "gmail", name: "Gmail", description: "Finds replies you owe people", connected: true },
            { id: "gcal", name: "Google Calendar", description: "Spots events that aren't in Tempo yet", connected: true },
            { id: "outlook", name: "Outlook", description: "Would do the same for work mail", connected: false, onPress: noop },
            { id: "notion", name: "Notion", description: "Would read the notes you keep there", connected: false, onPress: noop },
          ]}
        />
      </div>
    </div>
  );
}
