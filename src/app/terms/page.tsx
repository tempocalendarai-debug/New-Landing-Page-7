import { pageMetadata } from "@/components/landing/content";
import { LegalDocument, SubPage } from "@/components/landing/sub-page";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "The terms that apply when you use Tempo. Terms of Use for Tempo Software Pty Ltd.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <SubPage eyebrow="Legal" lines={["TERMS OF USE"]} label="Terms of Use">
      <LegalDocument file="terms" meta="Effective Date: April 5, 2026 | Last Updated: October 5, 2026" />
    </SubPage>
  );
}
