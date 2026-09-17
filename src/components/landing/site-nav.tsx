"use client";

import { useEffect, useState } from "react";
import { TempoWordmark } from "@/components/brand/tempo-agent";
import { InkButton } from "./ink-primitives";

/**
 * Solid paper, no blur. A hairline appears once the page moves under it.
 * Links point at "/#section" so the same nav works from Support, Privacy and
 * the rest; on the home page the browser just scrolls.
 */
export function SiteNav({ home = false }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    // iOS Safari only applies :active while a touch listener exists somewhere on
    // the page. Without this, the press animation in globals.css never shows on iPhone.
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      document.removeEventListener("touchstart", noop);
    };
  }, []);

  return (
    <header className="nav" data-scrolled={scrolled}>
      <div className="wrap nav__inner">
        <a href={home ? "#top" : "/"} className="nav__brand" aria-label={home ? "Tempo, back to top" : "Tempo home"}>
          <TempoWordmark height={24} />
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href="/#how">How it works</a>
          <a href="/#week">Your week</a>
          <a href="/#faq">FAQ</a>
          <a href="/support">Support</a>
        </nav>
        <InkButton seed="nav-cta" href="/#waitlist" size="sm">
          Join the waitlist
        </InkButton>
      </div>
    </header>
  );
}
