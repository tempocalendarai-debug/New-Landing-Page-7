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

- `public/__forms.html` registers the `waitlist-hero` and `waitlist-cta` Netlify forms. The React forms post to it.
- `/support`, `/contact`, `/privacy` and `/terms` are Next routes in `src/app`. The legal wording lives as HTML in `src/content/legal/` and is read at build time, so edit the text there.
- The site is light only. There is no dark palette, whatever the visitor's system theme.
- `legacy/` holds the previous static HTML landing pages for reference. Not deployed.
