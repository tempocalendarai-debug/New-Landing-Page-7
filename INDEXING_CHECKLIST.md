# Tempo Indexing Checklist

Use this after the site is deployed at `https://tempoassistant.com`.

## 1. Pre-Submission Checks

- Confirm the live homepage returns `200 OK`: `https://tempoassistant.com/`
- Confirm the live sitemap returns `200 OK`: `https://tempoassistant.com/sitemap.xml`
- Confirm the live robots file returns `200 OK`: `https://tempoassistant.com/robots.txt`
- Confirm `robots.txt` includes:
  - `User-agent: OAI-SearchBot`
  - `User-agent: ChatGPT-User`
  - `User-agent: GPTBot`
  - `Sitemap: https://tempoassistant.com/sitemap.xml`
- Confirm the homepage canonical is `https://tempoassistant.com/`
- Confirm the sitemap first URL is `https://tempoassistant.com/`

## 2. Google Search Console

1. Open Google Search Console: https://search.google.com/search-console
2. Add a Domain property for `tempoassistant.com`.
3. Verify ownership with the DNS TXT record Google provides.
4. Open **Sitemaps**.
5. Submit:
   - `https://tempoassistant.com/sitemap.xml`
6. Open **URL Inspection** and request indexing for:
   - `https://tempoassistant.com/`
   - `https://tempoassistant.com/privacy`
   - `https://tempoassistant.com/terms`
   - `https://tempoassistant.com/support`
   - `https://tempoassistant.com/contact`

## 3. Bing Webmaster Tools

1. Open Bing Webmaster Tools: https://www.bing.com/webmasters
2. Import the site from Google Search Console or add `tempoassistant.com` manually.
3. Verify ownership if prompted.
4. Submit:
   - `https://tempoassistant.com/sitemap.xml`
5. Use **URL Inspection** for:
   - `https://tempoassistant.com/`
6. Request indexing if Bing has not crawled it yet.

## 4. ChatGPT Search Readiness

OpenAI's ChatGPT Search crawler is `OAI-SearchBot`. The live `robots.txt` should explicitly allow it:

```txt
User-agent: OAI-SearchBot
Allow: /
```

Also allow user-triggered ChatGPT page fetches:

```txt
User-agent: ChatGPT-User
Allow: /
```

After deployment, check that these URLs are publicly accessible without login, redirects to unrelated domains, or blocked assets:

- `https://tempoassistant.com/`
- `https://tempoassistant.com/robots.txt`
- `https://tempoassistant.com/sitemap.xml`
- `https://tempoassistant.com/llms.txt`

## 5. Follow-Up Checks

- Wait 24 to 72 hours after sitemap submission.
- Search Google for: `site:tempoassistant.com`
- Search Bing for: `site:tempoassistant.com`
- Test branded query visibility: `Tempo plans with friends`
- Test category query visibility: `social planning app for iPhone`
- If pages are not indexed after a week, inspect crawl errors in Google Search Console and Bing Webmaster Tools.

## App Store launch checks

- Every download CTA must open Tempo: Plans with Friends, app ID `6779019603`.
- Inspect the homepage source: `apple-itunes-app` must contain `app-id=6779019603` and the MobileApplication offer must say `InStock`, with the live App Store URL.
- Verify the QR code on desktop with an iPhone camera. Check the Smart App Banner in Safari on an iPhone; other browsers need not display it.
- Confirm the homepage, support, contact, FAQ JSON-LD and `/llms.txt` no longer describe access as a private beta or require a waitlist.
- Submit the updated sitemap and request a homepage recrawl in the existing Search Console property. Search engines choose when to refresh snippets.
- `llms.txt` is supplemental product context, not a guarantee of search visibility. Keep crawlable page copy, metadata and structured data consistent.
- Use actual App Store data for installs. This update does not add an analytics vendor or fabricate ratings or reviews.
