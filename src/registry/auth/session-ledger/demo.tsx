"use client";
import { SessionLedger } from "./SessionLedger";
import type { Session } from "./sessions";

const NOW = Date.UTC(2026, 9, 13, 10, 0);
const min = 60000;
const sessions: Session[] = [
  { id: "a", device: "laptop", name: "MacBook Air", browser: "Safari", place: "Lisbon, Portugal", lastActive: NOW, current: true },
  { id: "b", device: "desktop", name: "Windows PC", browser: "Edge", place: "Porto, Portugal", lastActive: NOW - 4 * min },
  { id: "c", device: "phone", name: "Pixel 9", browser: "Murmur app", place: "Lisbon, Portugal", lastActive: NOW - 3 * 60 * min },
  { id: "d", device: "tablet", name: "iPad mini", browser: "Safari", place: "Coimbra, Portugal", lastActive: NOW - 26 * 60 * min },
  { id: "e", device: "laptop", name: "Work ThinkPad", browser: "Firefox", place: "Madrid, Spain", lastActive: NOW - 9 * 24 * 60 * min },
];
let fails = 0;

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 20, background: paper ? "#f1f0eb" : "#0a0b0e" }}>
      <SessionLedger
        theme={paper ? "paper" : "night"}
        sessions={sessions}
        alert={{ sessionId: "b" }}
        now={NOW}
        // Signing out the iPad fails the first time, to show the row coming back.
        onRevoke={async (ids) => { await new Promise((r) => setTimeout(r, 600)); if (ids.includes("d") && fails++ === 0) throw new Error("offline"); }}
      />
    </div>
  );
}
