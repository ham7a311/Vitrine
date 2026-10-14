"use client";
import { BentoGrid, type BentoTile } from "./BentoGrid";
import { CommandPalette, Globe, Install, Presence, Settings, TrafficChart } from "./tiles";

const tiles: BentoTile[] = [
  { id: "traffic", title: "Live traffic", body: "Every request, the second it lands — no sampling, no refresh button.", visual: <TrafficChart />, span: { lg: [2, 2], md: [2, 2], sm: [1, 2] }, href: "#traffic" },
  { id: "command", title: "One shortcut for everything", body: "Deploy, invite, roll back. Press ⌘K and start typing.", visual: <CommandPalette />, span: { lg: [2, 1], md: [2, 1] }, textFirst: true },
  { id: "presence", title: "Built for teams", body: "See who's in the project with you.", visual: <Presence /> },
  { id: "settings", title: "Sensible defaults", visual: <Settings />, textFirst: true },
  { id: "install", title: "Two lines to start", body: "Install the package and import what you need.", visual: <Install />, span: { lg: [2, 1], md: [2, 1] }, textFirst: true },
  { id: "globe", title: "Close to everyone", visual: <Globe />, span: { lg: [2, 1], md: [2, 1] }, href: "#regions" },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", background: paper ? "#f2f1ed" : "#080808" }}>
      <BentoGrid theme={paper ? "paper" : "night"} eyebrow="Lumen · platform" title="Everything a small team needs to ship." lede="One place to build, preview and run — with the boring parts already done."
        tiles={tiles} onNavigate={(_, e) => e.preventDefault()} />
    </div>
  );
}
