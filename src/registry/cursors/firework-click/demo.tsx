"use client";
import { FireworkClick, type Sky } from "./FireworkClick";

const LOOKS: Record<Sky, { page: string; muted: string; card: string; primary: string; ghost: string }> = {
  night: { page: "bg-[linear-gradient(to_bottom,#060914,#121a33)] text-[#f1f0f8]", muted: "text-[#a3a8c2]", card: "border-white/10 bg-white/[0.04]", primary: "bg-[#ffcf5a] text-[#1e1503]", ghost: "border-white/25" },
  daylight: { page: "bg-[#eef3f8] text-[#14202e]", muted: "text-[#4f5d6e]", card: "border-[#d6e0ea] bg-white", primary: "bg-[#14202e] text-white", ghost: "border-[#14202e]/25" },
};

const SHOWS = [
  { t: "21:00", n: "Harbour opening" },
  { t: "21:40", n: "Lantern parade" },
  { t: "22:15", n: "Finale over the bay" },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const s = (variant in LOOKS ? variant : "night") as Sky;
  const c = LOOKS[s];
  return (
    <FireworkClick sky={s} className={`min-h-full w-full select-none ${c.page}`} style={{ fontFamily: '"Hanken Grotesk", ui-sans-serif, system-ui' }}>
      <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-end gap-7 px-6 pb-14 pt-40">
        <p className={`text-[12px] font-semibold uppercase tracking-[0.18em] ${c.muted}`}>Click anywhere · hold to launch a big one</p>
        <h2 className="max-w-xl text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.02em]">Saltmarsh Summer Night</h2>
        <p className={`max-w-lg text-[15px] leading-relaxed ${c.muted}`}>One evening, three shows over the water. Free entry along the promenade; the best seats go fast.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={`h-11 rounded-full px-6 text-[15px] font-semibold ${c.primary}`}>Reserve a seat</button>
          <button type="button" className={`h-11 rounded-full border px-6 text-[15px] font-semibold ${c.ghost}`}>View the map</button>
        </div>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SHOWS.map((x) => (
            <li key={x.t} className={`rounded-2xl border p-4 ${c.card}`}>
              <p className={`font-mono text-[12px] ${c.muted}`}>{x.t}</p>
              <p className="mt-1 text-[16px] font-semibold">{x.n}</p>
            </li>
          ))}
        </ol>
      </div>
    </FireworkClick>
  );
}
