"use client";

import { ToolCall, type ToolStep } from "./ToolCall";

const STEPS: ToolStep[] = [
  { name: "search_flights", args: { from: "MCT", to: "SLL", date: "2026-08-14", adults: 2 }, result: "6 flights", ms: 1500, detail: ["WY 903 · 07:10 → 08:50 · OMR 62", "OV 211 · 13:40 → 15:15 · OMR 48", "WY 905 · 18:05 → 19:45 · OMR 71"] },
  { name: "check_weather", args: { city: "Salalah", date: "2026-08-14" }, result: "Drizzle, 26°C", ms: 1100, detail: ["Khareef season: light drizzle and mist most mornings."] },
  { name: "hold_seats", args: { flight: "OV 211", seats: 2, minutes: 20 }, result: "Held until 15:42", ms: 1300 },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-6 ${night ? "bg-[#0b0a0e]" : "bg-[#efede8]"}`}>
      <ToolCall
        theme={night ? "night" : "paper"}
        steps={STEPS}
        answer="I've held two seats on OV 211 (13:40, OMR 48 each) until 15:42. Expect khareef drizzle and 26°C — pack a light jacket. Want me to book it?"
      />
    </div>
  );
}
