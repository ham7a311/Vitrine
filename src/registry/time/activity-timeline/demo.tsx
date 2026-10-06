"use client";
import { useEffect, useState } from "react";
import { ActivityTimeline, type ActivityEvent } from "./ActivityTimeline";

// A fixed "now", so the server and the browser agree on every relative time.
const NOW = Date.UTC(2026, 9, 6, 15, 20);
const m = (min: number) => new Date(NOW - min * 60_000);
const d = (y: number, mo: number, day: number) => new Date(Date.UTC(y, mo, day, 9));

const EVENTS: ActivityEvent[] = [
  { id: "e1", kind: "deploy", who: "Layla Haddad", action: "deployed", target: "main", where: "to Production", at: m(4), status: "running" },
  { id: "e2", kind: "comment", who: "Omar Saleh", action: "commented on", target: "#482", at: m(26), detail: "Can we keep the old export for one more release? Two customers still call it from scripts." },
  { id: "e3", kind: "merge", who: "Layla Haddad", action: "merged", target: "feat/shared-folders", where: "into main", at: m(31) },
  { id: "e4", kind: "alert", who: "Monitor", action: "raised", target: "p95 latency > 800ms", where: "on api-eu", at: m(95), detail: "12:45:03  p95 812ms (threshold 800ms)\n12:46:03  p95 846ms\n12:47:03  p95 790ms  recovered" },
  { id: "e5", kind: "deploy", who: "Yusuf Amin", action: "deployed", target: "fix/billing-rounding", where: "to Preview", at: m(160), status: "fail", detail: "Step 4/6  npm run build\nError: STRIPE_KEY is not defined\nBuild failed in 48s" },
  { id: "e6", kind: "invite", who: "Sara Nasser", action: "joined the team as", target: "Editor", at: m(60 * 22) },
  { id: "e7", kind: "release", who: "Layla Haddad", action: "published", target: "v2.4.0", at: m(60 * 26), status: "ok" },
  { id: "e8", kind: "comment", who: "Huda Karim", action: "commented on", target: "#477", at: m(60 * 49), detail: "Shipped. Thanks for the quick turnaround." },
];
const NEXT: Omit<ActivityEvent, "id" | "at">[] = [
  { kind: "deploy", who: "Layla Haddad", action: "deployed", target: "main", where: "to Production", status: "ok" },
  { kind: "comment", who: "Omar Saleh", action: "commented on", target: "#483", detail: "Looks good to me. Merging after lunch." },
  { kind: "merge", who: "Yusuf Amin", action: "merged", target: "fix/billing-rounding", where: "into main" },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  const [events, setEvents] = useState(EVENTS);
  const [now, setNow] = useState(new Date(NOW));
  // A new event every few seconds, so the feed shows how it updates.
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i >= NEXT.length) return clearInterval(t);
      const at = new Date(NOW + (i + 1) * 60_000);
      setNow(at);
      setEvents((es) => [{ ...NEXT[i], id: `n${i}`, at }, ...es]);
      i++;
    }, 7000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className={`actl-demo actl-demo--${theme}`}>
      <ActivityTimeline events={events} now={now} live theme={theme} />
    </div>
  );
}
