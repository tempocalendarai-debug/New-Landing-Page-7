import { TempoAgent } from "@/components/brand/tempo-agent";
import { APP_STORE_URL } from "./content";
import { HandHeading, InkButton } from "./ink-primitives";

/** Plain links work before hydration and let iOS open the App Store naturally. */
export function DownloadButton({ placement, compact = false }: { placement: string; compact?: boolean }) {
  return (
    <InkButton seed={`download-${placement}`} href={APP_STORE_URL} size={compact ? "sm" : "md"} className="download-button">
      {compact ? "Get Tempo" : "Download for iPhone"}
    </InkButton>
  );
}

export function LaunchBar() {
  return (
    <a className="fbar launch-bar" href={APP_STORE_URL}>
      <span className="fbar__inner">
        <span>Tempo is on the App Store</span>
        <span className="fbar__left">Get it free <span aria-hidden="true">↗</span></span>
      </span>
    </a>
  );
}

export function HeroDownload() {
  return (
    <div className="hero-download">
      <div className="hero-download__actions">
        <a className="app-store-badge" href={APP_STORE_URL} aria-label="Download Tempo on the App Store">
          {/* Official Apple artwork, kept unmodified and served locally. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/download-on-the-app-store.svg" width={180} height={60} alt="Download on the App Store" />
        </a>
        <a className="hero__more" href="#how">See how it works <span aria-hidden="true">↓</span></a>
      </div>
      <p className="small hero__note">Free on iPhone · iOS 17 or later</p>
      <details className="download-qr">
        <summary>On your computer? Scan to download</summary>
        <div className="download-qr__panel">
          <a href={APP_STORE_URL} aria-label="Open Tempo on the App Store">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/download-qr.svg" width={168} height={168} alt="QR code linking to Tempo on the App Store" />
          </a>
          <p>Open your iPhone camera and point it here.</p>
        </div>
      </details>
    </div>
  );
}

const STEPS = [
  { title: "Get your Tempo", body: "Download the app and tell Tempo a little about what you like.", state: "headsUp" as const },
  { title: "Bring your people", body: "Add a friend, your partner or the whole crew. Their Tempos help find time together.", state: "listening" as const },
  { title: "Put something on the calendar", body: "Pick a plan, find a time and say yes. Then go make a memory.", state: "niceOne" as const },
];

export function FirstPlan() {
  return (
    <section id="first-plan" className="section" aria-labelledby="first-plan-title">
      {/* Older campaign links to the founding section still reach a useful next step. */}
      <span id="founding" />
      <div className="wrap first-plan">
        <div className="center-head">
          <HandHeading id="first-plan-title" lines={["YOUR NEXT", "'WE SHOULD'", "STARTS HERE"]} label="Your next ‘we should’ starts here" align="center" />
          <p className="body center">Start with one person you&rsquo;ve been meaning to see.</p>
        </div>
        <ol className="first-plan__steps">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <div aria-hidden="true"><TempoAgent state={step.state} size={90} /></div>
              <p className="first-plan__number">0{i + 1}</p>
              <h3>{step.title}</h3>
              <p className="body">{step.body}</p>
            </li>
          ))}
        </ol>
        <DownloadButton placement="first-plan" />
      </div>
    </section>
  );
}
