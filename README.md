# Tempo landing page

Ink-on-paper landing page for [tempoassistant.com](https://tempoassistant.com). Next.js 16 static export, served by Netlify from `out/`.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # writes out/
npm run preview      # serves out/ at http://localhost:3007 with clean URLs like Netlify
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

Hand lettering and character outlines stay static on the landing page. This is controlled by landing CSS, leaving the shared brand kit unchanged. Gentle character expressions retain the brand's reduced-motion behaviour. “Sound familiar?” is deliberately readable without interactions. The discovery and journal illustrations describe the current App Store features; journal photos and ratings are private.

The visual refresh takes cues from Polarbear's character storytelling, Partiful's clear path from idea to plan, and Howbout's direct app-download journey. Assets and branding remain Tempo's own.
