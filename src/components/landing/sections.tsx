/** Main landing sections; the product story and FAQ live in dedicated components. */
import { InkCard } from "@/components/brand/ink";
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
          <InkCard seed="cta-card" padding="clamp(44px, 7vw, 76px) clamp(20px, 5vw, 64px)" radius={18}>
            <div className="cta__inner">
              <HandHeading id="cta-title" lines={["LESS 'WE SHOULD.'", "MORE 'SEE YOU THERE.'"]} label="Less ‘we should.’ More ‘see you there.’" align="center" />
              <p className="body center">
                Pick one friend. Make that catch-up happen.
              </p>
              <DownloadButton placement="footer" />
              <p className="small">Free on iPhone. Together, not apart.</p>
            </div>
          </InkCard>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function SiteFooter() {
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
        <p className="footer__legal">&copy; 2026 Tempo Software Pty Ltd. Made in Brisbane.</p>
      </div>
    </footer>
  );
}
