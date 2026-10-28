import { TempoAgent, TempoWordmark } from "@/components/brand/tempo-agent";
import { DownloadButton } from "./download";

/**
 * Native links and CSS hover feedback keep navigation usable without JavaScript.
 * Links point at "/#section" so the same nav works from Support, Privacy and
 * the rest; on the home page the browser just scrolls.
 */
export function SiteNav({ home = false }: { home?: boolean }) {
  return (
    <header className="nav">
      {home && <a className="skip-link" href="#main">Skip to content</a>}
      <div className="wrap nav__inner">
        <a
          href={home ? "#top" : "/"}
          className="nav__brand"
          aria-label={home ? "Tempo, back to top" : "Tempo home"}
        >
          {/* Keep the shared Tempo logo intact; its small greeting is CSS-only. */}
          <span className="nav__mark" aria-hidden="true">
            <TempoAgent state="idle" crop="head" size={46} />
          </span>
          <TempoWordmark height={24} boil={false} />
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href={home ? "#how" : "/#how"}>How it works</a>
          <a href={home ? "#life" : "/#life"}>Life on Tempo</a>
          <a href={home ? "#faq" : "/#faq"}>FAQ</a>
          <a href="/support">Support</a>
        </nav>
        <DownloadButton placement="nav" compact />
      </div>
    </header>
  );
}
