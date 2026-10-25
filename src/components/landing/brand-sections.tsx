/**
 * Sections driven by the brand strategy (tempo-brand-strategy.md), laid out
 * with FletchPMM's homepage flow in mind: problem first, then the life you
 * get, then exactly how the week goes, then who's behind it.
 *
 * Lettering stays headings and short labels only; anything a person "typed"
 * stays in sans. Burgundy is the one accent, used big or not at all.
 */
import { TempoAgent } from "@/components/brand/tempo-agent";
import { HandHeading } from "./ink-primitives";
import { TempoIllustration } from "./tempo-illustration";
import { FoundingBadge } from "./founding";

/* ------------------------------------------------------------------ */
/* Supported by                                                        */
/* ------------------------------------------------------------------ */

export function Backers() {
  return (
    <section className="backers" aria-label="Supported by">
      <div className="wrap backers__inner">
        <p className="backers__label">Supported by</p>
        <ul className="backers__list">
          <li>
            <a href="https://ventures.uq.edu.au/programs/ilab-accelerator" target="_blank" rel="noopener noreferrer">
              UQ iLab Accelerator
            </a>
          </li>
          <li aria-hidden="true" className="backers__sep" />
          <li>
            <a href="https://ventures.uq.edu.au/" target="_blank" rel="noopener noreferrer">
              UQ Ventures
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Discovery and memories                                              */
/* ------------------------------------------------------------------ */

export function LifeOnTempo() {
  return (
    <section id="life" className="section life-story" aria-labelledby="life-title">
      <span id="week" />
      <div className="wrap">
        <div className="life-story__heading">
          <p className="eyebrow">A little more life in your routine</p>
          <HandHeading id="life-title" lines={["MAKE THE PLAN.", "KEEP THE GOOD BITS."]} label="Make the plan. Keep the good bits." height={40} align="center" />
        </div>
        <div className="life-story__grid">
          <article className="life-feature">
            <div className="life-feature__visual discover-preview" aria-label="Illustration of plan ideas: a morning hike, live music and a new dinner spot">
              <div className="discover-preview__label"><span aria-hidden="true"><TempoAgent state="headsUp" crop="head" size={34} /></span><span>A few ideas for your crew</span></div>
              <div className="discover-preview__photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <picture>
                  <source type="image/avif" srcSet="/assets/discover-400.avif 400w, /assets/discover-600.avif 600w, /assets/discover-800.avif 800w" sizes="(max-width: 759px) calc(100vw - 92px), 450px" />
                  <img src="/assets/discover-800.webp" srcSet="/assets/discover-400.webp 400w, /assets/discover-600.webp 600w, /assets/discover-800.webp 800w" sizes="(max-width: 759px) calc(100vw - 92px), 450px" width={800} height={450} loading="lazy" decoding="async" alt="Friends heading out on a hike together" />
                </picture>
                <span>A morning with a view</span>
              </div>
              <div className="discover-preview__ideas"><span>♫ &nbsp; Live music</span><span>↗ &nbsp; Somewhere new for dinner</span></div>
            </div>
            <div className="life-feature__copy">
              <p className="eyebrow">Discover</p>
              <h3>“What should we do?”<br />Glad you asked.</h3>
              <p className="body">Find something you’ll all want to do. A favourite spot, or a first time.</p>
            </div>
          </article>
          <article className="life-feature">
            <div className="life-feature__visual journal-preview" aria-label="Illustration of a journal entry after a catch-up with friends">
              <div className="journal-preview__photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <picture>
                  <source type="image/avif" srcSet="/assets/memory-240.avif 240w, /assets/memory-360.avif 360w, /assets/memory-480.avif 480w" sizes="(max-width: 759px) 42vw, 220px" />
                  <img src="/assets/memory-480.webp" srcSet="/assets/memory-240.webp 240w, /assets/memory-360.webp 360w, /assets/memory-480.webp 480w" sizes="(max-width: 759px) 42vw, 220px" width={480} height={600} loading="lazy" decoding="async" alt="Friends laughing together after catching up" />
                </picture>
                <p>Worth making time for.</p>
              </div>
              <div className="journal-preview__note"><span>THURSDAY, FINALLY.</span><p>Same people.<br />A new favourite memory.</p></div>
              <div className="journal-preview__agent" aria-hidden="true"><TempoIllustration state="niceOne" size={92} /></div>
            </div>
            <div className="life-feature__copy">
              <p className="eyebrow">Your journal</p>
              <h3>The plan ends.<br />The memory stays.</h3>
              <p className="body">Save the moment. Share a note with your crew. Photos and ratings stay private.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Founders                                                            */
/* ------------------------------------------------------------------ */

export function Founders() {
  return (
    <section className="section section--tight" aria-labelledby="founders-title">
      <div className="wrap founders">
        <div className="founders__faces">
          {[
            { id: "nick", name: "Nick", src: "/assets/founder-nick.webp" },
            { id: "axel", name: "Axel", src: "/assets/founder-axel.webp" },
          ].map((f) => (
            <figure key={f.id} className="founders__face">
              <span className="founders__photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.src} alt={`${f.name}, co-founder of Tempo`} width={240} height={240} loading="lazy" />
              </span>
              <figcaption>
                <span className="founders__name">
                  {f.name} <FoundingBadge size={16} />
                </span>
                <span>Co-founder</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="founders__text">
          <HandHeading id="founders-title" lines={["MADE IN", "BRISBANE"]} label="Made in Brisbane" height={36} />
          <p className="body">
            We&rsquo;re Nick and Axel. We built Tempo to spend more time with our people. Made in Brisbane, for wherever yours are.
          </p>
          <p className="body">
            <a className="founders__link" href="https://www.linkedin.com/company/tempoassistant/">
              Follow along on LinkedIn
            </a>
          </p>
        </div>
        <div className="founders__agent" aria-hidden="true">
          <TempoAgent state="wink" size={72} />
        </div>
      </div>
    </section>
  );
}
