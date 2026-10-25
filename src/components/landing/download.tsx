import { TempoAgent } from "@/components/brand/tempo-agent";
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
