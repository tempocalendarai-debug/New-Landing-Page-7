import { InkCard } from "@/components/brand/ink";
import { TempoText } from "@/components/brand/tempo-type";
import { CONTACT_EMAIL, FAQS, pageMetadata } from "@/components/landing/content";
import { FaqItem } from "@/components/landing/faq-item";
import { HandHeading, InkButton } from "@/components/landing/ink-primitives";
import { SubPage } from "@/components/landing/sub-page";

export const metadata = pageMetadata({
  title: "Support",
  description:
    "Help with Tempo: getting started, making plans with friends, family and partners, briefings, calendar, email and notes, connecting your tools, the beta, billing and your data.",
  path: "/support",
});

const mail = (subject: string) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
const faq = (q: string) => FAQS.find((f) => f.q === q)?.a ?? "";

type Item = { q: string; a: React.ReactNode };
type Group = { id: string; label: string; title: string; summary: string; items: Item[] };

const GROUPS: Group[] = [
  {
    id: "getting-started",
    label: "GETTING STARTED",
    title: "Getting started",
    summary: "Set up Tempo and take your first steps.",
    items: [
      {
        q: "How do I get started with Tempo?",
        a: (
          <p>
            Once you have access, open Tempo and follow the one-time setup. Tell Tempo what you like,
            what you&rsquo;d rather skip and when you&rsquo;re free, then connect the tools you use.
            From there it starts on your briefings, your calendar and your inbox. Nothing is sent
            until you say so.
          </p>
        ),
      },
      {
        q: "Which platforms is Tempo available on?",
        a: (
          <p>
            Right now Tempo is a native iPhone app in private beta. When we publicly release, Tempo
            will also be available on desktop and Android.
          </p>
        ),
      },
    ],
  },
  {
    id: "planning",
    label: "PLANNING",
    title: "Planning with your people",
    summary: "How your Tempo plans with someone else's.",
    items: [
      { q: "Does the other person need Tempo too?", a: <p>{faq("Does the other person need Tempo too?")}</p> },
      { q: "Will Tempo book things without asking?", a: <p>{faq("Will Tempo book things without asking?")}</p> },
    ],
  },
  {
    id: "your-week",
    label: "YOUR WEEK",
    title: "Briefings, calendar, email and notes",
    summary: "Daily briefings, calendar, email and notes.",
    items: [
      {
        q: "What's in my daily briefing?",
        a: (
          <p>
            Every morning Tempo briefs you on your day, your week and your work: what&rsquo;s coming
            up, what&rsquo;s changed and what needs you. It works from the calendars and email
            accounts you&rsquo;ve connected.
          </p>
        ),
      },
      {
        q: "How does Tempo reorganise my calendar?",
        a: (
          <p>
            When things clash or your day gets crowded, Tempo works out a better way to fit it
            together and tells you what it moved and why. If a change doesn&rsquo;t suit you, move it
            back or tell Tempo and it will keep that in mind.
          </p>
        ),
      },
      { q: "Can Tempo take notes?", a: <p>{faq("Can Tempo take notes?")}</p> },
      {
        q: "Does Tempo send emails without asking?",
        a: (
          <p>
            No. Tempo reads what comes in, shows you what needs you and writes replies for you to
            review. You can change anything, then send it or save it as a draft. Nothing is sent until
            you approve it.
          </p>
        ),
      },
    ],
  },
  {
    id: "integrations",
    label: "CONNECTIONS",
    title: "Calendar, email and Notion",
    summary: "Connect Gmail, Google Calendar, Outlook and Notion.",
    items: [
      {
        q: "How do I connect Gmail, Google Calendar, Notion or Outlook?",
        a: (
          <>
            <p>
              You connect your tools from the <strong>Updates</strong> page in Tempo. Open Updates,
              choose the service you&rsquo;d like to connect, and sign in securely with that provider
              to grant Tempo the permissions it needs.
            </p>
            <p>
              Gmail, Google Calendar and Outlook are ready to use as soon as they&rsquo;re connected.
              Notion takes one extra step, which is covered below.
            </p>
          </>
        ),
      },
      {
        q: "How do I set up the Notion integration?",
        a: (
          <>
            <p>Notion takes a couple of extra steps so you decide exactly which pages Tempo can access:</p>
            <ol>
              <li>
                Go to the <strong>Updates</strong> page and connect Notion.
              </li>
              <li>
                Open <strong>Settings</strong> and choose which Notion pages Tempo is allowed to use.
              </li>
              <li>
                Click <strong>Save</strong>.
              </li>
            </ol>
            <p>Once you&rsquo;ve saved your selection, the Notion integration is ready to use.</p>
          </>
        ),
      },
    ],
  },
  {
    id: "beta",
    label: "BETA",
    title: "Beta and access",
    summary: "Joining the beta and sending feedback.",
    items: [
      {
        q: "How do I join the beta and get access?",
        a: (
          <p>
            Join the waitlist on our <a href="/#waitlist">home page</a>. Most invites go out by email
            within 48 hours. If you don&rsquo;t see it, check your spam or promotions folder.
          </p>
        ),
      },
      {
        q: "How do I report a bug or suggest a feature?",
        a: (
          <p>
            We&rsquo;d love to hear it. Email <a href={mail("Tempo feedback")}>{CONTACT_EMAIL}</a>{" "}
            with a short description. For bugs, including your device, operating system and the steps
            that led to the issue helps us fix things faster.
          </p>
        ),
      },
    ],
  },
  {
    id: "billing",
    label: "BILLING",
    title: "Billing",
    summary: "Pricing, subscriptions and cancelling.",
    items: [
      {
        q: "How much does Tempo cost?",
        a: (
          <p>
            Tempo will be $7.99 AUD per month when we launch. Payment isn&rsquo;t open yet. Joining
            the waitlist is free and reserves your spot.
          </p>
        ),
      },
      {
        q: "How do I cancel my subscription?",
        a: (
          <p>
            You can cancel anytime. All billing is handled securely through Stripe, so there is no App
            Store subscription to manage. To cancel or change your plan, email{" "}
            <a href={mail("Tempo billing")}>{CONTACT_EMAIL}</a> and we&rsquo;ll take care of it right
            away.
          </p>
        ),
      },
    ],
  },
  {
    id: "privacy-data",
    label: "PRIVACY",
    title: "Privacy and data",
    summary: "How your data is handled and deleted.",
    items: [
      { q: "Who can see what Tempo knows about me?", a: <p>{faq("Who can see what Tempo knows about me?")}</p> },
      {
        q: "How is my data used and protected?",
        a: (
          <p>
            We use your data to run the assistant features you enable, and we don&rsquo;t sell your
            personal information. Data is encrypted in transit and at rest, with access controls and
            regular security reviews. Full details are in our <a href="/privacy">Privacy Policy</a>.
          </p>
        ),
      },
      {
        q: "How do I delete my account and data?",
        a: (
          <p>
            Email <a href={mail("Delete my account")}>{CONTACT_EMAIL}</a> from your account address
            and we&rsquo;ll process the deletion. We delete or anonymise your data within 30 days,
            except where the law requires us to keep certain records.
          </p>
        ),
      },
    ],
  },
  {
    id: "troubleshooting",
    label: "FIXES",
    title: "Troubleshooting",
    summary: "Sync, sign-in and access problems.",
    items: [
      {
        q: "My calendar or email isn't syncing. What should I do?",
        a: (
          <p>
            First, open the <strong>Updates</strong> page and confirm the integration is still
            connected. Reconnecting the service there usually fixes sync issues. For Notion, also check
            that your allowed pages are still selected in <strong>Settings</strong>. If it keeps
            happening, email us with the affected service and roughly when it last worked.
          </p>
        ),
      },
      {
        q: "I can't sign in or access the app.",
        a: (
          <p>
            Make sure you&rsquo;re using the email address your invite was sent to, and that
            you&rsquo;ve accepted the TestFlight invitation. If you&rsquo;re still stuck, email{" "}
            <a href={mail("Cannot access Tempo")}>{CONTACT_EMAIL}</a> and we&rsquo;ll get you in.
          </p>
        ),
      },
    ],
  },
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
