import { TempoIllustration } from "./tempo-illustration";
import { Glyph, HandHeading } from "./ink-primitives";

const steps = [
  { id: "people", label: "The people", title: "Pick your people.", body: "Tell Tempo who you want to see and what you have in mind. Dinner with the crew. Coffee with a friend. Start there.", note: "You bring the idea.", state: "headsUp" as const },
  { id: "time", label: "The time", title: "Skip the back-and-forth.", body: "Your Tempo works with your friends’ Tempos to find a time that fits. Friends see when you’re free, not the details of your calendar.", note: "Tempo sorts the schedules.", state: "thinking" as const },
  { id: "plan", label: "The plan", title: "See you there.", body: "Once everyone has agreed, the plan is in your schedules. The who, where and when, all sorted. Go enjoy your people.", note: "You make the memories.", state: "niceOne" as const },
];

/** An in-place, keyboard-operable story. No scroll hijacking or timed carousel. */
export function PlanStory() {
  return (
    <section id="how" className="section story" aria-labelledby="story-title" tabIndex={-1}>
      <span id="familiar" />
      <div className="wrap">
        <div className="story__heading">
          <div><p className="eyebrow">The most organised friend in the group</p><HandHeading id="story-title" lines={["OUT OF THE CHAT.", "INTO REAL LIFE."]} label="Out of the chat. Into real life." height={40} /></div>
          <p>From “we should” to “see you there”.<br />Explore the three little steps.</p>
        </div>
        <fieldset className="story-browser">
          <legend className="sr-only">Explore how Tempo makes a plan</legend>
          <div className="story-browser__choices">
            {steps.map((step, i) => <label className="story-choice" key={step.id}>
              <input type="radio" name="planning-step" value={step.id} defaultChecked={i === 0} aria-controls={`step-${step.id}`} />
              <span><small>0{i + 1}</small>{step.label}<b aria-hidden="true">↗</b></span>
            </label>)}
          </div>
          <div className="story-browser__panels" aria-live="polite" aria-atomic="true">
            {steps.map((step, i) => <article className={`story-panel story-panel--${step.id}`} id={`step-${step.id}`} key={step.id}>
              <div className="story-panel__copy">
                <p className="story-panel__number">0{i + 1} <span>/ 03</span></p>
                <h3>{step.title}</h3><p>{step.body}</p>
                <div className="story-panel__note"><TempoIllustration state={step.state} size={48} /><span>{step.note}</span></div>
              </div>
              <div className={`story-art story-art--${step.id}`} aria-hidden="true">
                {step.id === "people" && <>
                  <div className="story-art__message">Dinner with Jack &amp; Mia<br />this week?</div>
                  <div className="story-art__response"><span className="story-art__from">YOUR TEMPO</span>I&rsquo;ll find a time.</div>
                  <div className="story-art__character"><TempoIllustration state="headsUp" size={130} /></div>
                  <div className="story-art__people"><span>You</span><span>Jack</span><span>Mia</span></div>
                </>}
                {step.id === "time" && <div className="schedule-card">
                  <p className="schedule-card__title">A Friday that works.</p>
                  <div className="availability"><div className="availability__times"><span /><span>6 pm</span><strong>7 pm</strong><span>8 pm</span></div>
                    {["You", "Jack", "Mia"].map((name, index) => <div className="availability__row" key={name}><span>{name}</span><i data-busy={index !== 1 || undefined} /><i className="availability__match"><Glyph name="check" size={19} /></i><i data-busy={index === 1 || undefined} /></div>)}
                  </div><p className="schedule-card__match"><Glyph name="check" size={18} /> A time for all three.</p>
                  <p className="schedule-card__privacy"><Glyph name="lock" size={14} /> Calendar details stay private.</p>
                </div>}
                {step.id === "plan" && <>
                  <div className="story-ticket"><p>FRIDAY IS LOOKING GOOD.</p><strong>Dinner with<br />the crew.</strong><div><span>FRI<br /><b>7 <small>PM</small></b></span><span>That ramen place<br /><small>You, Jack &amp; Mia</small></span></div><p className="story-ticket__stamp"><Glyph name="check" size={22} /> Locked in.</p></div>
                  <div className="story-art__celebrate"><TempoIllustration state="niceOne" size={120} /></div>
                </>}
              </div>
            </article>)}
          </div>
        </fieldset>
        <p className="story__footnote">Your people. Your plans. <a href="#download">Find your Tempo <span aria-hidden="true">↗</span></a></p>
      </div>
    </section>
  );
}
