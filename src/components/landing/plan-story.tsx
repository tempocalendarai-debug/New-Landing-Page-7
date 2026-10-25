import { TempoIllustration } from "./tempo-illustration";
import { DownloadButton } from "./download";
import { Glyph, HandHeading } from "./ink-primitives";

/** Three illustrative scenes, readable without clicking or scrolling a carousel. */
export function PlanStory() {
  return (
    <section id="how" className="section plan-story" aria-labelledby="story-title">
      <span id="familiar" />
      <div className="wrap">
        <div className="center-head plan-story__heading">
          <p className="eyebrow">From “we should” to “see you there”</p>
          <HandHeading id="story-title" lines={["LESS BACK-AND-FORTH.", "MORE BEING THERE."]} label="Less back-and-forth. More being there." height={38} align="center" />
        </div>
        <ol className="plan-story__scenes">
          <li>
            <div className="plan-scene plan-scene--ask" aria-hidden="true">
              <div className="plan-scene__bubble">Dinner with Jack &amp; Mia<br />this week?</div>
              <span className="plan-scene__reply">I&rsquo;ll find a time.</span>
              <div className="plan-scene__agent"><TempoIllustration state="headsUp" size={92} /></div>
            </div>
            <div className="plan-story__caption"><span>01</span><div><h3>Pick your people.</h3><p>Tell Tempo who you want to see and what you have in mind.</p></div></div>
          </li>
          <li>
            <div className="plan-scene plan-scene--time" aria-hidden="true">
              <p className="plan-scene__eyebrow">Friday evening</p>
              <div className="availability"><div className="availability__times"><span /><span>6 pm</span><strong>7 pm</strong><span>8 pm</span></div>
                {["You", "Jack", "Mia"].map((name, i) => <div className="availability__row" key={name}><span>{name}</span><i data-busy={i !== 1 || undefined} /><i className="availability__match"><Glyph name="check" size={17} /></i><i data-busy={i === 1 || undefined} /></div>)}
              </div>
              <p className="plan-scene__match"><Glyph name="check" size={17} /> A time for all three</p>
            </div>
            <div className="plan-story__caption"><span>02</span><div><h3>Let Tempo find a time.</h3><p>Your Tempos sort the schedules. You skip the back-and-forth.</p></div></div>
          </li>
          <li>
            <div className="plan-scene plan-scene--go" aria-hidden="true">
              <div className="plan-scene__ticket"><span className="plan-scene__eyebrow">You&rsquo;re all in</span><strong>Dinner with<br />the crew.</strong><p>Friday · 7 pm</p><span className="plan-scene__ticket-check"><Glyph name="check" size={24} /></span></div>
              <div className="plan-scene__happy"><TempoIllustration state="niceOne" size={84} /></div>
            </div>
            <div className="plan-story__caption"><span>03</span><div><h3>Make it happen.</h3><p>Everyone&rsquo;s in. It&rsquo;s in your schedules. Go enjoy your people.</p></div></div>
          </li>
        </ol>
        <div className="plan-story__download"><DownloadButton placement="story" /><p>Start with one friend you&rsquo;ve been meaning to see.</p></div>
      </div>
    </section>
  );
}
