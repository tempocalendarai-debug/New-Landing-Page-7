# Tempo Indexing Checklist

Use this after the site is deployed at `https://tempoassistant.com`.

## 1. Pre-Submission Checks

- Confirm the live homepage returns `200 OK`: `https://tempoassistant.com/`
- Confirm the live sitemap returns `200 OK`: `https://tempoassistant.com/sitemap.xml`
- Confirm the live robots file returns `200 OK`: `https://tempoassistant.com/robots.txt`
- Confirm `robots.txt` includes:
  - `User-agent: OAI-SearchBot`
  - `User-agent: ChatGPT-User`
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

## 4. Search and AI discovery

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

These roles are different: `OAI-SearchBot` is for ChatGPT search, `ChatGPT-User` fetches pages at a user's request, and `GPTBot` is for model training. Allowing training is not a requirement for ChatGPT search. The existing training preference is unchanged by this iteration. Also check that the hosting/CDN layer does not block legitimate search crawlers; a robots rule alone cannot override a firewall. See [OpenAI's crawler documentation](https://developers.openai.com/api/docs/bots).

Google's AI features use the same SEO foundations as ordinary Search: indexable pages, useful text, accurate structured data and a good page experience. There is no special AI schema or text file required. Keep the App Store listing, website, Support answers and company LinkedIn page consistent about the app's name, price, availability and features. Publish useful product examples and seek genuine customer reviews or independent coverage; do not manufacture endorsements. See [Google's AI features guidance](https://developers.google.com/search/docs/appearance/ai-features).

The provider links are a visitor convenience, not a ranking or recommendation mechanism. Their short question is neutral. `data-nosnippet` on the AI footer excludes its provider labels and question from Google text snippets; the main page remains eligible for snippets. Google still chooses whether to use the meta description. See [Google's snippet guidance](https://developers.google.com/search/docs/appearance/snippet).

After deployment, check that these URLs are publicly accessible without login, redirects to unrelated domains, or blocked assets:

- `https://tempoassistant.com/`
- `https://tempoassistant.com/robots.txt`
- `https://tempoassistant.com/sitemap.xml`
- `https://tempoassistant.com/llms.txt`

## 5. Follow-Up Checks

- Monitor Search Console and Bing after sitemap submission; there is no guaranteed crawl/indexing timeline.
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
- Deploy previews intentionally send `X-Robots-Tag: noindex`. Keep previews excluded, and verify the production domain has no accidental `noindex` after release.
- Open “Ask AI about Tempo” and check the five provider destinations. They stay collapsed by default so the homepage prioritizes downloading Tempo. Gemini's icon copies the visible question on a normal click and opens the app; paste it there. If copying is unavailable, the question stays visible for manual copying. The disclosure and ordinary links also work without JavaScript. Login, prefill and answers remain controlled by each provider.
- Use actual App Store data for installs. This update does not add an analytics vendor or fabricate ratings or reviews.
