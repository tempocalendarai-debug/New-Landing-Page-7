"use client";

/**
 * Founding 100. The first 100 people on the waitlist get a spiky burgundy
 * badge on the bottom right of their Tempo profile picture. The count of
 * badges left is live (see waitlist-api.ts).
 */

import React from "react";
import { TempoAgent } from "@/components/brand/tempo-agent";
import { TempoText } from "@/components/brand/tempo-type";
import { HandHeading, InkButton } from "./ink-primitives";
import { useWaitlistStats } from "./waitlist-api";

/** Spiky verification circle: 14 soft points, drawn a touch uneven on purpose. */
const SPIKES = (() => {
  const n = 14;
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const wobble = i % 2 === 0 ? [0, 0.25, -0.2, 0.15, -0.1][i % 5] : 0;
    const r = i % 2 === 0 ? 11 + wobble : 9.1;
    pts.push(`${(12 + r * Math.cos(a)).toFixed(2)} ${(12 + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
})();

export function FoundingBadge({ size = 24, title = "Founding member" }: { size?: number; title?: string }) {
  return (
    <svg className="founding-badge" width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={title}>
      <path d={SPIKES} fill="var(--brand-burgundy)" stroke="var(--brand-burgundy)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7.6 12.4 C8.8 13.5 9.8 14.5 10.7 15.4 C12.6 13.2 14.5 11 16.5 8.8" fill="none" stroke="var(--ink-paper)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A profile picture with the badge tucked into the bottom right. */
export function ProfileAvatar({ size = 64, handle, badge = true }: { size?: number; handle?: string | null; badge?: boolean }) {
  return (
    <span className="avatar" style={{ width: size, height: size }}>
      <span className="avatar__face">
        {handle ? (
          <TempoText height={Math.round(size * 0.36)}>{handle.charAt(0).toUpperCase()}</TempoText>
        ) : (
          <TempoAgent state="idle" crop="head" size={Math.round(size * 0.52)} />
        )}
      </span>
      {badge && (
        <span className="avatar__badge" style={{ width: size * 0.38, height: size * 0.38 }}>
          <FoundingBadge size={Math.round(size * 0.38)} />
        </span>
      )}
    </span>
  );
}

/** Small line under the hero form: "63 of 100 founding badges left". Hidden until real numbers load. */
export function FoundingStrip() {
  const stats = useWaitlistStats();
  if (!stats) return null;
  const { foundingLeft, foundingTotal } = stats;
  return (
    <a className="founding-strip" href="#founding">
      <ProfileAvatar size={40} />
      <span>
        {foundingLeft > 0 ? (
          <>
            <strong>
              {foundingLeft} of {foundingTotal}
            </strong>{" "}
            founding badges left
          </>
        ) : (
          <>All {foundingTotal} founding badges are gone</>
        )}
      </span>
    </a>
  );
}

export function FoundingSection() {
  const stats = useWaitlistStats();
  const total = stats?.foundingTotal ?? 100;
  const left = stats?.foundingLeft ?? null;
  const claimed = left === null ? null : total - left;
  return (
    <section id="founding" className="section" aria-labelledby="founding-title">
      <div className="wrap founding">
        <div className="founding__preview">
          <ProfileAvatar size={180} />
          <p className="founding__name">
            you <FoundingBadge size={18} />
          </p>
          <p className="founding__role">Founding member</p>
        </div>
        <div className="founding__text">
          <HandHeading id="founding-title" lines={["THE FOUNDING", "100"]} label="The founding 100" />
          <p className="body">
            The first 100 people on the waitlist get the founding badge on their Tempo profile picture. It stays
            there for good, and there will only ever be 100.
          </p>
          <p className="body">
            You also claim your @handle when you join, so grab yours before your mates do.
          </p>
          {claimed !== null && left !== null && (
            <div className="founding__meter" aria-label={`${claimed} of ${total} founding badges claimed`}>
              <div className="founding__bar">
                <span style={{ width: `${Math.min(100, (claimed / total) * 100)}%` }} />
              </div>
              <p className="founding__count">
                <strong>{claimed} claimed</strong> · {left > 0 ? `${left} left` : "all gone"}
              </p>
            </div>
          )}
          <InkButton seed="founding-cta" href="#waitlist">
            {left === 0 ? "Join the waitlist" : "Get my badge"}
          </InkButton>
        </div>
      </div>
    </section>
  );
}
