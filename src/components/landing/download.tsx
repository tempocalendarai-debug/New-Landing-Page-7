import { TempoAgent, TempoWordmark } from "@/components/brand/tempo-agent";
import { APP_STORE_URL } from "./content";
import { InkButton } from "./ink-primitives";

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
        <span className="launch-bar__message"><span className="launch-bar__mark" aria-hidden="true"><TempoAgent state="idle" crop="head" size={23} /></span> Your people. Your plans. Your Tempo.</span>
        <span className="fbar__left">Free on iPhone <span aria-hidden="true">↗</span></span>
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
      <details className="download-qr">
        <summary><svg aria-hidden="true" width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 2H2v5m11-5h5v5M2 13v5h5m11-5v5h-5M6 6h2v2H6zm6 0h2v2h-2zM6 12h2v2H6zm6 0h2v2h-2z" /></svg>Scan to get Tempo<span className="download-qr__toggle" aria-hidden="true">+</span></summary>
        <div className="download-qr__panel">
          <a href={APP_STORE_URL} aria-label="Open Tempo on the App Store">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/download-qr.svg" width={168} height={168} loading="lazy" alt="QR code linking to Tempo on the App Store" />
          </a>
          <div className="download-qr__copy">
            <TempoWordmark height={21} />
            <p>Scan with your<br />iPhone camera.</p>
          </div>
        </div>
      </details>
    </div>
  );
}
