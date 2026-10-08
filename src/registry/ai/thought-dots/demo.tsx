"use client";
import { THOUGHT_DESIGNS, ThoughtDots } from "./ThoughtDots";

/* The large glyphs show the `color` prop with a few agent colours. */
const TINT: Record<string, [string, string]> = {
  orbit: ["#f0679a", "#d23a72"],
  chase: ["#5f87f7", "#3d6cf0"],
  wave: ["#f5a052", "#c4691d"],
  gather: ["#3cc28c", "#1f8f60"],
  pendulum: ["#f2644f", "#d23d2b"],
  spiral: ["#b48cf2", "#7d4fd1"],
};

const ROWS: Record<string, string> = {
  orbit: "Weighing the two pricing options",
  chase: "Reading the attached contract",
  wave: "Drafting a reply to Layla",
  gather: "Summarising 14 comments",
  pendulum: "Deciding between Tuesday and Thursday",
  spiral: "Exploring a few directions",
};

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${light ? "bg-[#ecebe8] text-[#1a1a1a]" : "bg-[#0b0b0b] text-[#ececec]"}`} style={{ fontFamily: '"Inter", "Hanken Grotesk Variable", "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif' }}>
      <ul className="grid w-full max-w-[44rem] gap-2 sm:grid-cols-2">
        {THOUGHT_DESIGNS.map((d) => (
          <li key={d.id} className={`grid gap-3 rounded-2xl border p-5 ${light ? "border-[#e0dfdb] bg-white" : "border-[#1f1f1f] bg-[#131313]"}`}>
            <span className={`font-mono text-[11px] uppercase tracking-[0.08em] ${light ? "text-[#9a9a9a]" : "text-[#5c5c5c]"}`}>{d.name}</span>
            <span className="text-[15px]">
              <ThoughtDots design={d.id} theme={light ? "light" : "dark"} label={ROWS[d.id]} />
            </span>
            <span className="text-[22px]">
              <ThoughtDots design={d.id} theme={light ? "light" : "dark"} label="" color={TINT[d.id][light ? 1 : 0]} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
