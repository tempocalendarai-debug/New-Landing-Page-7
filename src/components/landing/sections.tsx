/**
 * Landing page sections. One idea per section, lots of paper showing.
 *
 * Character and card rules this file follows from the brief and the brand kit:
 *   - The fluoro swipe appears once per viewport: hero CTA, the booked time,
 *     the calendar change in the briefing, the final CTA. Each sits a full
 *     section or more from the next, so no two share a screen.
 *   - Hand lettering is headings and short labels only. Anything a person
 *     "typed" (chat, notes, plans) is sans, in their own lowercase.
 *   - TempoPeek is used once, on the final card. More than that is Clippy.
 *   - Each TempoAgent is in a different state, so their boil rates never sync.
 */

import { InkCard, InkGlyph } from "@/components/brand/ink";
import { TempoAgent } from "@/components/brand/tempo-agent";
import { FoundingStrip } from "./founding";
import { TempoPeek } from "@/components/brand/tempo-peek";
import { TempoText } from "@/components/brand/tempo-type";
import { FAQS, FEATURES } from "./content";
import { FaqItem } from "./faq-item";
import { InboxDemo } from "./inbox-demo";
import { DrawnWire, Glyph, HandHeading, Highlight } from "./ink-primitives";
import { WaitlistForm } from "./waitlist-form";

function StepHeading({ n, lines, label, id }: { n: string; lines: string[]; label: string; id: string }) {
  return (
    <div className="step">
      <span className="step__num" aria-hidden="true">
        <TempoText height={24}>{n}</TempoText>
      </span>
      <HandHeading id={id} lines={lines} label={label} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__inner">
        <div className="hero__agent">
          <TempoAgent state="idle" size={132} />
        </div>
        <p className="hero__eyebrow">Together, not apart</p>
        <HandHeading
          id="hero-title"
          as="h1"
          lines={["TEMPO DOES", "THE PLANNING"]}
          label="Tempo does the planning"
          height={64}
          boil
          align="center"
        />
        <p className="lead hero__lead">
          Life gets busy, and time with your people goes first. Tempo makes the plan for you: your
          Tempo talks to theirs, finds a time you&rsquo;re both free and puts it in both calendars.
        </p>
        <WaitlistForm name="waitlist-hero" honeypot="bot-field" highlight />
        <FoundingStrip />
        <p className="small hero__note">
          Free to join. Private beta on iPhone.{" "}
          <a className="hero__more" href="#familiar">
            Sound familiar? &darr;
          </a>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const THREAD = [
  { id: "t1", who: "Mia", text: "we should catch up soon!!", you: false },
  { id: "t2", who: "You", text: "yes!! next week?", you: true },
  { id: "t3", who: "Mia", text: "can't do tues. thurs?", you: false },
  { id: "t4", who: "You", text: "thurs is bad, maybe the week after", you: true },
];

export function CatchUp() {
  return (
    <section className="section" aria-labelledby="catchup-title">
      <div className="wrap split">
        <div className="split__text">
          <HandHeading id="catchup-title" lines={["WE SHOULD", "CATCH UP"]} label="We should catch up" />
          <p className="body">
            Everyone says it. Then it&rsquo;s forty messages about which Thursday, and the dinner
            still never happens.
          </p>
        </div>
        <div className="thread">
          <ul className="thread__list" aria-label="A chat that never lands on a date">
            {THREAD.map((m) => (
              <li key={m.id} className={`thread__item${m.you ? " thread__item--you" : ""}`}>
                <InkCard seed={`thread-${m.id}`} tilt padding="12px 16px 13px" radius={14}>
                  <p className="thread__who">{m.who}</p>
                  <p className="thread__text">{m.text}</p>
                </InkCard>
              </li>
            ))}
          </ul>
          <p className="thread__seen">Seen, three weeks ago</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const NOTES = [
  { id: "love", label: "LOVE", body: "tiny ramen bars, anything with live music", shared: true },
  { id: "skip", label: "SKIP", body: "brunch queues, and nothing before 9 on a weekend", shared: true },
  { id: "free", label: "FREE", body: "weeknights after 6 and most sundays", shared: true },
  { id: "me", label: "JUST ME", body: "saving for japan, so keep it cheap this month", shared: false },
];

export function Taste() {
  return (
    <section id="how" className="section" aria-labelledby="taste-title">
      <div className="wrap split split--flip">
        <div className="split__text">
          <StepHeading id="taste-title" n="1" lines={["YOUR TEMPO", "KNOWS YOU"]} label="Your Tempo knows you" />
          <p className="body">
            Tell Tempo what makes a plan good or bad for you. The places you love, the things
            you&rsquo;d rather skip, the nights you keep free. It keeps learning as you go.
          </p>
          <p className="body">
            Every note is yours to change. Keep one private and no one else&rsquo;s Tempo can read it.
          </p>
        </div>
        <div className="notes">
          <div className="notes__agent">
            <TempoAgent state="listening" size={84} />
          </div>
          <ul className="notes__grid" aria-label="What Tempo knows about you">
            {NOTES.map((note) => (
              <li key={note.id}>
                <InkCard seed={`note-${note.id}`} tape tilt padding="24px 20px 16px" radius={12}>
                  <TempoText height={20}>{note.label}</TempoText>
                  <p className="note__body">{note.body}</p>
                  <p className="note__meta">
                    {note.shared ? (
                      "Shared"
                    ) : (
                      <>
                        <Glyph name="lock" size={15} />
                        Private
                      </>
                    )}
                  </p>
                </InkCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Talk() {
  return (
    <section className="section" aria-labelledby="talk-title">
      <div className="wrap">
        <div className="center-head">
          <span className="step__num" aria-hidden="true">
            <TempoText height={24}>2</TempoText>
          </span>
          <HandHeading
            id="talk-title"
            lines={["TEMPOS TALK", "TO TEMPOS"]}
            label="Tempos talk to Tempos"
            align="center"
          />
          <p className="body center">
            Say who you want to see and roughly what. Your Tempo takes it to their Tempo, checks
            both calendars and both sets of notes, and settles on a time that suits you both.
          </p>
        </div>

        <div className="stage">
          <figure className="stage__agent">
            {/* headsUp, not passingNote: passingNote's note card drifts to the head's
                corner because its .tmp-jit animation overrides the group's translate. */}
            <TempoAgent state="headsUp" size={112} />
            <figcaption>Your Tempo</figcaption>
          </figure>

          <div className="stage__middle">
            <DrawnWire className="stage__wire" />
            <InkCard seed="stage-ask" padding="14px 18px 15px" radius={12} className="stage__ask">
              <p className="stage__ask-label">You said</p>
              <p className="stage__ask-text">dinner with mia next week, somewhere with pasta</p>
            </InkCard>
          </div>

          <figure className="stage__agent">
            <span className="mirror">
              <TempoAgent state="listening" size={112} />
            </span>
            <figcaption>Mia&rsquo;s Tempo</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Booked() {
  return (
    <section className="section" aria-labelledby="booked-title">
      <div className="wrap split">
        <div className="split__text">
          <StepHeading id="booked-title" n="3" lines={["ON BOTH", "CALENDARS"]} label="On both calendars" />
          <p className="body">
            You get the plan and the reason behind it. Mia gets a quick yes or no from her Tempo.
            Once she&rsquo;s in, it lands in both calendars and nobody had to chase anybody.
          </p>
          <p className="body">Nothing starts until you say send.</p>
        </div>

        <div className="booked">
          <div className="booked__agent">
            <TempoAgent state="foundIt" size={84} />
          </div>
          <InkCard seed="booked-card" padding="24px 24px 20px" radius={14}>
            <p className="booked__eyebrow">Planned by your Tempo</p>
            <p className="booked__title">Dinner with Mia</p>
            <p className="booked__when">
              <Highlight seed="booked-when">Thursday, 7:00 pm</Highlight>
            </p>
            <p className="booked__where">Nonna&rsquo;s, Paddington</p>
            <div className="booked__why">
              <p className="booked__why-label">Why this time</p>
              <p className="booked__why-text">
                You&rsquo;re both free after 6 on Thursday. Mia&rsquo;s been after pasta, and you&rsquo;d
                rather not have a late one before your 9am.
              </p>
            </div>
            <ul className="booked__status">
              <li>
                <Glyph name="check" size={17} />
                You said yes
              </li>
              <li>
                <Glyph name="check" size={17} />
                Mia said yes
              </li>
            </ul>
          </InkCard>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const PEOPLE = [
  { id: "friends", label: "FRIENDS", body: "Trivia with the old crew, on the one week everyone is actually free." },
  { id: "family", label: "FAMILY", body: "Sunday lunch at Mum's that doesn't clash with the footy." },
  { id: "partner", label: "PARTNER", body: "A date night that isn't the same Thai place again." },
];

export function People() {
  return (
    <section id="people" className="section" aria-labelledby="people-title">
      <div className="wrap">
        <div className="center-head">
          <HandHeading id="people-title" lines={["FOR YOUR", "PEOPLE"]} label="For your people" align="center" />
          <p className="body center">
            Anyone you keep meaning to see. If they&rsquo;ve got Tempo too, your Tempos can sort it out.
          </p>
        </div>
        <ul className="people">
          {PEOPLE.map((p) => (
            <li key={p.id}>
              <InkCard seed={`people-${p.id}`} tape tilt padding="28px 22px 24px" radius={12}>
                <TempoText height={20}>{p.label}</TempoText>
                <p className="people__body">{p.body}</p>
              </InkCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const BRIEFING = [
  {
    id: "today",
    label: "TODAY",
    glyph: "sun" as const,
    lines: ["Team check-in at 10, then a clear afternoon.", "Coffee with Priya at 3 is still on."],
  },
  {
    id: "week",
    label: "THIS WEEK",
    glyph: "clock" as const,
    lines: ["Quarterly report due Friday.", "Dinner with Mia on Thursday at 7."],
  },
  {
    id: "work",
    label: "WORK",
    glyph: "mail" as const,
    lines: ["Two emails need a reply.", "Alex wants to move Friday's meeting."],
  },
];

export function Week() {
  return (
    <section id="week" className="section" aria-labelledby="week-title">
      <div className="wrap split">
        <div className="split__text">
          <HandHeading id="week-title" lines={["AND THE REST", "OF YOUR WEEK"]} label="And the rest of your week" />
          <p className="body">
            Tempo is still the assistant that keeps your own week together. Every morning it briefs
            you on your day, your week and your work.
          </p>
          <p className="body">
            When things clash, it reorganises your calendar and tells you why. Like a friend who&rsquo;s
            always on top of things, so you don&rsquo;t have to be.
          </p>
        </div>

        <div className="brief">
          <div className="brief__agent">
            <TempoAgent state="wink" size={84} />
          </div>
          <InkCard seed="briefing-card" padding="24px 24px 22px" radius={14}>
            <p className="brief__eyebrow">Your Tuesday briefing</p>
            <p className="brief__title">Morning. Here&rsquo;s where things are.</p>
            <ul className="brief__list">
              {BRIEFING.map((b) => (
                <li key={b.id} className="brief__item">
                  <span className="brief__label">
                    <InkGlyph name={b.glyph} size={20} />
                    <TempoText height={20}>{b.label}</TempoText>
                  </span>
                  {b.lines.map((line) => (
                    <p key={line} className="brief__line">
                      {line}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
            <div className="brief__moved">
              <p className="brief__moved-label">Tempo moved things around</p>
              <p className="brief__moved-line">
                <Glyph name="check" size={17} />
                <span>
                  <Highlight seed="brief-moved">Gym moved to 6 pm</Highlight> so it clears your 5 pm call.
                </span>
              </p>
              <p className="brief__moved-line">
                <Glyph name="check" size={17} />
                <span>Wednesday 2 to 4 pm blocked for the report.</span>
              </p>
            </div>
          </InkCard>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Inbox() {
  return (
    <section className="section" aria-labelledby="inbox-title">
      <div className="wrap split split--flip">
        <div className="split__text">
          <HandHeading id="inbox-title" lines={["INBOX,", "HANDLED"]} label="Inbox, handled" />
          <p className="body">
            Tempo reads what comes in and tells you what actually needs you. It saves what matters
            and writes the reply in your voice.
          </p>
          <p className="body">
            Change anything you like, then send it or save it as a draft. Nothing goes out until you
            tap send.
          </p>
        </div>
        <InboxDemo />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Features() {
  return (
    <section id="features" className="section" aria-labelledby="features-title">
      <div className="wrap">
        <div className="center-head">
          <HandHeading
            id="features-title"
            lines={["PLANS, MINUS", "THE CHASING"]}
            label="Plans, minus the chasing"
            align="center"
          />
          <p className="body center">
            Tempo makes plans with the people you care about, and keeps your own week on track
            while it&rsquo;s at it.
          </p>
        </div>
        <ul className="features">
          {FEATURES.map((f) => (
            <li key={f.id}>
              <InkCard seed={`feature-${f.id}`} padding="26px 22px 24px" radius={12}>
                <span aria-hidden="true" className="features__label">
                  <TempoText height={20}>{f.label}</TempoText>
                </span>
                <h3 className="features__title">{f.title}</h3>
                <p className="features__body">{f.body}</p>
              </InkCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Faq() {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="wrap faq">
        <HandHeading id="faq-title" lines={["GOOD", "QUESTIONS"]} label="Good questions" />
        <div className="faq__list">
          {FAQS.map((f) => (
            <FaqItem key={f.q} question={f.q}>
              <p>{f.a}</p>
            </FaqItem>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function FinalCta() {
  return (
    <section id="waitlist" className="section section--cta section--burgundy" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="cta">
          <TempoPeek edge="top" at="76%" size={96} className="cta__peek" />
          <InkCard seed="cta-card" padding="clamp(44px, 7vw, 76px) clamp(20px, 5vw, 64px)" radius={18}>
            <div className="cta__inner">
              <HandHeading id="cta-title" lines={["GET ON", "THE LIST"]} label="Get on the list" boil align="center" />
              <p className="cta__rally">Together, not apart.</p>
              <p className="body center">
                Tempo is in private beta on iPhone. Join the waitlist and we&rsquo;ll email your invite.
              </p>
              <WaitlistForm name="waitlist-cta" honeypot="bot-field-cta" highlight />
              <p className="small">Free to join. $7.99 AUD a month once Tempo launches.</p>
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
        <div className="footer__brand">
          <TempoAgent state="idle" crop="head" size={44} />
          <span>Tempo</span>
        </div>
        <nav className="footer__links" aria-label="Footer">
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
