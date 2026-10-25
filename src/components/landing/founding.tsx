"use client";

/**
 * Founding 100. A spiky burgundy badge on the bottom right of a Tempo profile
 * picture. It goes to our beta testers, picked by hand in App Store Connect,
 * retained on founder profiles after the public App Store launch.
 */

import React from "react";
import { TempoAgent } from "@/components/brand/tempo-agent";
import { TempoText } from "@/components/brand/tempo-type";

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
