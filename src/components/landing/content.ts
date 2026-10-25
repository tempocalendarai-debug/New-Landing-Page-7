/** Shared product copy for visible FAQs and search metadata. Keep release claims aligned with the app. */
import appStore from "@/content/app-store.json";

export const APP_STORE_ID = appStore.id;
export const APP_STORE_URL = appStore.url;
export const MINIMUM_IOS = appStore.minimumIOS;

export const SITE_URL = "https://tempoassistant.com";
export const CONTACT_EMAIL = "tempo.calendar.ai@gmail.com";

/** Plans made on Tempo so far. Shown in the counter section; update as it grows. */
export const PLANS_MADE = 239;

/** People on the waitlist before the live counter existed. The live count starts here. */
export const WAITLIST_START = 153;

export const TITLE = "Tempo: Plans with Friends | Free iPhone Planning App";
export const DESCRIPTION =
  "Make plans with friends, find a time together and fit it into everyone’s schedule. Download Tempo, the free social planning app for iPhone.";

export const OG_ALT = "Tempo does the planning, with Tempo’s illustrated mascot";

/** Names people search for us by. Used in structured data, not stuffed into copy. */
export const ALT_NAMES = ["Tempo AI", "Tempo Assistant", "Tempo AI Assistant", "Tempo App"];

export const KEYWORDS = [
  "Tempo",
  "Tempo AI",
  "Tempo app",
  "AI assistant",
  "AI social planner",
  "social planning app",
  "make plans with friends",
  "plan with friends app",
  "find a time to meet up",
  "catch up with friends",
  "hangout planner",
  "date night planner",
  "family planner app",
  "AI scheduling assistant",
  "AI personal assistant",
  "calendar planning",
];

/** What the app does, one line each. Feeds the features section and MobileApplication.featureList. */
export const FEATURES = [
  {
    id: "plans",
    label: "PLANS",
    title: "Makes plans with your people",
    body: "Your Tempo talks to your friend's, family member's or partner's Tempo and sorts out the plan between them.",
  },
  {
    id: "taste",
    label: "TASTE",
    title: "Knows what you like",
    body: "It remembers the places you love, what you'd rather skip and when you're free, so plans actually fit.",
  },
  {
    id: "calendars",
    label: "SCHEDULE",
    title: "Fits into everyone’s schedule",
    body: "Once you've both said yes, the plan is in both calendars. No group chat back and forth.",
  },
  {
    id: "private",
    label: "PRIVATE",
    title: "Private when you want it",
    body: "Keep any note to yourself. No other Tempo can read it, and you can preview what they can see.",
  },
  {
    id: "discover",
    label: "DISCOVER",
    title: "Find your next plan",
    body: "Discover events, activities and things to do with your people, based on what you enjoy and want to try.",
  },
  {
    id: "memories",
    label: "MEMORIES",
    title: "Keep the good bits",
    body: "Save photos and notes in your journal after the plan. Share a note with your crew; your photos and ratings stay private.",
  },
];

/** Shared metadata for the pages that aren't home. Pages override title, description and path. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      siteName: "Tempo",
      locale: "en_AU",
      url: path,
      title: `${title} | Tempo`,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: OG_ALT }],
    },
    twitter: { card: "summary_large_image" as const, title: `${title} | Tempo`, description, images: ["/og.png"] },
  };
}

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "What is Tempo?",
    a: "Tempo is a free social planning app for iPhone. It helps you make plans with friends, family and your partner, find a time together and fit it into everyone’s schedule. Your Tempo works with their Tempos to take care of the back-and-forth. It is available now on the App Store and made by Tempo Software Pty Ltd in Brisbane, Australia.",
  },
  {
    q: "How do I make plans with friends using Tempo?",
    a: "Tell your Tempo who you want to see and roughly what, like \"hike with Jack and Mia this weekend, somewhere with a view\". Your Tempo checks with Jack's and Mia's Tempos, looks at everyone's calendars and what you all like, and suggests a time with the reason behind it. Once everyone's said yes, it's in all your calendars.",
  },
  {
    q: "Who is Tempo for?",
    a: "Anyone who keeps saying \"we should catch up\" and never locks in a date. Friends lining up dinner or trivia, couples planning date nights, and people making time for a parent or sibling between everything else going on.",
  },
  {
    q: "Does the other person need Tempo too?",
    a: "Yes. Tempo plans between two people who both use it, so their Tempo can check their side. Invite your friend, family member or partner and your Tempos can start planning together.",
  },
  {
    q: "Will Tempo book things without asking?",
    a: "You start a plan by sending it. Depending on each person’s planning settings, their Tempo can accept and book automatically. Review your settings; you can decline or cancel a plan.",
  },
  {
    q: "Who can see what Tempo knows about me?",
    a: "Every note is yours to add, edit or delete, and each one is either shared or private. Shared notes help other Tempos plan with you. Private notes can't be read by anyone else's account, and you can preview exactly what another Tempo would see.",
  },
  {
    q: "How is Tempo different from other planning apps?",
    a: "Most planning apps only work for one person. Every Tempo can talk to other Tempos, so when you want to see someone, your Tempos sort out the plan between them and nobody has to chase anybody through a group chat.",
  },
  {
    q: "What else can Tempo do?",
    a: "Discover events and things to do with your people, connect Apple Calendar or Google Calendar, and keep memories in your journal. You can also chat with your Tempo after allowing AI. Calendar connections and AI are optional.",
  },
  {
    q: "Can Tempo take notes?",
    a: "You can save preferences and context about what you like, what you would rather skip and when you are free. Choose whether each note is private or shared with friends.",
  },
  {
    q: "Which platforms is Tempo on?",
    a: "Download Tempo from the App Store on an iPhone running iOS 17 or later. Tempo also works in a web browser, including desktop and Android browsers. There is no native Android app yet.",
  },
  {
    q: "How much does Tempo cost?",
    a: "Tempo is free to download and use. Get it from the App Store and start making plans with your people.",
  },
];
