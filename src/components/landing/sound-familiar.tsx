import { TempoAgent } from "@/components/brand/tempo-agent";
import { HandHeading } from "./ink-primitives";

const MOMENTS = [
  { quote: "“We should catch up soon.”", context: "The chat that never becomes a plan.", answer: "Give it a day, a time and a place." },
  { quote: "“When is everyone free?”", context: "Six people. Six different schedules.", answer: "Let your Tempos find the overlap." },
  { quote: "“What should we do?”", context: "Same people. Same place. Again.", answer: "Find something you’ll all want to try." },
];

/** Readable in one pass. No quiz or interaction needed to see the answer. */
export function SoundFamiliar() {
  return (
    <section id="familiar" className="familiar-story" aria-labelledby="familiar-title">
      <div className="wrap">
        <div className="familiar-story__heading">
          <HandHeading id="familiar-title" lines={["SOUND FAMILIAR?"]} label="Sound familiar?" height={34} />
          <p>Good intentions. Busy lives. A little help goes a long way.</p>
        </div>
        <ul className="familiar-story__moments">
          {MOMENTS.map((moment) => (
            <li key={moment.quote}>
              <h3>{moment.quote}</h3>
              <p>{moment.context}</p>
              <p className="familiar-story__answer"><span aria-hidden="true">↳</span> {moment.answer}</p>
            </li>
          ))}
        </ul>
        <a className="familiar-story__next" href="#how">
          <span aria-hidden="true"><TempoAgent state="wink" crop="head" size={38} /></span>
          Here&rsquo;s where Tempo comes in <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
