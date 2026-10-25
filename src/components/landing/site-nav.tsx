"use client";

import { useEffect, useState } from "react";
import { TempoAgent, TempoWordmark } from "@/components/brand/tempo-agent";
import { DownloadButton } from "./download";

/**
 * Solid paper, no blur. A hairline appears once the page moves under it.
 * Links point at "/#section" so the same nav works from Support, Privacy and
 * the rest; on the home page the browser just scrolls.
 */
export function SiteNav({ home = false }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState(false);

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
        <a
          href={home ? "#top" : "/"}
          className="nav__brand"
          data-hover={hover}
          aria-label={home ? "Tempo, back to top" : "Tempo home"}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
        >
          {/* The Tempo guy is the logo. Hover: he lights up and waves, the wordmark stays still. */}
          <span className="nav__mark" aria-hidden="true">
            <TempoAgent state={hover ? "foundIt" : "idle"} crop="head" size={46} />
          </span>
          <TempoWordmark height={24} boil={false} />
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href="/#how">How it works</a>
          <a href="/#life">Life on Tempo</a>
          <a href="/#faq">FAQ</a>
          <a href="/support">Support</a>
        </nav>
        <DownloadButton placement="nav" compact />
      </div>
    </header>
  );
}
