import { InkCard } from "@/components/brand/ink";
import { TempoText } from "@/components/brand/tempo-type";
import { CONTACT_EMAIL, pageMetadata } from "@/components/landing/content";
import { CopyEmail } from "@/components/landing/copy-email";
import { InkButton } from "@/components/landing/ink-primitives";
import { SubPage } from "@/components/landing/sub-page";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with the Tempo team in Brisbane for help, privacy requests, press or partnerships.",
  path: "/contact",
});

const mail = (subject: string) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

const REASONS = [
  {
    id: "help",
    label: "HELP",
    body: "Something not working, a question about the beta or your account.",
    subject: "Tempo Support",
    extra: { href: "/support", text: "Or browse Support first" },
  },
  {
    id: "privacy",
    label: "PRIVACY",
    body: "Access, correct or delete the personal information we hold about you.",
    subject: "Privacy request",
    extra: { href: "/privacy", text: "Read the Privacy Policy" },
  },
  {
    id: "hello",
    label: "SAY HELLO",
    body: "Press, partnerships, universities or anything else.",
    subject: "Hello from the website",
  },
];

export default function ContactPage() {
  return (
    <SubPage
      eyebrow="Contact"
      lines={["GET IN TOUCH"]}
      label="Get in touch"
      agent="wink"
      intro={<p>We&rsquo;re a small team in Brisbane and a real person reads every email.</p>}
    >
      <div className="wrap contact">
        <InkCard seed="contact-main" padding="clamp(28px, 5vw, 44px) clamp(20px, 5vw, 44px)" radius={16}>
          <p className="contact__label">Email us at</p>
          <p className="contact__email">
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <div className="contact__actions">
            <InkButton seed="contact-email" href={mail("Hello Tempo")} highlight>
              Write to us
            </InkButton>
            <CopyEmail email={CONTACT_EMAIL} />
          </div>
          <dl className="contact__meta">
            <div>
              <dt>Response time</dt>
              <dd>Usually within 1 business day</dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>Mon to Fri, Brisbane (AEST)</dd>
            </div>
            <div>
              <dt>Company</dt>
              <dd>Tempo Software Pty Ltd, ABN 85 701 184 358</dd>
            </div>
          </dl>
        </InkCard>

        <ul className="contact__reasons">
          {REASONS.map((r) => (
            <li key={r.id}>
              <InkCard seed={`contact-${r.id}`} tape tilt padding="28px 22px 22px" radius={12}>
                <TempoText height={20}>{r.label}</TempoText>
                <p className="contact__reason-body">{r.body}</p>
                <p className="contact__reason-links">
                  <a href={mail(r.subject)}>Email about this</a>
                  {r.extra && <a href={r.extra.href}>{r.extra.text}</a>}
                </p>
              </InkCard>
            </li>
          ))}
        </ul>
      </div>
    </SubPage>
  );
}
