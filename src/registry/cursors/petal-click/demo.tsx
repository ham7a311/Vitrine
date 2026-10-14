"use client";
import { PetalClick, type Season } from "./PetalClick";

const LOOKS: Record<Season, { page: string; muted: string; card: string; primary: string; ghost: string; title: string; lead: string }> = {
  sakura: { page: "bg-[#fdf4f6] text-[#2b1a22]", muted: "text-[#6e5560]", card: "border-[#f2dbe2] bg-white", primary: "bg-[#2b1a22] text-[#fdf4f6]", ghost: "border-[#2b1a22]/25", title: "The cherry walk opens this week.", lead: "Two kilometres of blossom along the old canal, lit until ten. Pick a slot and stroll at your own pace." },
  autumn: { page: "bg-[#f6efe4] text-[#2a1c10]", muted: "text-[#6a5845]", card: "border-[#e9dcc7] bg-[#fffaf2]", primary: "bg-[#2a1c10] text-[#f6efe4]", ghost: "border-[#2a1c10]/25", title: "Maple Hollow, in full colour.", lead: "The ridge trail turns copper this fortnight. Guided walks leave from the lodge every morning at nine." },
};

const SLOTS = ["Fri · 17:30", "Sat · 10:00", "Sat · 19:00", "Sun · 08:30"];

export default function Demo({ variant = "sakura" }: { variant?: string }) {
  const s = (variant in LOOKS ? variant : "sakura") as Season;
  const c = LOOKS[s];
  return (
    <PetalClick season={s} className={`min-h-full w-full select-none ${c.page}`} style={{ fontFamily: '"Hanken Grotesk", ui-sans-serif, system-ui' }}>
      <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-7 px-6 py-14">
        <p className={`text-[12px] font-semibold uppercase tracking-[0.18em] ${c.muted}`}>Click anywhere · hold for a flurry</p>
        <h2 className="max-w-xl text-[clamp(2rem,5vw,3.2rem)] leading-[1.05] tracking-[-0.01em]" style={{ fontFamily: '"Instrument Serif", Newsreader, Georgia, serif' }}>{c.title}</h2>
        <p className={`max-w-lg text-[15px] leading-relaxed ${c.muted}`}>{c.lead}</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={`h-11 rounded-full px-6 text-[15px] font-semibold ${c.primary}`}>Book a slot</button>
          <button type="button" className={`h-11 rounded-full border px-6 text-[15px] font-semibold ${c.ghost}`}>See the route</button>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SLOTS.map((t) => <li key={t} className={`rounded-xl border px-3 py-3 text-center text-[14px] font-medium ${c.card}`}>{t}</li>)}
        </ul>
      </div>
    </PetalClick>
  );
}
