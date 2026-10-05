/** Shared product copy for visible FAQs and search metadata. Keep release claims aligned with the app. */

export const SITE_URL = "https://tempoassistant.com";
export const CONTACT_EMAIL = "tempo.calendar.ai@gmail.com";

/** Plans made on Tempo so far. Shown in the counter section; update as it grows. */
export const PLANS_MADE = 239;

/**
 * Founding badges are given by hand to our beta testers (picked in App Store
 * Connect), so these two numbers are updated manually. Bump FOUNDING_GIVEN
 * each time you add testers.
 */
export const FOUNDING_TOTAL = 100;
export const FOUNDING_GIVEN = 46;

/** People on the waitlist before the live counter existed. The live count starts here. */
export const WAITLIST_START = 153;

export const TITLE = "Tempo. Make plans, Skip the Back-And-Forth";
export const DESCRIPTION =
  "Tempo makes plans with your friends, family and partner. Your Tempo talks to theirs, finds a time that suits you both and puts it in both calendars.";

export const OG_ALT = "Tempo, the app that makes plans with your people";

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
    label: "CALENDARS",
    title: "Lands in both calendars",
    body: "Once you've both said yes, the plan is in both calendars. No group chat back and forth.",
  },
  {
    id: "private",
    label: "PRIVATE",
    title: "Private when you want it",
    body: "Keep any note to yourself. No other Tempo can read it, and you can preview what they can see.",
  },
  {
    id: "your-day",
    label: "YOUR DAY",
    title: "Keeps your own week on track",
    body: "See your schedule and keep booked plans in one place.",
  },
  {
    id: "notes",
    label: "NOTES",
    title: "Chat with your Tempo",
    body: "Tell Tempo what you want to do and who with. AI planning is your choice.",
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
    a: "Tempo makes plans with the people in your life. Your Tempo talks to your friend's, family member's or partner's Tempo, finds a time that suits you both and puts it in both calendars. It also keeps your calendar and preferences in one place. Tempo is made by Tempo Software Pty Ltd in Brisbane, Australia, and is in private beta on iPhone.",
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
    a: "Optionally connect Google Calendar or Apple Calendar, add events and reminders, and chat with your Tempo after allowing AI. You can change your AI choice in Settings.",
  },
  {
    q: "Can Tempo take notes?",
    a: "You can save preferences and context about what you like, what you would rather skip and when you are free. Choose whether each note is private or shared with friends.",
  },
  {
    q: "Which platforms is Tempo on?",
    a: "Tempo works in a web browser, including desktop and Android browsers. The iPhone app is currently available through TestFlight while App Store review is prepared.",
  },
  {
    q: "How much does Tempo cost?",
    a: "Nothing. Tempo is free, and so is joining the waitlist.",
  },
];
