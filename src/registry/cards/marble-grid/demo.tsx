"use client";
import { MarbleGrid, type MarbleItem } from "./MarbleGrid";

const I = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d.split("|").map((p) => <path key={p} d={p} />)}</svg>;

const items: MarbleItem[] = [
  { id: "branches", title: "Every branch, live", body: "Each pull request gets its own address, so reviews happen on the real thing.", color: "#3d6ee8", icon: I("M6 3v12|M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z|M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z|M18 9a9 9 0 0 1-9 9") },
  { id: "edge", title: "Runs near people", body: "Code starts in the region closest to whoever asked, not an ocean away.", color: "#7b3ff0", icon: I("M13 2 4 14h7l-1 8 9-12h-7Z") },
  { id: "style", title: "One source of style", body: "Colour, type and spacing defined once and read by every screen you ship.", color: "#d23a77", icon: I("M12 3a9 9 0 1 0 0 18c1 0 1.6-.8 1.6-1.6 0-.9-.7-1.3-.7-2.2 0-.9.7-1.6 1.6-1.6H17a4 4 0 0 0 4-4c0-4.6-4-8.6-9-8.6Z|M7.5 11.5h.01|M10 7.5h.01|M15 7.5h.01") },
  { id: "cache", title: "Cached everywhere", body: "Static files sit in every region, warm before the first visitor arrives.", color: "#13996a", icon: I("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z|M3 12h18|M12 3a14 14 0 0 1 0 18|M12 3a14 14 0 0 0 0 18") },
  { id: "images", title: "Images, handled", body: "Resized, compressed and served in the right format for every screen.", color: "#e07a1f", icon: I("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z|M14.3 3.3 9.5 12|M20.1 8 10.5 8|M20.6 15.4 15.5 6.9|M9.7 20.7l4.8-8.7|M3.9 16h9.6|M3.4 8.6l5.1 8.5") },
  { id: "video", title: "Video without the setup", body: "Upload once; get adaptive streams, posters and captions back.", color: "#e0453a", icon: I("M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8Z|M4 11 20 6.5|M4 11l1-4 15-3.5.6 3|M8.5 6.3l2.7 3.4|M13.6 5l2.7 3.4") },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", alignContent: "center", padding: "clamp(16px, 5vw, 72px)", background: paper ? "#f2f1ec" : "#000" }}>
      <MarbleGrid items={items} theme={paper ? "paper" : "night"} />
    </div>
  );
}
