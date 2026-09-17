"use client";

/**
 * Draft reply sheet
 * ------------------------------------------------------------------
 * Three states: writing, streaming, ready.
 *
 * THE SCRIBBLE IS FOR THE GAP ONLY.
 * Those handwriting lines cover the sub-second wait before the model's
 * first token. The moment text starts arriving, pass status="streaming"
 * and render the real thing. A fake writing animation that then swaps to
 * finished text is a lie people notice on a slow request, and it makes
 * the wait feel longer because they realise nothing was happening.
 *
 * The quoted original unfolds using grid-template-rows 0fr to 1fr, which
 * animates height without measuring anything. max-height transitions need
 * a magic number that's always either too small or janky.
 */

import React, { useMemo, useState } from "react";
import { InkCard } from "./ink";
import { TempoAgent } from "./tempo-agent";

/* ------------------------------------------------------------------ */

const CSS = `
.drs-line{stroke-dasharray:900;stroke-dashoffset:900;animation:drs-write 5s ease-out infinite}
@keyframes drs-write{0%{stroke-dashoffset:900;opacity:1}24%{stroke-dashoffset:0}88%{stroke-dashoffset:0;opacity:1}96%,100%{stroke-dashoffset:0;opacity:0}}
.drs-caret{animation:drs-blink 1.05s steps(1) infinite}
@keyframes drs-blink{0%,50%{opacity:1}51%,100%{opacity:0}}
.drs-fold{display:grid;grid-template-rows:0fr;transition:grid-template-rows .32s cubic-bezier(.4,0,.2,1)}
.drs-fold[data-open="true"]{grid-template-rows:1fr}
.drs-fold>div{overflow:hidden}
.drs-rule{transition:height .32s cubic-bezier(.4,0,.2,1)}
.drs-in{animation:drs-in .3s ease-out both}
@keyframes drs-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
.drs-line{animation:none;stroke-dashoffset:0}
.drs-caret,.drs-in{animation:none}
.drs-fold,.drs-rule{transition-duration:.01ms}
}`;

/** One line of "handwriting": a flat wave, 16px per crest. */
function scribble(x: number, y: number, width: number): string {
  const units = Math.max(1, Math.round(width / 16));
  return `M${x} ${y}` + " c5 -3.5 11 3.5 16 0".repeat(units);
}

function ScribbleLines({ widths }: { widths: number[] }) {
  return (
    <svg
      width="100%"
      height={widths.length * 30}
      viewBox={`0 0 560 ${widths.length * 30}`}
      preserveAspectRatio="xMinYMin meet"
      fill="none"
      aria-label="Writing"
      role="img"
    >
      <g stroke="var(--ink-line, #1B1B19)" strokeWidth={2.1} strokeLinecap="round">
        {widths.map((w, i) => (
          <path
            key={i}
            className="drs-line"
            style={{ animationDelay: `${i * 0.45}s` }}
            d={scribble(2, 16 + i * 30, w)}
          />
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */

export type DraftStatus = "writing" | "streaming" | "ready";

/**
 * Same padding contract as InkCard, no border. A hairline rule above it keeps the
 * draft visibly separate from the mail's own actions without drawing a second box.
 */
function BareShell({
  children,
  padding,
  style,
}: {
  seed: string;
  children: React.ReactNode;
  padding?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        padding,
        marginTop: 14,
        borderTop: "1px solid var(--ink-rule, #E4DED2)",
        paddingLeft: 0,
        paddingRight: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function DraftReplySheet({
  status,
  recipient,
  context,
  text = "",
  onTextChange,
  originalSubject,
  originalBody,
  onSend,
  onSaveDraft,
  onRegenerate,
  sendLabel = "Send via Gmail",
  bare = false,
}: {
  status: DraftStatus;
  /** "Codex Community" */
  recipient: string;
  /** "About your meetup registration · Thursday 18:47" */
  context?: string;
  /** The draft. Grows as tokens arrive while status is "streaming". */
  text?: string;
  /**
   * Makes the draft editable. Without it the body is read-only prose while the
   * subtitle says "Change anything you like before it goes" - the card promising
   * something it did not do. Omit only where editing genuinely is not offered.
   */
  onTextChange?: (next: string) => void;
  originalSubject?: string;
  originalBody?: string;
  /** Omit to hide the send control (e.g. Outlook save-only). */
  onSend?: () => void;
  onSaveDraft?: () => void;
  onRegenerate?: () => void;
  sendLabel?: string;
  /**
   * Drop the card shell. Set this when the sheet is rendered INSIDE another
   * InkCard - a draft under the mail it answers - or the two hand-drawn borders
   * nest and the card reads as a box in a box. Each border also carries its own
   * ResizeObserver and wobble-path regeneration, so the inner one is cost as well
   * as noise.
   */
  bare?: boolean;
}) {
  const [openOriginal, setOpenOriginal] = useState(false);

  const heading =
    status === "ready" ? `Ready to send to ${recipient}` : `Writing a reply to ${recipient}`;
  const sub =
    status === "ready" ? "Change anything you like before it goes" : context;

  // Uneven line lengths — a loader with four identical bars reads as a
  // loader, uneven ones read as prose.
  const widths = useMemo(() => [520, 470, 540, 300], []);

  const Shell = bare ? BareShell : InkCard;

  return (
    <Shell
      seed={`draft-${recipient}`}
      padding="18px 20px 20px"
      {...(!bare ? { radius: 2 } : {})}
      style={{
        fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 18 }}>
        <TempoAgent
          state={status === "ready" ? "foundIt" : "thinking"}
          size={34}
          crop="head"
        />
        <div>
          <div style={{ fontSize: 16, color: "var(--ink-line, #1B1B19)" }}>{heading}</div>
          {sub && (
            <div style={{ fontSize: 11.5, color: "var(--ink-muted, #9A9186)", marginTop: 3 }}>
              {sub}
            </div>
          )}
        </div>
      </div>

      {status === "writing" ? (
        <ScribbleLines widths={widths} />
      ) : onTextChange ? (
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          aria-label="Draft reply"
          rows={Math.max(4, text.split("\n").length + 1)}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            border: "none",
            outline: "none",
            padding: 0,
            background: "transparent",
            font: "inherit",
            fontSize: 14.5,
            lineHeight: 1.6,
            color: "var(--ink-line, #1B1B19)",
            minHeight: 96,
          }}
        />
      ) : (
        <div
          style={{
            fontSize: 14.5,
            lineHeight: 1.6,
            color: "var(--ink-line, #1B1B19)",
            whiteSpace: "pre-wrap",
            minHeight: 96,
          }}
        >
          {text}
          {status === "streaming" && (
            <span
              className="drs-caret"
              style={{
                display: "inline-block",
                width: 2,
                height: "1em",
                background: "currentColor",
                verticalAlign: "text-bottom",
                marginLeft: 1,
              }}
            />
          )}
        </div>
      )}

      {status === "ready" && originalSubject && (
        <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
          {/* The quote rule grows as the original unfolds, same motion
              vocabulary as every other drawn line in the app. */}
          <div
            className="drs-rule"
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: 2.2,
              borderRadius: 2,
              background: "var(--ink-rule, #C4B9A8)",
              height: openOriginal ? "auto" : 40,
              alignSelf: "stretch",
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "var(--ink-muted, #9A9186)" }}>
              {originalSubject}
            </div>
            <button
              onClick={() => setOpenOriginal((v) => !v)}
              style={{
                marginTop: 5,
                padding: 0,
                border: "none",
                background: "none",
                font: "inherit",
                fontSize: 12,
                color: "var(--ink-muted, #8A8175)",
                cursor: "pointer",
              }}
              aria-expanded={openOriginal}
            >
              {openOriginal ? "Fold it away" : "Read what they sent"}
            </button>

            <div className="drs-fold" data-open={openOriginal}>
              <div>
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "var(--ink-muted, #8A8175)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {originalBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "ready" && (
        <div
          className="drs-in"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 24,
            flexWrap: "wrap",
          }}
        >
          {onSend ? (
            <button
              onClick={onSend}
              style={{
                border: "none",
                borderRadius: 0,
                padding: "9px 16px",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
                cursor: "pointer",
                background: "var(--ink-line, #1B1B19)",
                color: "var(--ink-paper, #F7F4ED)",
              }}
            >
              {sendLabel}
            </button>
          ) : null}
          <button onClick={onSaveDraft} style={plain("var(--ink-line, #1B1B19)")}>
            Save as draft
          </button>
          <button
            onClick={onRegenerate}
            style={{ ...plain("var(--ink-muted, #8A8175)"), marginLeft: "auto" }}
          >
            Write it again
          </button>
        </div>
      )}
    </Shell>
  );
}

const plain = (color: string): React.CSSProperties => ({
  border: "none",
  background: "none",
  padding: 0,
  fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
  fontSize: 13,
  fontWeight: 500,
  color,
  cursor: "pointer",
});

/* ------------------------------------------------------------------ */
/* Demo                                                                */
/* ------------------------------------------------------------------ */

const FULL = `Hi Codex team,

Thanks for confirming the spot, that's great news. I'll be there on Thursday evening.

Axel`;

export default function DraftReplyDemo() {
  const [status, setStatus] = useState<DraftStatus>("writing");
  const [text, setText] = useState("");

  // Stands in for your streaming endpoint.
  const run = () => {
    setStatus("writing");
    setText("");
    setTimeout(() => {
      setStatus("streaming");
      let i = 0;
      const id = setInterval(() => {
        i += 2;
        setText(FULL.slice(0, i));
        if (i >= FULL.length) {
          clearInterval(id);
          setStatus("ready");
        }
      }, 24);
    }, 1400);
  };

  return (
    <div style={{ background: "#F7F4ED", minHeight: "100vh", padding: 48, fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <button onClick={run} style={{ marginBottom: 24 }}>
          Run it
        </button>
        <DraftReplySheet
          status={status}
          recipient="Codex Community"
          context="About your meetup registration &#183; Thursday 18:47"
          text={text}
          originalSubject="Registration approved for Codex Community Meetup"
          originalBody={`You've got a spot at Codex Community Meetup in Brisbane.\n\nDoors at 6:00 pm, talks start at 6:30. Let us know if you can't make it.`}
        />
      </div>
    </div>
  );
}
