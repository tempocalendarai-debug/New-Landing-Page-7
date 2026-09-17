"use client";

import { useState } from "react";
import { InkButton } from "./ink-primitives";

/**
 * A mailto link does nothing for anyone without a mail app set up, which is a
 * lot of people on a laptop. Copying the address always works.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("Copy this address", email);
    }
  }

  return (
    <>
      <InkButton seed="contact-copy" onClick={copy}>
        {copied ? "Copied" : "Copy address"}
      </InkButton>
      <span className="sr-only" role="status">
        {copied ? "Email address copied" : ""}
      </span>
    </>
  );
}
