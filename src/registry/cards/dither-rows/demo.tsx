"use client";
import { DitherRows, type DitherRow } from "./DitherRows";

const I = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d.split("|").map((p) => <path key={p} d={p} />)}</svg>;

const rows: DitherRow[] = [
  { id: "branches", title: "Every branch, live", body: "Each pull request gets its own address, so reviews happen on the real thing.", color: "#2a55d4", icon: I("M6 3v12|M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z|M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z|M18 9a9 9 0 0 1-9 9") },
  { id: "edge", title: "Runs near people", body: "Code starts in the region closest to whoever asked, not an ocean away.", color: "#7536db", icon: I("M13 2 4 14h7l-1 8 9-12h-7Z") },
  { id: "style", title: "One source of style", body: "Colour, type and spacing defined once and read by every screen you ship.", color: "#bf1f5a", icon: I("M12 3a9 9 0 1 0 0 18c1 0 1.6-.8 1.6-1.6 0-.9-.7-1.3-.7-2.2 0-.9.7-1.6 1.6-1.6H17a4 4 0 0 0 4-4c0-4.6-4-8.6-9-8.6Z|M7.5 11.5h.01|M10 7.5h.01|M15 7.5h.01") },
  { id: "cache", title: "Cached everywhere", body: "Static files sit in every region, warm before the first visitor arrives.", color: "#0e8458", icon: I("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z|M3 12h18|M12 3a14 14 0 0 1 0 18|M12 3a14 14 0 0 0 0 18") },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", alignContent: "center", padding: "clamp(16px, 6vw, 96px)", background: paper ? "#f3f2ee" : "#000" }}>
      <DitherRows rows={rows} theme={paper ? "paper" : "night"} />
    </div>
  );
}
