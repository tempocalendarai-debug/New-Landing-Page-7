import { TempoWordmark } from "@/components/brand/tempo-agent";
import { TempoText } from "@/components/brand/tempo-type";
import { TempoIllustration } from "./tempo-illustration";
import { Glyph } from "./ink-primitives";

const plans = [
  { id: "dinner", label: "Dinner", idea: "that little ramen place?", title: <>Dinner with<br />the crew.</>, day: "FRI", time: "7", period: "PM", place: "That ramen place", people: "You, Jack & Mia", caption: "The group chat finally made it out." },
  { id: "coffee", label: "Coffee", idea: "coffee before the chaos?", title: <>A proper<br />catch-up.</>, day: "SAT", time: "10", period: "AM", place: "Your favourite café", people: "You & Sam", caption: "One coffee. A lot to catch up on." },
  { id: "walk", label: "A walk", idea: "a walk and a life update?", title: <>Same friends.<br />Fresh air.</>, day: "SUN", time: "4", period: "PM", place: "Down by the river", people: "You, Alex & Mia", caption: "A little less screen. A little more together." },
];

/** Native radios keep the example fully usable in the zero-JS static export. */
export function HeroScene() {
  return (
    <fieldset className="plan-playground">
      <legend className="sr-only">Choose an example plan</legend>
      <div className="plan-playground__heading"><span>A LITTLE IDEA. AN ACTUAL PLAN.</span><span>Try it ↓</span></div>
      <div className="plan-playground__choices">
        {plans.map((plan, i) => (
          <label className="plan-choice" key={plan.id}>
            <input type="radio" name="example-plan" value={plan.id} defaultChecked={i === 0} aria-controls={`example-${plan.id}`} />
            <span>{plan.label}</span>
          </label>
        ))}
      </div>
      <div className="plan-playground__scenes" aria-live="polite" aria-atomic="true">
        {plans.map(plan => (
          <figure id={`example-${plan.id}`} className={`hero-scene hero-scene--${plan.id}`} key={plan.id}>
            <div className="hero-scene__canvas" aria-hidden="true">
              <svg className="hero-scene__drawing" viewBox="0 0 500 450" fill="none">
                <ellipse cx="250" cy="238" rx="200" ry="178" stroke="currentColor" strokeWidth="1" />
                <path className="scene-route" d="M97 292C41 233 73 183 133 177M348 125C430 115 445 188 408 226M185 346C244 393 327 371 346 329" stroke="#800020" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" />
                <path d="M433 315L444 320M431 329L440 338M419 337L423 349" stroke="#800020" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div className="hero-scene__idea">{plan.idea}</div>
              <div className="hero-scene__friend hero-scene__friend--top"><TempoIllustration state="headsUp" size={102} /></div>
              <div className="hero-scene__plan">
                <div className="hero-scene__plan-brand"><TempoWordmark height={19} /><span>THE PLAN</span></div>
                <p className="hero-scene__title">{plan.title}</p>
                <div className="hero-scene__date"><span>{plan.day}<strong>{plan.time}<span>{plan.period}</span></strong></span><p>{plan.place}<br /><small>{plan.people}</small></p></div>
                <p className="hero-scene__confirmed"><Glyph name="check" size={17} /> Everyone&rsquo;s in</p>
              </div>
              <div className="hero-scene__friend hero-scene__friend--left"><TempoIllustration state="thinking" size={132} /></div>
              <div className="hero-scene__friend hero-scene__friend--right"><TempoIllustration state="niceOne" size={150} /></div>
              <div className="hero-scene__note"><TempoText height={23}>SEE YOU THERE.</TempoText></div>
            </div>
            <figcaption>{plan.caption}<span className="sr-only"> Example: {plan.people}, {plan.day} at {plan.time} {plan.period}, {plan.place}. Everyone has agreed.</span></figcaption>
          </figure>
        ))}
      </div>
      <p className="plan-playground__disclaimer">An example of a plan on Tempo</p>
    </fieldset>
  );
}
