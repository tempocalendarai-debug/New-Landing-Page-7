import { InkCard } from "@/components/brand/ink";
import { TempoText } from "@/components/brand/tempo-type";
import { CONTACT_EMAIL, FAQS, pageMetadata } from "@/components/landing/content";
import { FaqItem } from "@/components/landing/faq-item";
import { HandHeading, InkButton } from "@/components/landing/ink-primitives";
import { SubPage } from "@/components/landing/sub-page";

export const metadata = pageMetadata({
  title: "Support",
  description:
    "Help with Tempo: making plans, calendar connections, AI consent, reporting, blocking and account deletion.",
  path: "/support",
});

const mail = (subject: string) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
const faq = (q: string) => FAQS.find((f) => f.q === q)?.a ?? "";

type Item = { q: string; a: React.ReactNode };
type Group = { id: string; label: string; title: string; summary: string; items: Item[] };

const GROUPS: Group[] = [
  { id: "getting-started", label: "GETTING STARTED", title: "Getting started", summary: "Sign in and make your first plan.", items: [
    { q: "How do I get started?", a: <p>Sign in with Apple, Google or email at beta.tempoassistant.com or in the iPhone app. Confirm you are 16 or older, choose whether to allow AI, and optionally connect a calendar. Add someone in My People, then choose Create a plan on Home.</p> },
    { q: "Do I need a calendar connection or AI?", a: <p>No. Calendar connections are optional. Choosing Not now for AI keeps calendar functions and fixed-time invitations available. Change AI consent in Settings under AI planning and chat.</p> },
  ] },
  { id: "planning", label: "PLANNING", title: "Planning with your people", summary: "Find a time and keep everyone in the loop.", items: [
    { q: "Does the other person need Tempo too?", a: <p>{faq("Does the other person need Tempo too?")}</p> },
    { q: "Will Tempo book things without asking?", a: <p>{faq("Will Tempo book things without asking?")}</p> },
    { q: "A notification did not arrive. What should I check?", a: <p>Check notification preferences in Tempo and iPhone Settings → Notifications → Tempo. Focus may silence alerts. Email us with the plan and approximate time if it still does not arrive.</p> },
  ] },
  { id: "integrations", label: "CALENDARS", title: "Calendar connections", summary: "Optional Google and Apple Calendar sync.", items: [
    { q: "How do I connect a calendar?", a: <p>Open Settings → Integrations. Connect Google Calendar or, on iPhone, Apple Calendar. You choose whether to grant access. If sync fails, check the connection and calendar permission before contacting support.</p> },
  ] },
  { id: "privacy", label: "PRIVACY & SAFETY", title: "Your data and safety", summary: "Consent, reporting, blocking and deletion.", items: [
    { q: "What can friends see?", a: <p>Friends see free/busy availability without calendar titles or locations, plus your profile and notes you choose to share. Plan participants see that plan’s details, replies and photos. See our <a href="/privacy">Privacy Policy</a>.</p> },
    { q: "How do I report or block someone?", a: <p>Use Report on the person or content in Tempo, or Block on their profile. Manage your blocks in Settings → Privacy → Blocked people. Axel checks reports daily, including weekends. We review reports within 24 hours and prioritise urgent safety concerns; resolving an investigation may take longer. You can also <a href={mail("Safety report")}>email us</a>.</p> },
    { q: "How do I delete my account?", a: <p>Open Settings → Advanced → Delete account. This is permanent. Apple accounts may need to sign in again to revoke authorisation. If cleanup fails, Tempo shows an error so you can retry. Copies on other people’s calendars may remain. If you cannot sign in, <a href={mail("Delete my account")}>email us</a> from your account address.</p> },
  ] },
  { id: "troubleshooting", label: "HELP", title: "Troubleshooting", summary: "Get help with sign-in or a failed action.", items: [
    { q: "I cannot sign in or an action failed.", a: <p>Use the same sign-in method as your existing account. Check your connection and retry. If the issue continues, email us with what you tried, the approximate time and a screenshot. Do not send passwords or sign-in codes.</p> },
  ] },
];

export default function SupportPage() {
  return (
    <SubPage
      eyebrow="Support"
      lines={["HOW CAN", "WE HELP?"]}
      label="How can we help?"
      agent="listening"
      intro={
        <p>
          Answers about setting up Tempo, planning with your people, connecting your tools, the beta,
          billing and your data. Can&rsquo;t find it? We&rsquo;re one email away.
        </p>
      }
    >
      <div className="wrap">
        <div className="sub__actions">
          <InkButton seed="support-email" href={mail("Tempo Support")} highlight>
            Email support
          </InkButton>
          <InkButton seed="support-contact" href="/contact">
            Other ways to reach us
          </InkButton>
        </div>

        <nav aria-label="Help topics">
          <ul className="topics">
            {GROUPS.map((g) => (
              <li key={g.id}>
                <a className="topic" href={`#${g.id}`}>
                  <InkCard seed={`topic-${g.id}`} padding="22px 20px 20px" radius={12}>
                    <TempoText height={20}>{g.label}</TempoText>
                    <p className="topic__body">{g.summary}</p>
                  </InkCard>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="help">
          {GROUPS.map((g) => (
            <section key={g.id} id={g.id} className="help__group" aria-labelledby={`${g.id}-title`}>
              <h2 id={`${g.id}-title`} className="help__title">
                {g.title}
              </h2>
              <div className="faq__list">
                {g.items.map((item) => (
                  <FaqItem key={item.q} question={item.q}>
                    {item.a}
                  </FaqItem>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="support-cta" aria-labelledby="still-title">
          <InkCard seed="support-still" padding="clamp(36px, 6vw, 56px) clamp(20px, 5vw, 48px)" radius={16}>
            <div className="cta__inner">
              <HandHeading id="still-title" lines={["STILL NEED", "A HAND?"]} label="Still need a hand?" align="center" />
              <p className="body center">
                We&rsquo;re a small team and happy to help. Most emails get a reply within one business
                day, Monday to Friday, Brisbane time.
              </p>
              <p className="support-cta__email">
                <a href={mail("Tempo Support")}>{CONTACT_EMAIL}</a>
              </p>
            </div>
          </InkCard>
        </section>
      </div>
    </SubPage>
  );
}
