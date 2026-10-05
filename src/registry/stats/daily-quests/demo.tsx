"use client";
import { useState } from "react";
import { DailyQuests, type Quest } from "./DailyQuests";

const START: Quest[] = [
  { id: "xp", title: "Earn 30 XP", icon: "bolt", progress: 18, goal: 30, unit: "XP" },
  { id: "perfect", title: "Get 5 answers right in a row", icon: "target", progress: 5, goal: 5 },
  { id: "minutes", title: "Learn for 10 minutes", icon: "clock", progress: 3, goal: 10, unit: "minutes" },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const [quests, setQuests] = useState(START);
  const [attempts, setAttempts] = useState(0);
  const [resetsAt] = useState(() => new Date(Date.now() + 14 * 3_600_000 + 20 * 60_000).toISOString());
  const progress = () => setQuests((q) => q.map((x) => (x.id === "xp" ? { ...x, progress: Math.min(x.goal, x.progress + 6) } : x.id === "minutes" ? { ...x, progress: Math.min(x.goal, x.progress + 3) } : x)));
  // Simulated service: the first claim fails so the retry path is visible.
  const claim = () => new Promise<void>((resolve, reject) => { setAttempts((a) => a + 1); setTimeout(() => (attempts === 0 ? reject(new Error("offline")) : resolve()), 700); });
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-10 ${dark ? "bg-[#131f24]" : "bg-white"}`} style={{ fontFamily: "Nunito, system-ui, sans-serif" }}>
      <div className="w-full max-w-[30rem]">
        <DailyQuests quests={quests} resetsAt={resetsAt} onClaim={claim} theme={dark ? "dark" : "light"} />
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={progress} className="min-h-[46px] rounded-2xl bg-[#1cb0f6] px-5 text-[15px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_4px_0_#1899d6] active:translate-y-1 active:shadow-none">Practise a bit</button>
          <p className={`text-[13px] font-bold ${dark ? "text-[#8ea3ad]" : "text-[#777]"}`}>Demo · the first claim fails</p>
        </div>
      </div>
    </div>
  );
}
