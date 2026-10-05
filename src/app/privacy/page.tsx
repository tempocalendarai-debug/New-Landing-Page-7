import { pageMetadata } from "@/components/landing/content";
import { LegalDocument, SubPage } from "@/components/landing/sub-page";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Tempo collects, uses and protects your personal information. Privacy Policy for Tempo Software Pty Ltd.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <SubPage eyebrow="Legal" lines={["PRIVACY", "POLICY"]} label="Privacy Policy">
      <LegalDocument file="privacy" meta="Last updated: 5 October 2026" />
    </SubPage>
  );
}
