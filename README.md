# Tempo landing page

Ink-on-paper landing page for [tempoassistant.com](https://tempoassistant.com). Next.js 16 static export, served by Netlify from `out/`.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # writes out/
npm run preview      # serves out/ at http://localhost:3007 with clean URLs like Netlify
npm run check:export # checks the static homepage's content, assets and native interactions
```

## Brand kit comes from the app

`src/components/brand/` is a byte-identical copy of `src/components/brand/` in
[axelgf519-gif/Tempo-Nodejs](https://github.com/axelgf519-gif/Tempo-Nodejs). The page imports
`TempoText`, `TempoAgent`, `TempoPeek`, `InkCard` and `wobblyRect` from there, so the site and the
app draw with the same code. Do not edit those files here; change them in the app, then:

```bash
npm run brand:sync   # copies from ../Tempo-Nodejs (or BRAND_SRC=...) and updates brand.lock.json
npm run brand:check  # fails if the vendored files drifted; Netlify runs this before every build
```

Landing-only code lives in `src/components/landing/`.

## Static homepage contract

The published homepage ships no executable JavaScript or React/Next runtime. `scripts/optimize-home-export.mjs` uses an HTML parser after Next's static export to remove hydration/router scripts, preserve the metadata and JSON-LD, and inline the small stylesheet with corrected asset URLs. Plain anchors provide smooth scrolling (instant under reduced motion); native disclosures provide FAQ and QR interactions. Two native radio groups power the hero examples and the three-step product story. Navigation and the final CTA frame render completely without client measurement.

Keep homepage interactions native. Before adding a React event handler, form, dynamic component or `next/link`, revisit this export step. It fails on unexpected scripts, streamed boundaries, or form controls other than the two explicitly allowed native radio groups. Other routes retain the Next runtime, including Contact's copy-address button. Use `npm run preview` to check the published behavior; it compresses text responses like Netlify. `npm run dev` still runs Next normally. Export regression checks run at the end of every build.

## Other files

- The homepage links directly to the App Store. The old Netlify forms and waitlist function remain for historical submissions; the landing page no longer mounts them or polls their stats.
- `/support`, `/contact`, `/privacy` and `/terms` are Next routes in `src/app`. The legal wording lives as HTML in `src/content/legal/` and is read at build time, so edit the text there.
- The site is light only. There is no dark palette, whatever the visitor's system theme.
- `legacy/` holds the previous static HTML landing pages for reference. Not deployed.

## App Store downloads

`src/content/app-store.json` is the single source for the app ID, App Store URL and minimum iOS version. It feeds download links, the Safari Smart App Banner, structured data and the QR generator. `npm run build` regenerates the QR SVG before exporting the site. All download links work without JavaScript.

The download badge is Apple's unmodified official artwork from https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg. Keep its clear space and proportions; use the ink buttons for secondary download prompts.

After publishing, follow `INDEXING_CHECKLIST.md` to request a fresh crawl. Search rankings and App Store installs are not measured by this change. Configure campaign links in App Store Connect if attribution is needed; do not treat website clicks as installs.

## Landing art and motion

The hero is a responsive illustration in `hero-scene.tsx`, assembled from the existing Tempo character and wordmark. It is an example plan, not an app screenshot. Keep the headphone character consistent across navigation, illustrations, footer, icons and social previews; do not substitute the older hourglass mark.

The page leads with “See your friends more”. Visitors choose Dinner, Coffee or A walk to see an illustrative plan change. The “Out of the chat. Into real life.” section explains planning in three selectable chapters, keeping the explanation in one place on mobile. Both interactions use labelled native radios, support arrow keys and remain fully functional with JavaScript disabled. The discovery and journal illustrations describe the current App Store features; journal photos and ratings are private. Six short download FAQs use native disclosures, so they work with a keyboard and before JavaScript loads. Their answers also feed the homepage's structured data.

Hand lettering stays static. Short, finite CSS animations bring plan cards, availability matches and character greetings into each newly selected example; there are no timed carousels or perpetual loops. The hero underline draws in once, avatars nod on focus/hover, and download links lift gently. Where CSS scroll timelines are supported, photographs and characters settle into view and a thin navigation line tracks reading progress. Unsupported browsers retain fully visible static content; no homepage JavaScript is added. All motion is disabled under `prefers-reduced-motion`. `scripts/generate-landing-assets.mjs` exports the original character paths as small SVG files, removing duplicate animation frames without changing the locked brand source. It also creates responsive AVIF photographs with WebP fallbacks. These assets are regenerated by `npm run build`; don't edit generated files directly.

The interactive refresh draws on Pondr’s product-first hero, Heyclicky’s character-led playfulness and Waybill’s narrative progression, expressed through Tempo’s existing lettering, avatar paths and palette. `src/app/experience.css` contains the landing interaction styles. Mobile keeps all four navigation shortcuts visible in a second sticky row, with a keyboard skip link and scroll offsets that account for the header. The footer follows Khotan's direct-link pattern: five visible provider marks under “Ask about Tempo” and a matching 46px LinkedIn mark. There is no disclosure, question panel or clipboard step. Each link carries a short public question. The Gemini mark opens Google's Gemini-powered AI Mode (`google.com/search?udm=50&q=...`), following the actual Khotan destination; its accessible name and tooltip identify Google AI Mode. Providers may require sign-in and may change their URL behaviour. Provider artwork is attributed in `public/assets/ai/SOURCES.md`; it identifies external destinations, not endorsements. The AI group uses `data-nosnippet` to exclude it from Google snippets.

The desktop QR opens above its plus/X toggle, replacing the lead and download actions in place while open (their space stays reserved and covered controls leave the focus order). Its card is positioned independently of page flow, preserving its 168px code and quiet zone without moving the illustration, backers or page height. Native details keep it keyboard-operable without JavaScript; the brief reveal animation respects reduced motion. Web access and compatibility are explained on Support, while the homepage focuses on downloading the iPhone app.

Lighthouse checks cover performance, accessibility, best practices and technical SEO; they do not measure conversion or guarantee rankings. Netlify deploy previews intentionally send `X-Robots-Tag: noindex`, which lowers their SEO audit score. Keep that protection and audit the production domain again after release.
