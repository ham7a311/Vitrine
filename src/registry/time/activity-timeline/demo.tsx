"use client";
import { useEffect, useState } from "react";
import { ActivityTimeline, type ActivityEvent, type Milestone, type Release } from "./ActivityTimeline";

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

const RELEASES: Release[] = [
  { version: "v2.4.0", at: d(2026, 9, 5), title: "Shared folders", changes: [
    { tag: "new", text: "Share a folder with your team; everyone sees the same files." },
    { tag: "improved", text: "Search is about three times faster on large workspaces." },
    { tag: "fixed", text: "Exports no longer drop the last row of a table." },
  ] },
  { version: "v2.3.2", at: d(2026, 8, 28), title: "Quieter notifications", changes: [
    { tag: "improved", text: "Mentions are grouped into one digest per hour." },
    { tag: "fixed", text: "Dark mode no longer flashes white on load." },
  ] },
  { version: "v2.3.0", at: d(2026, 8, 14), title: "Arabic and right-to-left layouts", changes: [
    { tag: "new", text: "Full Arabic interface with mirrored layouts." },
    { tag: "new", text: "Hijri dates alongside Gregorian ones." },
  ] },
];

const MILESTONES: Milestone[] = [
  { title: "Research", at: d(2026, 7, 3), note: "Interviews with 24 teams" },
  { title: "Design", at: d(2026, 7, 31), note: "Prototype signed off" },
  { title: "Private beta", at: d(2026, 8, 21), note: "40 workspaces" },
  { title: "Public beta", at: d(2026, 9, 19), note: "Open sign-ups" },
  { title: "Launch", at: d(2026, 10, 16), note: "Pricing goes live" },
];

const LAYOUTS = ["activity", "changelog", "milestones"] as const;

export default function Demo({ variant = "activity" }: { variant?: string }) {
  const layout = (LAYOUTS as readonly string[]).includes(variant) ? (variant as (typeof LAYOUTS)[number]) : "activity";
  const [events, setEvents] = useState(EVENTS);
  const [now, setNow] = useState(new Date(NOW));
  // A new event every few seconds, so the feed shows how it updates.
  useEffect(() => {
    if (layout !== "activity") return;
    let i = 0;
    const t = setInterval(() => {
      if (i >= NEXT.length) return clearInterval(t);
      const at = new Date(NOW + (i + 1) * 60_000);
      setNow(at);
      setEvents((es) => [{ ...NEXT[i], id: `n${i}`, at }, ...es]);
      i++;
    }, 7000);
    return () => clearInterval(t);
  }, [layout]);
  const props = { layout, events, releases: RELEASES, milestones: MILESTONES, now, live: true };
  return (
    <div className={`actl-demo ${layout === "milestones" ? "actl-demo--wide" : ""}`}>
      <div className="actl-demo__panel actl-demo__panel--light"><ActivityTimeline {...props} /></div>
      <div className="actl-demo__panel actl-demo__panel--dark"><ActivityTimeline {...props} theme="dark" /></div>
    </div>
  );
}
