"use client";
import { useState } from "react";
import { LeagueTable, type LeagueRow } from "./LeagueTable";

const START: LeagueRow[] = [
  { id: "a", name: "Layla Al-Harthy", xp: 642 },
  { id: "b", name: "Omar Said", xp: 598 },
  { id: "c", name: "Mei Tanaka", xp: 517 },
  { id: "d", name: "Hamza Al-Bulushi", xp: 489, you: true },
  { id: "e", name: "Salma Rashid", xp: 455 },
  { id: "f", name: "Tomás Ferreira", xp: 402 },
  { id: "g", name: "Priya Nair", xp: 260 },
  { id: "h", name: "Jonas Berg", xp: 118 },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const [rows, setRows] = useState(START);
  const earn = () => setRows((r) => r.map((x) => (x.you ? { ...x, xp: x.xp + 40 } : x)));
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-10 ${dark ? "bg-[#131f24]" : "bg-white"}`} style={{ fontFamily: "Nunito, system-ui, sans-serif" }}>
      <div className="w-full max-w-[34rem]">
        <LeagueTable league="Coral League" daysLeft={3} rows={rows} promote={3} demote={2} theme={dark ? "dark" : "light"} locale="en-GB" />
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={earn} className="min-h-[46px] rounded-2xl bg-[#58cc02] px-5 text-[15px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_4px_0_#58a700] active:translate-y-1 active:shadow-none">Earn 40 XP</button>
          <button type="button" onClick={() => setRows(START)} className={`min-h-[46px] rounded-2xl border-2 px-4 text-[15px] font-extrabold uppercase tracking-[0.08em] shadow-[0_4px_0] active:translate-y-1 active:shadow-none ${dark ? "border-[#37464f] text-[#8ea3ad] shadow-[#37464f]" : "border-[#e5e5e5] text-[#afafaf] shadow-[#e5e5e5]"}`}>Reset</button>
        </div>
      </div>
    </div>
  );
}
