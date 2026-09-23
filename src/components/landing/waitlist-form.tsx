"use client";

/**
 * Waitlist signup.
 *
 * Every signup is POSTed to Netlify Forms under the form's own name,
 * "waitlist-hero" or "waitlist-cta", with its honeypot. Netlify only learns
 * about forms from static HTML, which is why public/__forms.html exists and
 * why the POST goes there: keep the names and honeypots in sync with that file.
 *
 * After the email lands, the form turns into the thank-you card: Tempo
 * celebrating, your place in line, claim your @handle, what happens next,
 * and a share button.
 *
 * Handles: the live API (netlify/functions/waitlist.mts) checks nobody else
 * has it and reserves it, then the email + handle go to their own Netlify
 * form, "waitlist-handle", so every claimed handle is in the Forms dashboard.
 */

import React, { useEffect, useRef, useState } from "react";
import { InkCard } from "@/components/brand/ink";
import { TempoAgent } from "@/components/brand/tempo-agent";
import { TempoText } from "@/components/brand/tempo-type";
import { ProfileAvatar } from "./founding";
import { InkButton, InkField } from "./ink-primitives";
import { checkHandle, handleProblem, register, type HandleCheck, type Signup } from "./waitlist-api";

type Status = "idle" | "sending" | "thanks" | "error" | "invalid";
type FormName = "waitlist-hero" | "waitlist-cta";

const FEEDBACK_EMAIL = "tempoassistantau@gmail.com";
const SITE = "https://tempoassistant.com";

/** Sends one submission to Netlify Forms, exactly as a plain HTML form post would. */
async function postToNetlify(form: HTMLFormElement) {
  const body = new URLSearchParams();
  new FormData(form).forEach((value, key) => body.append(key, String(value)));
  await sendForm(body);
}

/** The claimed handle goes to its own Netlify form, "waitlist-handle". */
async function postHandleToNetlify(email: string, handle: string) {
  await sendForm(
    new URLSearchParams({ "form-name": "waitlist-handle", "bot-field-handle": "", email, handle }),
  );
}

async function sendForm(body: URLSearchParams) {
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Netlify Forms ${res.status}`);
}

export function WaitlistForm({
  name,
  honeypot,
  highlight = false,
}: {
  name: FormName;
  honeypot: string;
  highlight?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [signup, setSignup] = useState<Signup | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const value = String(new FormData(form).get("email") ?? "").trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setStatus("invalid");
      return;
    }

    setStatus("sending");
    try {
      await postToNetlify(form);
    } catch (err) {
      // `npm run dev` has no Netlify Forms, so a failed post there is expected.
      if (process.env.NODE_ENV !== "development") {
        setStatus("error");
        return;
      }
      console.info("[waitlist] Netlify Forms isn't available locally, carrying on.", err);
    }

    // Place in line and @handle. If this part is down the email is still safe
    // in Netlify Forms, so the thank-you just shows without a number.
    try {
      setSignup(await register(value));
    } catch {
      setSignup(null);
    }
    setEmail(value);
    setStatus("thanks");
  }

  if (status === "thanks") {
    return <ThankYou formName={name} email={email} initial={signup} />;
  }

  const fieldId = `${name}-email`;

  return (
    <form
      className="waitlist"
      name={name}
      method="POST"
      data-netlify="true"
      netlify-honeypot={honeypot}
      onSubmit={onSubmit}
      noValidate
    >
      <input type="hidden" name="form-name" value={name} />
      <p hidden>
        <label>
          Don&rsquo;t fill this out: <input name={honeypot} tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="waitlist__row">
        <label className="sr-only" htmlFor={fieldId}>
          Email address
        </label>
        <InkField seed={`${name}-field`}>
          <input
            id={fieldId}
            className="waitlist__input"
            type="email"
            name="email"
            placeholder="you@email.com"
            autoComplete="email"
            required
            aria-invalid={status === "invalid" || undefined}
            aria-describedby={status === "invalid" || status === "error" ? `${name}-msg` : undefined}
            onInput={() => status !== "idle" && status !== "sending" && setStatus("idle")}
          />
        </InkField>
        <InkButton seed={`${name}-button`} type="submit" highlight={highlight} disabled={status === "sending"}>
          {status === "sending" ? "Joining" : "Join the waitlist"}
        </InkButton>
      </div>

      {(status === "invalid" || status === "error") && (
        <p id={`${name}-msg`} className="waitlist__msg" role="alert">
          {status === "invalid"
            ? "That email doesn't look quite right."
            : "That didn't go through. Check your connection and try again."}
        </p>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Thank you                                                           */
/* ------------------------------------------------------------------ */

/** Hand-drawn confetti around Tempo: squiggles, rings, sparks. Boils like everything else. */
function Confetti() {
  return (
    <svg className="thanks__confetti" viewBox="0 0 240 150" fill="none" aria-hidden="true">
      <g className="c-ink">
        <path d="M22 40 C28 34 34 46 40 40 C46 34 52 46 58 40" />
        <path d="M196 26 L204 34 M204 26 L196 34" />
        <circle cx="210" cy="92" r="4.5" />
        <path d="M30 108 C34 102 40 104 42 110" />
      </g>
      <g className="c-burg">
        <path d="M190 58 C196 52 202 64 208 58 C214 52 220 64 226 58" />
        <path d="M14 76 L14 88 M8 82 L20 82" />
        <circle cx="52" cy="18" r="4" />
        <path d="M184 112 L192 104" />
        <path d="M120 6 L120 14 M116 10 L124 10" />
      </g>
    </svg>
  );
}

function ThankYou({ formName, email, initial }: { formName: FormName; email: string; initial: Signup | null }) {
  const [signup, setSignup] = useState<Signup | null>(initial);
  const [handle, setHandle] = useState<string | null>(initial?.handle ?? null);
  const [stage, setStage] = useState<"claim" | "claimed" | "skipped">(initial?.handle ? "claimed" : "claim");
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, []);

  async function share() {
    const data = { title: "Tempo", text: "Get on the Tempo waitlist with me. Invites are limited.", url: SITE };
    try {
      if (navigator.share) return await navigator.share(data);
    } catch {
      return;
    }
    copy();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(SITE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {}
  }

  return (
    <div ref={ref} className="thanks" role="status" aria-live="polite">
      <InkCard seed={`${formName}-thanks`} tape padding="30px 24px 26px" radius={18}>
        <div className="thanks__inner">
          <div className="thanks__hero">
            <Confetti />
            <TempoAgent state={stage === "claimed" ? "wink" : "niceOne"} size={100} />
          </div>

          <div className="thanks__title" aria-label="You're on the list">
            <TempoText height={30} boil>
              YOU'RE ON
            </TempoText>
            <TempoText height={30} boil>
              THE LIST
            </TempoText>
          </div>

          <p className="thanks__pos">
            {signup ? (
              <>
                Nice one. You&rsquo;re <strong>#{signup.position}</strong> on the waitlist.
              </>
            ) : (
              <>Nice one. Your spot&rsquo;s saved.</>
            )}
          </p>

          {/* One handle per email: the claim only shows when the live check can
              enforce that. Signed up before? Your existing handle shows instead. */}
          {signup && stage === "claim" && (
            <ClaimHandle
              email={email}
              onClaimed={(h, s) => {
                setSignup(s);
                setHandle(h);
                setStage("claimed");
              }}
              onSkip={() => setStage("skipped")}
            />
          )}

          {handle && stage === "claimed" && (
            <div className="thanks__profile">
              <ProfileAvatar size={52} handle={handle} badge={false} />
              <p>
                <span className="thanks__claimed">
                  <strong>@{handle}</strong> is yours.
                </span>
                <span>Nobody else can take it now. It&rsquo;s one handle per email.</span>
              </p>
            </div>
          )}

          <div className="thanks__next">
            <p className="thanks__label">What happens next</p>
            <ol>
              <li>
                <span className="thanks__num">1</span>
                <span>
                  <strong>Nick or Axel will send you an invite.</strong> We let people in a few at a time.
                </span>
              </li>
              <li>
                <span className="thanks__num">2</span>
                <span>
                  <strong>Spread it around.</strong> Invites are limited, so get your group, your family and your
                  partner on the list.
                </span>
              </li>
              <li>
                <span className="thanks__num">3</span>
                <span>
                  <strong>Tell us what you think</strong> at{" "}
                  <a href={`mailto:${FEEDBACK_EMAIL}`}>{FEEDBACK_EMAIL}</a>.
                </span>
              </li>
            </ol>
          </div>

          <div className="thanks__share">
            <InkButton seed={`${formName}-share`} onClick={share}>
              Share with your people
            </InkButton>
            <button type="button" className="thanks__copy" onClick={copy}>
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>

          <p className="thanks__sign">Together, not apart.</p>
        </div>
      </InkCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Claim your @handle (inside the thank-you)                           */
/* ------------------------------------------------------------------ */

function ClaimHandle({
  email,
  onClaimed,
  onSkip,
}: {
  email: string;
  onClaimed: (handle: string, signup: Signup) => void;
  onSkip: () => void;
}) {
  const [value, setValue] = useState("");
  const [check, setCheck] = useState<HandleCheck | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clean = value.trim().replace(/^@/, "").toLowerCase();
  const local = clean ? handleProblem(clean) : null;

  useEffect(() => {
    setCheck(null);
    setError(null);
    if (!clean || local) return;
    const id = window.setTimeout(() => {
      checkHandle(clean)
        .then(setCheck)
        .catch(() => setCheck(null));
    }, 350);
    return () => window.clearTimeout(id);
  }, [clean, local]);

  async function claim(event: React.FormEvent) {
    event.preventDefault();
    if (!clean || local) return;
    setBusy(true);

    // 1. Reserve it. Taken, or this email already has a handle? Stop here,
    //    nothing is sent to Netlify.
    let signup: Signup;
    try {
      signup = await register(email, clean);
    } catch (err) {
      setError(
        (err as { api?: boolean }).api && err instanceof Error
          ? err.message
          : "Couldn't check that handle right now. Try again in a sec.",
      );
      setBusy(false);
      return;
    }

    // 2. Record it in the "waitlist-handle" Netlify form. It's already
    //    reserved, so a hiccup here doesn't undo the claim.
    try {
      await postHandleToNetlify(email, clean);
    } catch (err) {
      console.warn("[waitlist] waitlist-handle post failed", err);
    }

    onClaimed(clean, signup);
  }

  const hint = error ?? local ?? (check && check.handle === clean ? (check.available ? "Available" : check.reason) : null);
  const good = !error && !local && check?.available && check.handle === clean;

  return (
    <form className="claim" onSubmit={claim} noValidate>
      <p className="claim__title">
        Claim your <span className="claim__accent">@handle</span> before your mates do.
      </p>
      <div className="waitlist__row">
        <label className="sr-only" htmlFor="claim-handle">
          Your Tempo handle
        </label>
        <InkField seed="claim-field">
          <span className="claim__at" aria-hidden="true">
            @
          </span>
          <input
            id="claim-handle"
            className="waitlist__input claim__input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="yourname"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={21}
            aria-describedby="claim-hint"
          />
        </InkField>
        <InkButton seed="claim-button" type="submit" disabled={busy || !good}>
          {busy ? "Claiming" : "Claim it"}
        </InkButton>
      </div>
      <p id="claim-hint" className="claim__hint" data-good={good || undefined} aria-live="polite">
        {hint ?? "One per email. 3 to 20 characters: letters, numbers, dots and underscores."}
      </p>
      <button type="button" className="claim__skip" onClick={onSkip}>
        Skip for now
      </button>
    </form>
  );
}
