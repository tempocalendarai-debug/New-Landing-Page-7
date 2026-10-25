import { TempoAgent, TempoWordmark } from "@/components/brand/tempo-agent";
import { TempoText } from "@/components/brand/tempo-type";
import { Glyph } from "./ink-primitives";

/** An illustrative plan, drawn with the same characters as the app. */
export function HeroScene() {
  return (
    <figure className="hero-scene" aria-label="Tempo turns a dinner idea into a Friday plan with three friends.">
      <div className="hero-scene__canvas" aria-hidden="true">
        <svg className="hero-scene__drawing" viewBox="0 0 500 450" fill="none">
          <path d="M61 119C87 47 217 25 337 68C454 110 497 219 444 323C404 403 260 419 139 378C25 340 13 230 61 119Z" fill="#eee5d8" />
          <path d="M97 292C41 233 73 183 133 177M348 125C430 115 445 188 408 226M185 346C244 393 327 371 346 329" stroke="#800020" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" />
          <path d="M398 65L401 77L412 80L401 84L398 96L395 84L383 80L395 77ZM70 109L72 118L80 121L72 123L70 132L68 123L60 121L68 118Z" stroke="#800020" strokeWidth="2" strokeLinejoin="round" />
          <path d="M433 315L444 320M431 329L440 338M419 337L423 349" stroke="#800020" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="hero-scene__idea">that little ramen place?</div>
        <div className="hero-scene__friend hero-scene__friend--top"><TempoAgent state="headsUp" size={102} /></div>
        <div className="hero-scene__plan">
          <div className="hero-scene__plan-brand"><TempoWordmark height={17} /><span>One good plan</span></div>
          <p className="hero-scene__title">Dinner with<br />the crew.</p>
          <div className="hero-scene__date"><span>FRI<strong>7<span>PM</span></strong></span><p>That ramen place<br /><small>You, Jack &amp; Mia</small></p></div>
          <p className="hero-scene__confirmed"><Glyph name="check" size={17} /> Everyone&rsquo;s in</p>
        </div>
        <div className="hero-scene__friend hero-scene__friend--left"><TempoAgent state="listening" size={132} /></div>
        <div className="hero-scene__friend hero-scene__friend--right"><TempoAgent state="niceOne" size={150} /></div>
        <div className="hero-scene__note"><TempoText height={23}>SEE YOU THERE.</TempoText></div>
      </div>
      <figcaption>You bring the people. Tempo helps with the plan.</figcaption>
    </figure>
  );
}
