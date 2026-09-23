import { ALT_NAMES, CONTACT_EMAIL, DESCRIPTION, FAQS, FEATURES, KEYWORDS, SITE_URL } from "@/components/landing/content";
import { Booked, Faq, Features, FinalCta, Hero, People, SiteFooter, Talk, Taste } from "@/components/landing/sections";
import { Backers, Founders, LifeOnTempo, PlanTicker, YourWeek } from "@/components/landing/brand-sections";
import { PlansCounter } from "@/components/landing/plans-counter";
import { SoundFamiliar } from "@/components/landing/sound-familiar";
import { SiteNav } from "@/components/landing/site-nav";

/*
 * Structured data for search and AI answers. One @graph with stable @ids, so
 * Google, Bing and AI search tools read the organisation, the site, the app and
 * the FAQ as one connected entity called Tempo rather than four loose facts.
 */
const ORG_ID = `${SITE_URL}/#organization`;
const APP_ID = `${SITE_URL}/#app`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Tempo",
      alternateName: ALT_NAMES,
      legalName: "Tempo Software Pty Ltd",
      taxID: "85 701 184 358",
      url: SITE_URL,
      logo: `${SITE_URL}/apple-touch-icon.png`,
      foundingLocation: { "@type": "Place", name: "Brisbane, Queensland, Australia" },
      areaServed: "Worldwide",
      email: CONTACT_EMAIL,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: CONTACT_EMAIL,
        url: `${SITE_URL}/support`,
        availableLanguage: "English",
      },
      sameAs: ["https://www.linkedin.com/company/tempoassistant/"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Tempo",
      alternateName: ALT_NAMES,
      url: SITE_URL,
      description: DESCRIPTION,
      inLanguage: "en-AU",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "MobileApplication",
      "@id": APP_ID,
      name: "Tempo",
      alternateName: ALT_NAMES,
      applicationCategory: "LifestyleApplication",
      applicationSubCategory: "AI social planner",
      operatingSystem: "iOS",
      url: SITE_URL,
      image: `${SITE_URL}/og.png`,
      description: DESCRIPTION,
      keywords: KEYWORDS.join(", "),
      featureList: FEATURES.map((f) => `${f.title}: ${f.body}`),
      offers: {
        "@type": "Offer",
        name: "Tempo subscription",
        price: "7.99",
        priceCurrency: "AUD",
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/#waitlist`,
      },
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      about: { "@id": APP_ID },
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <SiteNav home />
      <main>
        <Hero />
        <Backers />
        <PlanTicker />
        <SoundFamiliar />
        <LifeOnTempo />
        <Taste />
        <Talk />
        <Booked />
        <People />
        <YourWeek />
        <PlansCounter />
        <Features />
        <Founders />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
