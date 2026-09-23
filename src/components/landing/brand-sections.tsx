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

/* ------------------------------------------------------------------ */
/* Supported by                                                        */
/* ------------------------------------------------------------------ */

export function Backers() {
  return (
    <section className="backers" aria-label="Supported by">
      <div className="wrap backers__inner">
        <p className="backers__label">Supported by</p>
        <ul className="backers__list">
          <li>UQ iLab Accelerator</li>
          <li aria-hidden="true" className="backers__sep" />
          <li>UQ Ventures</li>
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

const LIFE = [
  { id: "thursday", tag: "THURSDAY", line: "The group chat finally showed up.", src: "/assets/life-thursday.webp", alt: "Three friends laughing on a city street" },
  { id: "run", tag: "6AM RUN", line: "Everyone was free. Tempo booked it.", src: "/assets/life-run.webp", alt: "Runners mid-stride on a road" },
  { id: "trip", tag: "THE TRIP", line: "Not \u201cone day\u201d. This weekend.", src: "/assets/life-trip.webp", alt: "Three friends hiking with packs in the mountains" },
  { id: "date", tag: "DATE NIGHT", line: "Two schedules, one plan.", src: "/assets/life-date.webp", alt: "A couple sitting on the grass at sunset" },
];

export function LifeOnTempo() {
  return (
    <section className="section" aria-labelledby="life-title">
      <div className="wrap">
        <div className="center-head">
          <HandHeading id="life-title" lines={["LIFE ON", "TEMPO"]} label="Life on Tempo" align="center" />
        </div>
        <ul className="life">
          {LIFE.map((l) => (
            <li key={l.id}>
              <InkCard seed={`life-${l.id}`} tape tilt padding="10px 10px 18px" radius={10}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="life__img" src={l.src} alt={l.alt} loading="lazy" width={800} height={1000} />
                <span className="life__tag">
                  <TempoText height={20}>{l.tag}</TempoText>
                </span>
                <p className="life__line">{l.line}</p>
              </InkCard>
            </li>
          ))}
        </ul>
        <p className="life__kicker">Not a calendar. The plans you&rsquo;d never have gotten round to making.</p>
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
  { day: "FRI", you: "Morning briefing: one email needs you.", tempo: "You ask for lunch at Mum\u2019s. Her Tempo takes it from there." },
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.src} alt={`${f.name}, co-founder of Tempo`} width={240} height={240} loading="lazy" />
              <figcaption>
                {f.name}
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
