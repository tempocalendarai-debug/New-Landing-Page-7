"use client";

/**
 * Updates feed
 * ------------------------------------------------------------------
 * Three tiers, three visual weights:
 *   paper card  = decide now
 *   hairline row = one tap
 *   grey text    = history
 *
 * Urgency is carried by weight rather than by coloured badges, which is
 * why nothing here needs a "1 needs you" pill. The heading already says it.
 *
 * The fluoro highlight appears at most ONCE per screen, on the single most
 * urgent item. Two highlights and neither is a highlight.
 *
 * Integrations deliberately do not live here. Connecting an account is a
 * once-ever action and this page is checked daily. The exception is a
 * BROKEN connection, which is news and arrives as an ordinary item.
 */

import React from "react";
import { InkCard, InkGlyph, type InkGlyphName } from "./ink";
import { TempoAgent } from "./tempo-agent";
import { TempoPeek } from "./tempo-peek";
import { TempoText } from "./tempo-type";

/* ------------------------------------------------------------------ */

const WORDS = ["Nothing", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const word = (n: number) => WORDS[n] ?? String(n);

export type NeedsYouItem = {
  id: string;
  /** "Gmail stopped syncing three days ago" — say what happened, not the status. */
  title: string;
  detail: string;
  primary: { label: string; onPress: () => void };
  /** Plain-text secondary actions. Keep to two. */
  secondary?: Array<{ label: string; onPress: () => void }>;
};

export type Suggestion = {
  id: string;
  title: string;
  /** "Tomorrow 06:30 · from Google Calendar" — when it happens, not when we noticed. */
  detail: string;
  glyph?: InkGlyphName;
  onAdd: () => void;
};

/* ------------------------------------------------------------------ */

export function UpdatesFeed({
  needsYou,
  suggestions,
  suggestionsSource = "Google Calendar",
  handledToday = 0,
  visibleSuggestions = 2,
  onAddAll,
  onShowMore,
  onShowHandled,
  more = [],
  visibleMore = 8,
  onShowMoreMail,
  renderBelow,
  wrapCard,
}: {
  needsYou: NeedsYouItem[];
  suggestions: Suggestion[];
  suggestionsSource?: string;
  handledToday?: number;
  visibleSuggestions?: number;
  onAddAll?: () => void;
  onShowMore?: () => void;
  onShowHandled?: () => void;
  /**
   * Rendered INSIDE the card it belongs to, under the action row.
   *
   * A reply Tempo is writing has to appear attached to the mail it answers. It
   * previously rendered in a block after the whole feed, so the writing animation
   * played somewhere off the bottom of the scroll view: the user tapped "draft a
   * reply" and, as far as they could tell, nothing happened.
   */
  /**
   * The rest of the mail.
   *
   * Everything the classifier called `fyi` - newsletters, receipts, Strava
   * kudos - previously had nowhere to go: it was not `needsYou`, and the
   * suggestions tier only accepts items with a calendar action, so it was
   * dropped silently. The user saw two cards and an inbox that looked empty.
   * This is the third tier the header comment at the top of this file has always
   * described: grey rows, one line each, swipe to clear or tap to reply.
   */
  more?: NeedsYouItem[];
  /** How many of `more` to show before the "show the rest" row. */
  visibleMore?: number;
  onShowMoreMail?: () => void;
  renderBelow?: (item: NeedsYouItem) => React.ReactNode;
  /**
   * Wraps each card, so the app can add a gesture layer (swipe to mark read)
   * without this file importing one. The brand kit stays presentational: it has
   * no motion dependency and no opinion about what a swipe means.
   */
  wrapCard?: (item: NeedsYouItem, card: React.ReactNode) => React.ReactNode;
}) {
  const nothingLeft = needsYou.length === 0 && suggestions.length === 0 && more.length === 0;

  if (nothingLeft) {
    return <ClearedState handledToday={handledToday} />;
  }

  const shown = suggestions.slice(0, visibleSuggestions);
  const hidden = suggestions.length - shown.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // App brand face — never system UI. Body stays readable; section
        // labels still use TempoText (display only).
        fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 25,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "var(--ink-line, #1B1B19)",
          fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
        }}
      >
        {needsYou.length > 0
          ? `${word(needsYou.length)} thing${needsYou.length === 1 ? "" : "s"} need${needsYou.length === 1 ? "s" : ""} you`
          : "Nothing needs you"}
      </h1>
      {suggestions.length > 0 && (
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 13,
            color: "var(--ink-muted, #9A9186)",
            fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
          }}
        >
          Plus {word(suggestions.length).toLowerCase()} thing
          {suggestions.length === 1 ? "" : "s"} Tempo noticed
        </p>
      )}

      {/* The peek needs ~35px of headroom above the first card, or the
          agent gets clipped by the top of the scroll view. */}
      <div style={{ marginTop: 38, display: "flex", flexDirection: "column", gap: 14 }}>
        {needsYou.map((item, i) => {
          const card = (
            <NeedsYouCard item={item} highlight={i === 0} below={renderBelow?.(item)} />
          );
          /*
           * The peek sits OUTSIDE whatever `wrapCard` returns.
           *
           * It is absolutely positioned above the card's top edge, so any
           * wrapper that clips - the swipe row needs `overflow: hidden` to keep
           * its action colour inside the rounded rect - would cut the character
           * off at the shoulders. Keeping it a sibling of the wrapper, inside a
           * plain relative box, gives it the headroom the margin above already
           * reserves.
           */
          return (
            <div key={item.id} style={{ position: "relative" }}>
              {i === 0 && <TempoPeek edge="top" at="82%" size={76} />}
              {wrapCard ? wrapCard(item, card) : card}
            </div>
          );
        })}
      </div>

      {suggestions.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 34,
              marginBottom: 6,
              color: "var(--ink-muted, #8A8175)",
            }}
          >
            <TempoText height={11} tracking={9}>
              Worth a look
            </TempoText>
            {suggestions.length > 1 && onAddAll && (
              <button onClick={onAddAll} style={link("var(--ink-line, #1B1B19)")}>
                Add all {word(suggestions.length).toLowerCase()}
              </button>
            )}
          </div>

          {shown.map((s) => (
            <SuggestionRow key={s.id} suggestion={s} />
          ))}

          {hidden > 0 && (
            <>
              <Rule />
              <button
                onClick={onShowMore}
                style={{ ...link("var(--ink-muted, #8A8175)"), padding: "16px 0", textAlign: "left" }}
              >
                {word(hidden)} more from {suggestionsSource}
              </button>
            </>
          )}
        </>
      )}

      {more.length > 0 && (
        <>
          <div
            style={{
              marginTop: 34,
              marginBottom: 2,
              color: "var(--ink-muted, #8A8175)",
            }}
          >
            <TempoText height={11} tracking={9}>
              The rest of your inbox
            </TempoText>
          </div>
          {more.slice(0, visibleMore).map((item) => {
            const row = <MailRow item={item} />;
            return (
              <div key={item.id} style={{ position: "relative" }}>
                {wrapCard ? wrapCard(item, row) : row}
                {renderBelow?.(item)}
              </div>
            );
          })}
          {more.length > visibleMore && (
            <>
              <Rule />
              <button
                onClick={onShowMoreMail}
                style={{ ...link("var(--ink-muted, #8A8175)"), padding: "16px 0", textAlign: "left" }}
              >
                {word(more.length - visibleMore)} more in your inbox
              </button>
            </>
          )}
        </>
      )}

      {handledToday > 0 && (
        <>
          <Rule />
          <button
            onClick={onShowHandled}
            style={{ ...link("#B0A79A"), padding: "18px 0", textAlign: "left" }}
          >
            Handled today &#183; {handledToday}
          </button>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function NeedsYouCard({
  item,
  highlight,
  below,
}: {
  item: NeedsYouItem;
  highlight: boolean;
  below?: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative" }}>
      {/* radius=2 keeps a drawn wobble without reading as a pill/stadium. */}
      <InkCard seed={item.id} padding="22px 26px 20px" radius={2}>
        <div style={{ position: "relative", display: "inline-block" }}>
          {highlight && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: -4,
                right: -4,
                top: "42%",
                height: 22,
                background: "var(--ink-fluoro, #F27E63)",
                /* Dark mode: lighter primary on dark card needs less opacity or
                   the title washes out; light mode keeps the paper wash. */
                opacity: "var(--ink-fluoro-wash, 0.5)",
                transform: "rotate(-0.4deg)",
              }}
            />
          )}
          <span
            style={{
              position: "relative",
              fontSize: 17,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "var(--ink-line, #1B1B19)",
              fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
            }}
          >
            {item.title}
          </span>
        </div>

        <p
          style={{
            margin: "10px 0 0",
            fontSize: 12,
            lineHeight: 1.45,
            color: "var(--ink-muted, #9A9186)",
            fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
          }}
        >
          {item.detail}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
          <button
            onClick={item.primary.onPress}
            style={{
              border: "1.4px solid var(--ink-line, #1B1B19)",
              borderRadius: 0,
              background: "none",
              padding: "7px 14px",
              fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--ink-line, #1B1B19)",
              cursor: "pointer",
            }}
          >
            {item.primary.label}
          </button>
          {item.secondary?.map((a) => (
            <button key={a.label} onClick={a.onPress} style={link("var(--ink-muted, #8A8175)")}>
              {a.label}
            </button>
          ))}
        </div>
        {below}
      </InkCard>
    </div>
  );
}

/**
 * One line of ordinary mail. Deliberately lighter than a NeedsYouCard: this tier
 * exists to be cleared quickly, not read closely, so it gets a rule rather than
 * a card and its actions are plain text.
 */
function MailRow({ item }: { item: NeedsYouItem }) {
  return (
    <div style={{ marginTop: 8 }}>
      <InkCard seed={`mail-${item.id}`} padding="12px 14px" radius={2}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--ink-line, #1B1B19)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                marginTop: 2,
                fontSize: 11.5,
                color: "var(--ink-muted, #9A9186)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
              }}
            >
              {item.detail}
            </div>
          </div>
          <button onClick={item.primary.onPress} style={link("var(--ink-line, #1B1B19)")}>
            {item.primary.label}
          </button>
        </div>
      </InkCard>
    </div>
  );
}

function SuggestionRow({ suggestion }: { suggestion: Suggestion }) {
  return (
    <div style={{ marginTop: 8 }}>
      <InkCard seed={`sug-${suggestion.id}`} padding="14px 16px" radius={2}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {suggestion.glyph && (
            <span style={{ color: "var(--ink-line, #1B1B19)" }}>
              <InkGlyph name={suggestion.glyph} size={18} />
            </span>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--ink-line, #1B1B19)",
                fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
              }}
            >
              {suggestion.title}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: "var(--ink-muted, #9A9186)",
                marginTop: 3,
                fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
              }}
            >
              {suggestion.detail}
            </div>
          </div>
          <button onClick={suggestion.onAdd} style={link("var(--ink-line, #1B1B19)")}>
            Add
          </button>
        </div>
      </InkCard>
    </div>
  );
}

function Rule() {
  return (
    <svg width="100%" height="4" viewBox="0 0 480 4" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 2 C120 1 340 3 480 2" stroke="var(--ink-rule, #DDD4C4)" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Only render this when someone actually cleared something. An empty
 * first-run inbox showing a celebration is meaningless, and annoying by
 * week two. Empty-because-nothing-happened is a different screen.
 */
export function ClearedState({ handledToday }: { handledToday: number }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "56px 24px",
        fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <TempoAgent state={handledToday > 0 ? "niceOne" : "idle"} size={120} />
      </div>
      <h2
        style={{
          margin: "26px 0 0",
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "var(--ink-line, #1B1B19)",
        }}
      >
        {handledToday > 0 ? "That's everything" : "Nothing's come in"}
      </h2>
      <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--ink-muted, #9A9186)" }}>
        {handledToday > 0
          ? `${word(handledToday)} thing${handledToday === 1 ? "" : "s"} handled today. Tempo's still watching.`
          : "Tempo will put anything that needs you right here."}
      </p>
    </div>
  );
}

const link = (color: string): React.CSSProperties => ({
  border: "none",
  background: "none",
  padding: 0,
  fontFamily: "var(--font-heading), var(--font-sans), system-ui, sans-serif",
  fontSize: 12.5,
  fontWeight: 500,
  color,
  cursor: "pointer",
});

/* ------------------------------------------------------------------ */
/* Demo                                                                */
/* ------------------------------------------------------------------ */

export default function UpdatesFeedDemo() {
  const noop = () => {};

  return (
    <div style={{ background: "#F7F4ED", minHeight: "100vh", padding: "56px 24px", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <UpdatesFeed
          needsYou={[
            {
              id: "gmail-broken",
              title: "Gmail stopped syncing three days ago",
              detail: "Nothing from your inbox has come through since Thursday",
              primary: { label: "Reconnect Gmail", onPress: noop },
            },
            {
              id: "codex-reply",
              title: "Codex Community is waiting on a reply",
              detail: "Meetup registration approved &#183; asked you Thursday, 18:47",
              primary: { label: "Draft a reply", onPress: noop },
              secondary: [
                { label: "Read it", onPress: noop },
                { label: "Not now", onPress: noop },
              ],
            },
          ]}
          suggestions={[
            { id: "run", title: "5km run", detail: "Tomorrow 06:30 &#183; from Google Calendar", glyph: "clock", onAdd: noop },
            { id: "gym", title: "Today's first: gym", detail: "Today 07:00 &#183; from Google Calendar", glyph: "sun", onAdd: noop },
            { id: "a", title: "Standup", detail: "Tomorrow 09:00", onAdd: noop },
            { id: "b", title: "Investor call", detail: "Tomorrow 14:00", onAdd: noop },
            { id: "c", title: "Dinner", detail: "Friday 19:00", onAdd: noop },
          ]}
          handledToday={4}
          onAddAll={noop}
          onShowMore={noop}
          onShowHandled={noop}
        />
      </div>
    </div>
  );
}
