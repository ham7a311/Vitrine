"use client";
import { SparkleClick, type Shine } from "./SparkleClick";

const LOOKS: Record<Shine, { page: string; muted: string; card: string; primary: string; ghost: string }> = {
  gold: { page: "bg-[#0d1226] text-[#f3f0e6]", muted: "text-[#a9adc4]", card: "bg-white/[0.04] border-white/10", primary: "bg-[#ffd56b] text-[#1d1606]", ghost: "border-white/20 text-[#f3f0e6]" },
  prism: { page: "bg-[#fbfaff] text-[#1a1830]", muted: "text-[#5d5a76]", card: "bg-white border-[#e7e4f3]", primary: "bg-[#1a1830] text-white", ghost: "border-[#d9d5ea] text-[#1a1830]" },
  mono: { page: "bg-[#f4f1ea] text-[#16161a]", muted: "text-[#5c5a55]", card: "bg-white/70 border-black/10", primary: "bg-[#16161a] text-[#f4f1ea]", ghost: "border-black/20 text-[#16161a]" },
};

const WINS = [
  { k: "Streak", v: "12 days" },
  { k: "Lessons", v: "48 done" },
  { k: "Badges", v: "7 of 20" },
];

export default function Demo({ variant = "gold" }: { variant?: string }) {
  const s = (variant in LOOKS ? variant : "gold") as Shine;
  const c = LOOKS[s];
  return (
    <SparkleClick shine={s} className={`min-h-full w-full select-none ${c.page}`} style={{ fontFamily: '"Hanken Grotesk", ui-sans-serif, system-ui' }}>
      <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-8 px-6 py-14">
        <p className={`text-[12px] font-semibold uppercase tracking-[0.18em] ${c.muted}`}>Click anywhere · hold for more</p>
        <h2 className="max-w-xl text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.02em]">Every small win deserves a little sparkle.</h2>
        <p className={`max-w-lg text-[15px] leading-relaxed ${c.muted}`}>Finish a lesson, tick off a task, keep the streak alive. Tallyleaf celebrates the moments that add up.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={`h-11 rounded-full px-6 text-[15px] font-semibold ${c.primary}`}>Mark lesson done</button>
          <button type="button" className={`h-11 rounded-full border px-6 text-[15px] font-semibold ${c.ghost}`}>See your progress</button>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {WINS.map((w) => (
            <li key={w.k} className={`rounded-2xl border p-4 ${c.card}`}>
              <p className={`text-[12px] ${c.muted}`}>{w.k}</p>
              <p className="mt-1 text-[20px] font-bold tracking-[-0.01em]">{w.v}</p>
            </li>
          ))}
        </ul>
      </div>
    </SparkleClick>
  );
}
