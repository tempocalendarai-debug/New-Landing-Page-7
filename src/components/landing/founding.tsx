"use client";

/**
 * Founding 100. A spiky burgundy badge on the bottom right of a Tempo profile
 * picture. It goes to our beta testers, picked by hand in App Store Connect,
 * so the numbers come from FOUNDING_TOTAL / FOUNDING_GIVEN in content.ts.
 */

import React from "react";
import { TempoAgent } from "@/components/brand/tempo-agent";
import { TempoText } from "@/components/brand/tempo-type";
import { HandHeading, InkButton } from "./ink-primitives";
import { FOUNDING_GIVEN, FOUNDING_TOTAL } from "./content";

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
  const foundingTotal = FOUNDING_TOTAL;
  const foundingLeft = Math.max(0, FOUNDING_TOTAL - FOUNDING_GIVEN);
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
  const total = FOUNDING_TOTAL;
  const claimed = Math.min(FOUNDING_GIVEN, FOUNDING_TOTAL);
  const left = total - claimed;
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
            The founding badge goes to our first 100 beta testers, handpicked by us. It sits on your Tempo
            profile picture for good, and there will only ever be 100.
          </p>
          <p className="body">
            You also claim your <span className="founding__handle">@handle</span> when you join, so grab yours
            before your mates do.
          </p>
          {(
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
            Join the waitlist
          </InkButton>
        </div>
      </div>
    </section>
  );
}
