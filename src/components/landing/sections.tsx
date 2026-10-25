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
                Start with one friend you’ve been meaning to see.
              </p>
              <DownloadButton placement="footer" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function SiteFooter() {
  const prompt = "How can Tempo help me make plans with friends? https://tempoassistant.com";
  const question = encodeURIComponent(prompt);
  const assistants = [
    { name: "ChatGPT", id: "chatgpt", href: `https://chatgpt.com/?q=${question}`, image: "chatgpt.svg" },
    { name: "Claude", id: "claude", href: `https://claude.ai/new?q=${question}`, image: "claude.svg" },
    { name: "Perplexity", id: "perplexity", href: `https://www.perplexity.ai/search?q=${question}`, image: "perplexity.svg" },
    { name: "Gemini", id: "gemini", href: "https://gemini.google.com/app", image: "gemini.webp" },
    { name: "Grok", id: "grok", href: `https://grok.com/?q=${question}`, image: "grok.svg" },
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
          <div className="footer__ai" data-nosnippet>
            <p id="ask-tempo-title">Ask AI about Tempo</p>
            <nav className="footer__ai-links" aria-labelledby="ask-tempo-title">
              {assistants.map(({ name, id, href, image }) => (
                id === "gemini" ? (
                  <details key={id} className="ai-gemini" id="ai-question">
                    <summary className="ai-link ai-link--gemini" title="Gemini" aria-label="Ask Gemini about Tempo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/assets/ai/${image}`} width={26} height={26} loading="lazy" alt="" />
                    </summary>
                    <div className="ai-question">
                      <p className="ai-question__label">Paste this question into Gemini</p>
                      <p id="ai-question-text">{prompt}</p>
                      <a href={href} data-copy-question target="_blank" rel="noopener noreferrer">Copy question &amp; open Gemini ↗</a>
                      <noscript><p>Copy the question above before opening Gemini.</p></noscript>
                      <p className="footer__ai-status" id="ai-copy-status" role="status" />
                    </div>
                  </details>
                ) : (
                <a key={id} className={`ai-link ai-link--${id}`} href={href} target="_blank" rel="noopener noreferrer"
                  title={name} aria-label={`Ask ${name} about Tempo (opens in a new tab)`}>
                  {/* Provider artwork is served locally; see public/assets/ai/SOURCES.md. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/assets/ai/${image}`} width={id === "chatgpt" ? 40 : 26} height={id === "chatgpt" ? 40 : 26} loading="lazy" alt="" />
                </a>
                )
              ))}
            </nav>
          </div>
          <a className="footer__social" href="https://www.linkedin.com/company/tempoassistant/" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 9h4v12H3ZM10 9h4v1.6C15 9.4 16 9 17.5 9 21 9 21 11.6 21 15v6h-4v-6c0-1.5 0-3-1.5-3S14 13.5 14 15v6h-4Z" /></svg>Follow on LinkedIn<span aria-hidden="true">↗</span></a>
        </div>
        <p className="footer__legal">&copy; 2026 Tempo Software Pty Ltd. Made in Brisbane.</p>
      </div>
      <script src="/assets/ask-ai.js" defer />
    </footer>
  );
}
