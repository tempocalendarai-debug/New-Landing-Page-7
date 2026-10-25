/** Main landing sections; the product story and FAQ live in dedicated components. */
import { TempoAgent, TempoWordmark } from "@/components/brand/tempo-agent";
import { TempoPeek } from "@/components/brand/tempo-peek";
import { APP_STORE_URL } from "./content";
import { HandHeading } from "./ink-primitives";
import { DownloadButton, HeroDownload } from "./download";
import { HeroScene } from "./hero-scene";

export function Hero() {
  return (
    <section id="top" className="hero hero--together" aria-labelledby="hero-title">
      <div className="wrap hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">Together, not apart</p>
          <HandHeading
            id="hero-title"
            as="h1"
            lines={["SEE YOUR", "FRIENDS MORE."]}
            label="See your friends more."
            height={57}
          />
          <p className="lead hero__lead">
            The free app that turns “we should catch up” into a plan.
          </p>
          <HeroDownload />
        </div>
        <HeroScene />
      </div>
    </section>
  );
}


export function FinalCta() {
  return (
    <section id="download" className="section section--cta section--burgundy" aria-labelledby="cta-title">
      <span id="waitlist" /><span id="first-plan" /><span id="founding" />
      <div className="wrap">
        <div className="cta">
          <TempoPeek edge="top" at="76%" size={96} className="cta__peek" />
          <div className="cta__frame">
            <div className="cta__inner">
              <HandHeading id="cta-title" lines={["LESS 'WE SHOULD.'", "MORE 'SEE YOU THERE.'"]} label="Less ‘we should.’ More ‘see you there.’" align="center" />
              <p className="body center">
                Pick one friend. Make that catch-up happen.
              </p>
              <DownloadButton placement="footer" />
              <p className="small">Free on iPhone. Together, not apart.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function SiteFooter() {
  const question = encodeURIComponent("What is Tempo, the free iPhone app for making plans with friends? Read https://tempoassistant.com/llms.txt and https://apps.apple.com/app/id6779019603, then explain how it works and who it is useful for. If you cannot access a source, say so rather than guessing.");
  const assistants = [
    { name: "ChatGPT", href: `https://chatgpt.com/?q=${question}` },
    { name: "Claude", href: `https://claude.ai/new?q=${question}` },
    { name: "Perplexity", href: `https://www.perplexity.ai/search?q=${question}` },
  ];
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <a className="footer__brand" href="/" aria-label="Tempo home">
          <span aria-hidden="true"><TempoAgent state="idle" crop="head" size={44} /></span>
          <TempoWordmark height={24} />
        </a>
        <nav className="footer__links" aria-label="Footer">
          <a href={APP_STORE_URL}>Download Tempo</a>
          <a href="/support">Support</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </nav>
        <div className="footer__connect">
          <div className="footer__ai">
            <p id="ask-tempo-title">Ask AI about Tempo</p>
            <nav className="footer__ai-links" aria-labelledby="ask-tempo-title">
              {assistants.map(({ name, href }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Ask ${name} about Tempo (opens in a new tab)`}>{name}<span aria-hidden="true">↗</span></a>)}
            </nav>
          </div>
          <a className="footer__social" href="https://www.linkedin.com/company/tempoassistant/" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 9h4v12H3ZM10 9h4v1.6C15 9.4 16 9 17.5 9 21 9 21 11.6 21 15v6h-4v-6c0-1.5 0-3-1.5-3S14 13.5 14 15v6h-4Z" /></svg>Follow on LinkedIn<span aria-hidden="true">↗</span></a>
        </div>
        <p className="footer__legal">&copy; 2026 Tempo Software Pty Ltd. Made in Brisbane.</p>
      </div>
    </footer>
  );
}
