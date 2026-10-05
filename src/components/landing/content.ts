/**
 * Copy that more than one place needs: the FAQ renders it and the page's
 * FAQPage JSON-LD repeats it word for word, so the two can never disagree.
 *
 * Product claims here are checked against Tempo-Nodejs (coordination-service,
 * agent defaults, PROJECT_CONTEXT). Nothing books until the requester says
 * send; the other side accepts by default; opt-in auto-book has a 10 minute undo.
 * Notes: the capture sheet takes typed or dictated notes and tasks and saves them
 * to the Notion databases the user picks (api/notion/capture, api/ai/transcribe).
 * Briefings: api/briefing and the daily-briefing push. Quick add: api/ai/parse-event.
 *
 * Search copy: Tempo is a social plan maker first. Lead with making plans with
 * friends, family and partners, then the assistant features (briefings,
 * calendar, email, notes) as the supporting cast. Plain sentences, no stuffing.
 * Answers are written to stand alone, because AI search results quote a single
 * answer without the page around it.
 */

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
  "AI note taking",
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
    body: "A daily briefing and help when your calendar clashes.",
  },
  {
    id: "notes",
    label: "NOTES",
    title: "Takes notes when you talk",
    body: "Type or say a note or task and Tempo tidies it up and saves it to your Notion.",
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
    a: "Tempo makes plans with the people in your life. Your Tempo talks to your friend's, family member's or partner's Tempo, finds a time that suits you both and puts it in both calendars. It also gives you a daily briefing, helps with your calendar, and takes notes. Tempo is made by Tempo Software Pty Ltd in Brisbane, Australia, and is in private beta on iPhone.",
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
    a: "Nothing starts until you say send. By default the other person gets a quick yes or no from their Tempo before anything lands in a calendar. If they've told their Tempo it can book for them, it books straight away and they have 10 minutes to undo it.",
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
    a: "Connect Google Calendar, Outlook or Notion and Tempo gives you a daily briefing on your day and your week. It helps when your calendar clashes and adds events from plain English. Nothing is sent until you say so.",
  },
  {
    q: "Can Tempo take notes?",
    a: "Yes. Type or speak a note or task and Tempo tidies it into a proper page and saves it to the Notion database you choose. It also keeps its own notes about what you like, what you'd rather skip and when you're free, so the plans it makes fit you.",
  },
  {
    q: "Which platforms is Tempo on?",
    a: "Tempo is in private beta on iPhone. When it publicly releases, it will also be available on desktop and Android.",
  },
  {
    q: "How much does Tempo cost?",
    a: "Nothing. Tempo is free, and so is joining the waitlist.",
  },
];
