"use client";
import { MemoryDrawer } from "./MemoryDrawer";
import type { Memory } from "./memory";

const MEMORIES: Memory[] = [
  { id: "m5", topic: "people", text: "Ines is the design lead; Theo handles releases.", source: "From this chat", fresh: true },
  { id: "m7", topic: "work", text: "Planning a move from REST to a typed RPC layer this quarter.", source: "From this chat", fresh: true },
  { id: "m1", topic: "work", text: "Leads the mobile team at Fernhouse; ships on Thursdays.", source: "From a chat · 12 Sep", pinned: true },
  { id: "m2", topic: "work", text: "Prefers code examples in TypeScript with no semicolons.", source: "From a chat · 3 Oct" },
  { id: "m3", topic: "preferences", text: "Wants short answers first, with detail only when asked.", source: "Set by you · 28 Aug" },
  { id: "m4", topic: "preferences", text: "Writes in British English.", source: "From a chat · 2 Sep" },
  { id: "m6", topic: "people", text: "Has a dog called Pickle who needs a walk at 6pm.", source: "From a chat · 21 Sep" },
];
const TOPICS = [{ id: "work", label: "Work" }, { id: "preferences", label: "Preferences" }, { id: "people", label: "People" }];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "28px 16px", background: night ? "#0c0b0f" : "#efece5" }}>
      <MemoryDrawer initial={MEMORIES} topics={TOPICS} theme={night ? "night" : "paper"} />
    </div>
  );
}
