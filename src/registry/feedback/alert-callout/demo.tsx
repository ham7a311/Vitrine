"use client";
import { useState } from "react";
import { AlertCallout, type AlertCalloutProps, type AlertTone } from "./AlertCallout";

type Item = { tone: AlertTone; title: string; body: string; primary?: string; secondary: string };
const INFO: Item = { tone: "info", title: "A new version is ready", body: "Version 2.4 adds shared folders and faster search.", secondary: "See what's new" };
const SUCCESS: Item = { tone: "success", title: "Payment received", body: "We've sent a receipt for 1,240 OMR to accounts@noor.studio.", secondary: "View receipt" };
const WARNING: Item = { tone: "warning", title: "Your trial ends in 3 days", body: "Add a payment method to keep your projects running.", primary: "Add card", secondary: "Compare plans" };
const DANGER: Item = { tone: "danger", title: "Deploy failed", body: "The build stopped at step 4 of 6: a missing environment variable.", primary: "View logs", secondary: "Retry" };

// Each look, with the tones that show it best.
const SECTIONS: { look: NonNullable<AlertCalloutProps["look"]>; name: string; items: Item[] }[] = [
  { look: "soft", name: "Soft", items: [INFO, SUCCESS, WARNING, DANGER] },
  { look: "outline", name: "Outline", items: [INFO, WARNING] },
  { look: "accent", name: "Accent bar", items: [SUCCESS, DANGER] },
  { look: "banner", name: "Banner", items: [WARNING] },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  const key = (look: string, t: string) => `${look}:${t}`;
  const all = SECTIONS.flatMap((s) => s.items.map((i) => key(s.look, i.tone)));
  const [shown, setShown] = useState(all);
  return (
    <div className={`alrt-demo alrt-demo--${theme}`}>
      {SECTIONS.map((s) => (
        <section key={s.look} aria-label={s.name} className={s.look === "banner" ? "alrt-demo__banners" : undefined}>
          <h3>{s.name}</h3>
          {s.items.filter((i) => shown.includes(key(s.look, i.tone))).map((i) => (
            <AlertCallout key={i.tone} tone={i.tone} look={s.look} theme={theme} title={i.title}
              actions={<>{i.primary && <button type="button" className="alrt__primary">{i.primary}</button>}<a href="#">{i.secondary}</a></>}
              onDismiss={() => setShown((x) => x.filter((k) => k !== key(s.look, i.tone)))}>
              <p>{i.body}</p>
            </AlertCallout>
          ))}
        </section>
      ))}
      {shown.length < all.length && <button type="button" className="alrt-demo__again" onClick={() => setShown(all)}>Bring the dismissed ones back</button>}
    </div>
  );
}
