"use client";
import { TopoContours, type TopoPalette } from "./TopoContours";

const LOOKS: Record<string, TopoPalette> = {
  survey: { ground: "#f1ece0", line: "#c08a5c", index: "#7d4a22", ink: "#2b1d10", muted: "#5d4a37", rule: "rgba(43, 29, 16, 0.16)", accent: "#2b1d10", onAccent: "#f6f1e6" },
  night: { ground: "#0d1614", line: "#2f8f6e", index: "#8ef0c4", ink: "#e8f6ef", muted: "#a5c4b7", rule: "rgba(232, 246, 239, 0.14)", accent: "#8ef0c4", onAccent: "#082018" },
};

export default function Demo({ variant = "survey" }: { variant?: string }) {
  const p = LOOKS[variant] ?? LOOKS.survey;
  return (
    <div style={{ minHeight: "100%", background: p.ground }}>
      <TopoContours
        palette={p}
        eyebrow="Route 12 · Hollin Ridge"
        title="Plan the climb before you lace up."
        lead="Ridgeline reads the contours for you: where the trail steepens, where water crosses, and how long the last kilometre will really take."
        stats={[{ value: "1,140 m", label: "total ascent" }, { value: "23.6 km", label: "distance" }, { value: "5 h 40", label: "moving time" }]}
        primary={{ label: "Download the route", href: "#gpx" }}
        secondary={{ label: "Open in the map", href: "#map" }}
        onNavigate={(_, e) => e.preventDefault()}
      />
    </div>
  );
}
