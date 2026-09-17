"use client";

/**
 * Waitlist signup. Posts to Netlify Forms with the same form names the old site
 * used, so every existing submission stays in one place. Netlify only learns
 * about forms from static HTML, which is why public/__forms.html exists and why
 * the POST goes there: keep the names and honeypots in sync with that file.
 */

import React, { useState } from "react";
import { TempoAgent } from "@/components/brand/tempo-agent";
import { InkButton, InkField } from "./ink-primitives";

type Status = "idle" | "sending" | "done" | "error" | "invalid";

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
      const body = new URLSearchParams();
      data.forEach((value, key) => body.append(key, String(value)));
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("error");
    }
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
