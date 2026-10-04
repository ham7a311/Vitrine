"use client";

import { useState } from "react";
import { GelToggle } from "./GelToggle";

const ROWS = [
  { id: "wifi", label: "Wi-Fi", note: "Vitrine Studio 5G", accent: "#34c77b" },
  { id: "focus", label: "Focus", note: "Until 18:00", accent: "#7c5cff" },
  { id: "low", label: "Low power", note: "Battery at 22%", accent: "#ffb02e" },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [on, setOn] = useState<Record<string, boolean>>({ wifi: true, focus: false, low: false });
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0d0d10] text-[#ecebf0]" : "bg-[#efede8] text-[#1b1a17]"}`}>
      <ul className={`w-full max-w-sm divide-y rounded-[20px] px-5 ${night ? "divide-white/10 bg-[#18181d]" : "divide-black/[0.07] bg-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.35)]"}`}>
        {ROWS.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-4 py-4">
            <span>
              <span className="block text-[15px] font-medium">{r.label}</span>
              <span className="block text-[13px] opacity-55">{r.note}</span>
            </span>
            <GelToggle label={r.label} accent={r.accent} checked={on[r.id]} onChange={(v) => setOn((s) => ({ ...s, [r.id]: v }))} />
          </li>
        ))}
      </ul>
    </div>
  );
}
