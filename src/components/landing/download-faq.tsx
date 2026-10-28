import { TempoIllustration } from "./tempo-illustration";
import { HOME_FAQS } from "./content";
import { FaqItem } from "./faq-item";
import { Glyph, HandHeading } from "./ink-primitives";

const SYMBOLS = {
  free: "M11 2a9 9 0 1 0 0 18 9 9 0 0 0 0-18M7 11l3 3 5-6",
  friends: "M8 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6M2 19v-3c0-6 12-6 12 0v3M16 4c5 0 5 6 0 6M17 13c3 0 4 2 4 5",
  calendar: "M3 5h16v15H3zM3 10h16M7 2v5M15 2v5M7 14h2M13 14h2",
  privacy: "M6 10V7a5 5 0 0 1 10 0v3M4 10h14v10H4zM11 14v3",
  control: "M3 6h16M3 16h16M8 3v6M14 13v6",
  start: "M3 12h17M13 5l7 7-7 7",
};

function AnswerIllustration({ id }: { id: keyof typeof SYMBOLS }) {
  if (id === "friends") return <div className="faq-proof faq-proof--people"><span aria-hidden="true"><TempoIllustration state="headsUp" size={44} /></span><span>You <b aria-hidden="true">＋</b> Your people</span><span aria-hidden="true"><TempoIllustration state="niceOne" size={44} /></span></div>;
  const labels = {
    free: ["Free to download", "Free to use"],
    calendar: ["Apple Calendar", "Google Calendar", "Or just Tempo"],
    privacy: ["Availability: shared", "Event titles: private"],
    control: ["Your planning settings", "Decline or cancel"],
    start: ["Add your people", "Make your first plan"],
  };
  return <div className="faq-proof">{labels[id].map(label => <span className="faq-proof__tag" key={label}><Glyph name={id === "privacy" ? "lock" : "check"} size={14} />{label}</span>)}</div>;
}

export function DownloadFaq() {
  return (
    <section tabIndex={-1} id="faq" className="section download-faq" aria-labelledby="faq-title">
      <div className="wrap faq">
        <div className="download-faq__intro">
          <div className="download-faq__agent" aria-hidden="true"><TempoIllustration state="headsUp" size={100} /></div>
          <HandHeading id="faq-title" lines={["A FEW", "GOOD QUESTIONS."]} label="A few good questions." height={34} />
          <p>The useful bits, before you jump in.</p>
          <a href="/support">Need a hand? <span aria-hidden="true">↗</span></a>
        </div>
        <div className="faq__list">
          {HOME_FAQS.map((f, i) => <FaqItem key={f.id} question={f.q} defaultOpen={i === 0} group="download-questions" icon={<svg viewBox="0 0 24 24" width={21} height={21} fill="none"><path d={SYMBOLS[f.id]} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" /></svg>}>
            <AnswerIllustration id={f.id} />
            <p>{f.a}</p>
          </FaqItem>)}
        </div>
      </div>
    </section>
  );
}
