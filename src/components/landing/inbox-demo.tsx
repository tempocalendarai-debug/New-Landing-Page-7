"use client";

/**
 * The app's own DraftReplySheet, driven the way the app drives it: a short
 * scribble while Tempo starts, then the reply streams in, then it's ready.
 *
 * The sheet's buttons do something here too, so nothing on the page is a dead
 * control: send and save report back in one line, and "Write it again" replays
 * the draft. Under reduced motion the draft is simply there, already written.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { DraftReplySheet, type DraftStatus } from "@/components/brand/draft-reply-sheet";
import { useDrawn } from "./ink-primitives";

const REPLY = `Hi Jordan,

Thanks for the nudge. I'll have the latest version of the proposal to you by Thursday afternoon.

Sam`;

type Outcome = "none" | "sent" | "saved";

export function InboxDemo() {
  const [viewRef, inView] = useDrawn<HTMLDivElement>(0.4);
  const [status, setStatus] = useState<DraftStatus>("writing");
  const [text, setText] = useState("");
  const [outcome, setOutcome] = useState<Outcome>("none");
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const run = useCallback(() => {
    clear();
    setOutcome("none");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(REPLY);
      setStatus("ready");
      return;
    }
    setText("");
    setStatus("writing");
    // Two characters every 24ms, the same pace as the app's streaming demo.
    const start = 1400;
    for (let i = 2; i <= REPLY.length + 1; i += 2) {
      timers.current.push(window.setTimeout(() => {
        setStatus("streaming");
        setText(REPLY.slice(0, i));
      }, start + (i / 2) * 24));
    }
    timers.current.push(window.setTimeout(() => setStatus("ready"), start + (REPLY.length / 2 + 2) * 24));
  }, []);

  useEffect(() => {
    if (inView) run();
    return clear;
  }, [inView, run]);

  return (
    <div ref={viewRef} className="inbox">
      <DraftReplySheet
        status={status}
        recipient="Jordan"
        context="About the client proposal · 8:12 am"
        text={text}
        originalSubject="Re: Client proposal"
        originalBody={
          "Hi Sam,\n\nCould you send me the latest proposal before Friday? Happy to look over it before it goes to the client.\n\nJordan"
        }
        sendLabel="Send via Gmail"
        onSend={() => setOutcome("sent")}
        onSaveDraft={() => setOutcome("saved")}
        onRegenerate={run}
      />
      <p className="inbox__outcome" role="status">
        {outcome === "sent" && "Sent. In a real inbox this would be on its way to Jordan."}
        {outcome === "saved" && "Saved. In a real inbox this would be waiting in your drafts."}
      </p>
    </div>
  );
}
