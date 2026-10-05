"use client";

import { RibbonChangelog, type Release } from "./RibbonChangelog";

const RELEASES: Release[] = [
  { version: "4.2.0", date: "2026-10-12", title: "Rollbacks keep your migrations", changes: [
    { kind: "new", text: "Rolling back a deploy now restores the database migration state, not just the code." },
    { kind: "improved", text: "Build logs stream line by line instead of arriving when the build ends." },
    { kind: "fixed", text: "Preview addresses no longer repeat the commit hash when the branch name is short." },
  ] },
  { version: "4.1.2", date: "2026-10-06", title: "Two small repairs", changes: [
    { kind: "fixed", text: "Comments left on a preview were lost when the branch was force-pushed." },
    { kind: "fixed", text: "The dashboard showed deploys in the wrong order for teams in UTC+4." },
  ] },
  { version: "4.1.0", date: "2026-09-29", title: "Comments leave the browser", changes: [
    { kind: "new", text: "Resolve a preview comment from Slack without opening the page." },
    { kind: "improved", text: "The comment pin follows the element it was placed on when the layout shifts." },
  ] },
  { version: "4.0.3", date: "2026-09-15", title: "Faster cold starts", changes: [
    { kind: "improved", text: "Median build time fell from 52 to 41 seconds after cache keys stopped including timestamps." },
    { kind: "fixed", text: "Environment variables with an equals sign in the value were truncated." },
  ] },
  { version: "4.0.0", date: "2026-08-14", title: "A dashboard built around branches", changes: [
    { kind: "new", text: "Every pull request has its own page, with its build, comments and preview address together." },
    { kind: "new", text: "Promote moves a reviewed build to production without rebuilding it." },
    { kind: "improved", text: "Projects load in one request instead of four." },
  ] },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`h-full w-full overflow-y-auto ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f6f5f1] text-[#1b1a17]"}`} style={{ height: "100%" }}>
      <div className="mx-auto max-w-[46rem] px-6 pb-24 pt-14">
        <p className={`font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] ${night ? "text-[#8d8f95]" : "text-[#6b6861]"}`}>Relay · Changelog</p>
        <h1 className="mb-8 mt-3 font-[family-name:Instrument_Serif] text-[3rem] leading-none tracking-[-0.02em]">What changed, and when</h1>
        <RibbonChangelog theme={night ? "night" : "paper"} releases={RELEASES} lastVisit="2026-09-22" today="2026-10-14" />
      </div>
    </div>
  );
}
