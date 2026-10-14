"use client";
import { DepthBento, type DepthTile } from "./DepthBento";
import { Frames, Graph, Inbox, Phone, Sync, Week } from "./scenes";

const tiles: DepthTile[] = [
  { id: "inbox", title: "One inbox for every channel", body: "Email, chat and forms land in the same calm list.", tone: "iris", scene: <Inbox />, span: { lg: [2, 2], md: [2, 2], sm: [1, 2] }, href: "#inbox" },
  { id: "phone", title: "Nudges, not noise", body: "Only what needs you, when it needs you.", tone: "ember", scene: <Phone />, span: { lg: [1, 2], md: [1, 2], sm: [1, 2] } },
  { id: "week", title: "Plans that move", tone: "moss", scene: <Week /> },
  { id: "frames", title: "Layers, not files", tone: "rose", scene: <Frames /> },
  { id: "graph", title: "Routed to the closest region", body: "Requests find the shortest path on their own.", tone: "sea", scene: <Graph />, span: { lg: [2, 1], md: [2, 1] } },
  { id: "sync", title: "Same state on every screen", body: "Pick up on the phone where the laptop left off.", tone: "sky", scene: <Sync />, span: { lg: [2, 1], md: [2, 1] }, href: "#sync" },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", background: paper ? "#f6f4ef" : "#07070b" }}>
      <DepthBento theme={paper ? "paper" : "night"} eyebrow="Halcyon workspace" title="Look closer. It's all in there."
        lede="Point at a tile and it opens up in layers — the same way the product does when you need more of it."
        tiles={tiles} onNavigate={(_, e) => e.preventDefault()} />
    </div>
  );
}
