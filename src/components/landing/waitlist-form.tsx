"use client";

/**
 * Waitlist signup. Posts to Netlify Forms with the same form names the old site
 * used, so every existing submission stays in one place. Netlify only learns
 * about forms from static HTML, which is why public/__forms.html exists and why
 * the POST goes there: keep the names and honeypots in sync with that file.
 */

import React, { useEffect, useState } from "react";
import { TempoAgent } from "@/components/brand/tempo-agent";
import { FoundingBadge, ProfileAvatar } from "./founding";
import { InkButton, InkField } from "./ink-primitives";
import { checkHandle, handleProblem, register, type HandleCheck, type Signup } from "./waitlist-api";

type Status = "idle" | "sending" | "claim" | "done" | "error" | "invalid";

export function WaitlistForm({
  name,
  honeypot,
  highlight = false,
}: {
  name: "waitlist-hero" | "waitlist-cta";
  honeypot: string;
  highlight?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [signup, setSignup] = useState<Signup | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("invalid");
      return;
    }

    setStatus("sending");
    try {
      // Netlify Forms keeps the actual email addresses, as before. It doesn't
      // exist under `npm run dev`, so it's skipped locally.
      if (process.env.NODE_ENV !== "development") {
        const body = new URLSearchParams();
        data.forEach((value, key) => body.append(key, String(value)));
        const res = await fetch("/__forms.html", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
        if (!res.ok) throw new Error(String(res.status));
      }
    } catch {
      setStatus("error");
      return;
    }

    // Live counter, founding badge and handle. If this part is down the
    // signup still counts (it's in Netlify Forms), so just say they're in.
    try {
      const s = await register(email);
      setEmail(email);
      setSignup(s);
      setStatus("claim");
    } catch {
      setStatus("done");
    }
  }

  if (status === "claim" && signup) {
    return <ClaimHandle email={email} signup={signup} onDone={(s) => { setSignup(s); setStatus("done"); }} />;
  }

  if (status === "done" && signup) {
    return <Welcome signup={signup} />;
  }

  if (status === "done") {
    return (
      <div className="waitlist-done" role="status">
        <TempoAgent state="niceOne" size={64} />
        <div>
          <p className="waitlist-done__title">You&rsquo;re in.</p>
          <p className="waitlist-done__body">Thanks for joining. Stay ready to meet Tempo.</p>
        </div>
      </div>
    );
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
/* Step 2: claim your @handle                                          */
/* ------------------------------------------------------------------ */

function ClaimHandle({ email, signup, onDone }: { email: string; signup: Signup; onDone: (s: Signup) => void }) {
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
    try {
      onDone(await register(email, clean));
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't go through. Try again.");
      setBusy(false);
    }
  }

  const hint = error ?? local ?? (check && check.handle === clean ? (check.available ? "Available" : check.reason) : null);
  const good = !error && !local && check?.available && check.handle === clean;

  return (
    <form className="claim" onSubmit={claim} noValidate>
      <p className="claim__status" role="status">
        {signup.founding ? (
          <>
            <FoundingBadge size={20} /> You&rsquo;re founding member <strong>#{signup.foundingNumber}</strong> of{" "}
            {signup.foundingTotal}.
          </>
        ) : (
          <>
            You&rsquo;re <strong>#{signup.position}</strong> on the waitlist.
          </>
        )}
      </p>
      <p className="claim__title">Now claim your @handle before your mates do.</p>
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
        {hint ?? "3 to 20 characters. Letters, numbers, dots and underscores."}
      </p>
      <button type="button" className="claim__skip" onClick={() => onDone(signup)}>
        Skip for now
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Done                                                                */
/* ------------------------------------------------------------------ */

function Welcome({ signup }: { signup: Signup }) {
  return (
    <div className="waitlist-done welcome" role="status">
      <ProfileAvatar size={72} handle={signup.handle} badge={signup.founding} />
      <div>
        <p className="waitlist-done__title">
          {signup.handle ? `@${signup.handle}` : "You\u2019re in."}
          {signup.founding && signup.handle && <FoundingBadge size={18} />}
        </p>
        <p className="waitlist-done__body">
          {signup.founding
            ? `Founding member #${signup.foundingNumber}. The badge is yours for good.`
            : `You're #${signup.position} on the waitlist. Stay ready to meet Tempo.`}
        </p>
      </div>
    </div>
  );
}
