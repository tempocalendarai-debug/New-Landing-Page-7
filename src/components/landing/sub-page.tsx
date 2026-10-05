/**
 * Frame for the pages that aren't home: Support, Contact, Privacy, Terms.
 * Same nav, footer and paper as the landing page, with a hand-lettered title
 * and a plain sans intro. The character only appears where a page says so.
 */

import fs from "node:fs";
import path from "node:path";
import { TempoAgent, type TempoState } from "@/components/brand/tempo-agent";
import { HandHeading } from "./ink-primitives";
import { SiteFooter } from "./sections";
import { SiteNav } from "./site-nav";

export function SubPage({
  eyebrow,
  lines,
  label,
  intro,
  agent,
  children,
}: {
  eyebrow: string;
  lines: string[];
  label: string;
  intro?: React.ReactNode;
  agent?: TempoState;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNav />
      <main className="sub">
        <header className="wrap sub__head">
          {agent && (
            <div className="sub__agent">
              <TempoAgent state={agent} size={96} />
            </div>
          )}
          <p className="sub__eyebrow">{eyebrow}</p>
          <HandHeading as="h1" id="page-title" lines={lines} label={label} height={52} />
          {intro && <div className="lead sub__intro">{intro}</div>}
        </header>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * Legal text lives as HTML in src/content/legal, maintained for the current release. It's read at build time, so the static export has
 * the full document in the page and nothing loads on the client.
 */
export function LegalDocument({ file, meta }: { file: "privacy" | "terms"; meta: string }) {
  const html = fs.readFileSync(path.join(process.cwd(), "src/content/legal", `${file}.html`), "utf8");
  return (
    <div className="wrap">
      <p className="doc__meta">{meta}</p>
      <article className="doc" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
