"use client";
import { useState } from "react";
import { AlertCallout, type AlertTone } from "./AlertCallout";

const LOOKS = ["soft", "outline", "accent", "banner"] as const;
type Look = (typeof LOOKS)[number];

const ITEMS: { tone: AlertTone; title: string; body: string; primary?: string; secondary: string }[] = [
  { tone: "info", title: "A new version is ready", body: "Version 2.4 adds shared folders and faster search.", secondary: "See what's new" },
  { tone: "success", title: "Payment received", body: "We've sent a receipt for 1,240 OMR to accounts@noor.studio.", secondary: "View receipt" },
  { tone: "warning", title: "Your trial ends in 3 days", body: "Add a payment method to keep your projects running.", primary: "Add card", secondary: "Compare plans" },
  { tone: "danger", title: "Deploy failed", body: "The build stopped at step 4 of 6: a missing environment variable.", primary: "View logs", secondary: "Retry" },
];

function Panel({ look, theme }: { look: Look; theme: "light" | "dark" }) {
  const [shown, setShown] = useState(ITEMS.map((i) => i.tone));
  const list = (
    <>
      {ITEMS.filter((i) => shown.includes(i.tone)).map((i) => (
        <AlertCallout key={i.tone} tone={i.tone} look={look} theme={theme} title={i.title}
          actions={<>{i.primary && <button type="button" className="alrt__primary">{i.primary}</button>}<a href="#">{i.secondary}</a></>}
          onDismiss={() => setShown((s) => s.filter((t) => t !== i.tone))}>
          <p>{i.body}</p>
        </AlertCallout>
      ))}
      {shown.length < ITEMS.length && <button type="button" className="alrt-demo__again" onClick={() => setShown(ITEMS.map((i) => i.tone))}>Show all four again</button>}
    </>
  );
  return (
    <section className={`alrt-demo__panel alrt-demo__panel--${theme} ${look === "banner" ? "alrt-demo__panel--banner" : ""}`} aria-label={theme === "dark" ? "On dark" : "On light"}>
      {look === "banner" ? <>{list}<div className="alrt-demo__page" aria-hidden="true"><i style={{ width: "40%" }} /><i /><i style={{ width: "85%" }} /><i style={{ width: "70%" }} /></div></> : list}
    </section>
  );
}

export default function Demo({ variant = "soft" }: { variant?: string }) {
  const look = (LOOKS as readonly string[]).includes(variant) ? (variant as Look) : "soft";
  return <div className="alrt-demo"><Panel look={look} theme="light" /><Panel look={look} theme="dark" /></div>;
}
