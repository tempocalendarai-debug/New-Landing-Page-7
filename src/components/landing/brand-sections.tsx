/**
 * Sections driven by the brand strategy (tempo-brand-strategy.md), laid out
 * with FletchPMM's homepage flow in mind: problem first, then the life you
 * get, then exactly how the week goes, then who's behind it.
 *
 * Lettering stays headings and short labels only; anything a person "typed"
 * stays in sans. Burgundy is the one accent, used big or not at all.
 */
import { InkCard } from "@/components/brand/ink";
import { TempoAgent } from "@/components/brand/tempo-agent";
import { TempoText } from "@/components/brand/tempo-type";
import { Glyph, HandHeading } from "./ink-primitives";
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
/* Plan ticker: our version of a logo wall                             */
/* ------------------------------------------------------------------ */

const PLANS = [
  "POKER NIGHT",
  "DATE NIGHT",
  "SUNDAY LUNCH AT MUM'S",
  "6AM RUN",
  "TRIVIA",
  "THAT RESTAURANT",
  "THE ROAD TRIP",
  "BIRTHDAY DRINKS",
];

export function PlanTicker() {
  const row = PLANS.map((p) => (
    <span key={p} className="ticker__item">
      <TempoText height={22}>{p}</TempoText>
      <span className="ticker__dot" />
    </span>
  ));
  return (
    <section className="ticker" aria-label="Plans Tempo makes">
      <p className="ticker__label">For the plans you keep meaning to make</p>
      <div className="ticker__viewport">
        <div className="ticker__track" aria-hidden="true">
          {row}
          {row}
        </div>
        <p className="sr-only">{PLANS.join(", ")}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Life on Tempo                                                       */
/* ------------------------------------------------------------------ */

export function LifeOnTempo() {
  return (
    <section id="life" className="section life-story" aria-labelledby="life-title">
      <span id="week" />
      <div className="wrap">
        <div className="life-story__heading">
          <p className="eyebrow">A little more life in your routine</p>
          <HandHeading id="life-title" lines={["MAKE THE PLAN.", "KEEP THE GOOD BITS."]} label="Make the plan. Keep the good bits." height={40} align="center" />
          <p className="body center">From finding your next thing to remembering the last one.</p>
        </div>
        <div className="life-story__grid">
          <article className="life-feature">
            <div className="life-feature__visual discover-preview" aria-label="Illustration of plan ideas: a morning hike, live music and a new dinner spot">
              <div className="discover-preview__label"><span aria-hidden="true"><TempoAgent state="headsUp" crop="head" size={34} /></span><span>A few ideas for your crew</span></div>
              <div className="discover-preview__photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/life-trip.webp" width={800} height={1000} loading="lazy" alt="Friends heading out on a hike together" />
                <span>A morning with a view</span>
              </div>
              <div className="discover-preview__ideas"><span>♫ &nbsp; Live music</span><span>↗ &nbsp; Somewhere new for dinner</span></div>
            </div>
            <div className="life-feature__copy">
              <p className="eyebrow">Discover</p>
              <h3>“What should we do?”<br />Glad you asked.</h3>
              <p className="body">Find events, activities and ideas that fit what you and your friends enjoy. Revisit a favourite or try something completely new.</p>
            </div>
          </article>
          <article className="life-feature">
            <div className="life-feature__visual journal-preview" aria-label="Illustration of a journal entry after a catch-up with friends">
              <div className="journal-preview__photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/life-thursday.webp" width={800} height={1000} loading="lazy" alt="Friends laughing together after catching up" />
                <p>Worth making time for.</p>
              </div>
              <div className="journal-preview__note"><span>THURSDAY, FINALLY.</span><p>Same people.<br />A new favourite memory.</p></div>
              <div className="journal-preview__agent" aria-hidden="true"><TempoAgent state="niceOne" size={92} /></div>
            </div>
            <div className="life-feature__copy">
              <p className="eyebrow">Your journal</p>
              <h3>The plan ends.<br />The memory stays.</h3>
              <p className="body">Keep photos and notes from the time you spent together. Share a note with your crew; your photos and ratings stay private.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Your week, with Tempo (the Fletch "exactly what the sprint looks    */
/* like" timeline, turned into a week of real life)                    */
/* ------------------------------------------------------------------ */

const WEEK = [
  { day: "MON", you: "Lectures till 3. Shift at 6.", tempo: "You tell Tempo: dinner with Sam this week, somewhere with pasta." },
  { day: "TUE", you: "Assignment due Friday.", tempo: "Your Tempo checks with Sam\u2019s Tempo. Both calendars, both sets of notes." },
  { day: "WED", you: "Tutorial moved to 2.", tempo: "Sam says yes. It\u2019s in both calendars." },
  { day: "THU", you: "Dinner with Sam, 7pm.", tempo: "Nonna\u2019s, Paddington. Nobody had to chase anybody.", hot: true },
  { day: "FRI", you: "Two plans this week, both in your calendar.", tempo: "You ask for lunch at Mum\u2019s. Her Tempo takes it from there." },
  { day: "SAT", you: "6am run.", tempo: "Mum says yes. Sunday lunch, locked in." },
  { day: "SUN", you: "Lunch at Mum\u2019s.", tempo: "Then nothing on. Exactly how you wanted it." },
];

export function YourWeek() {
  return (
    <section id="week" className="section" aria-labelledby="week-title">
      <div className="wrap">
        <div className="center-head">
          <HandHeading id="week-title" lines={["HERE'S YOUR WEEK", "WITH TEMPO"]} label="Here's your week with Tempo" align="center" />
          <p className="body center">
            Life stays busy. You get on with it, and Tempo sorts the plans in the background.
          </p>
        </div>
        <div className="week" role="table" aria-label="A week with Tempo">
          <div className="week__row week__row--head" role="row">
            <span role="columnheader" />
            <span role="columnheader" className="week__col-label">Your week</span>
            <span role="columnheader" className="week__col-label">Your Tempo</span>
          </div>
          {WEEK.map((d) => (
            <div key={d.day} className="week__row" role="row" data-hot={d.hot || undefined}>
              <span role="rowheader" className="week__day">
                <TempoText height={20}>{d.day}</TempoText>
              </span>
              <span role="cell" className="week__you">{d.you}</span>
              <span role="cell" className="week__tempo">
                <Glyph name="check" size={17} />
                <span>{d.tempo}</span>
              </span>
            </div>
          ))}
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
            Tempo is built by Nick and Axel in Brisbane. We&rsquo;re documenting the whole thing, the
            building and the plans Tempo makes for us along the way.
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
