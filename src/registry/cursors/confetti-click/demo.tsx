"use client";
import { ConfettiClick, type Party } from "./ConfettiClick";

const LOOKS: Record<Party, { page: string; muted: string; card: string; primary: string; chip: string; ghost: string }> = {
  party: { page: "bg-[#fff8ee] text-[#21160c]", muted: "text-[#6b5a48]", card: "bg-white border-[#f0e2cc]", primary: "bg-[#21160c] text-[#fff8ee]", chip: "bg-[#ffecc8] text-[#5a3a00]", ghost: "border-[#21160c]/25" },
  pastel: { page: "bg-[#2a2440] text-[#f6f2ff]", muted: "text-[#bdb4d8]", card: "bg-white/[0.06] border-white/10", primary: "bg-[#f6f2ff] text-[#2a2440]", chip: "bg-white/10 text-[#f6f2ff]", ghost: "border-white/25" },
};

const GUESTS = ["Noor A.", "Pip K.", "Ines M.", "Theo R.", "Saba L."];

export default function Demo({ variant = "party" }: { variant?: string }) {
  const p = (variant in LOOKS ? variant : "party") as Party;
  const c = LOOKS[p];
  return (
    <ConfettiClick mix={p} className={`min-h-full w-full select-none ${c.page}`} style={{ fontFamily: '"Hanken Grotesk", ui-sans-serif, system-ui' }}>
      <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-7 px-6 py-14">
        <span className={`w-fit rounded-full px-3 py-1 text-[12px] font-semibold ${c.chip}`}>Click anywhere · hold for a bigger pop</span>
        <h2 className="max-w-xl text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.02em]">Mira turns thirty on Saturday.</h2>
        <p className={`max-w-lg text-[15px] leading-relaxed ${c.muted}`}>Rooftop at the Cardamom Works, 7pm till late. Bring a story, a song request and something for the cake table.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={`h-11 rounded-full px-6 text-[15px] font-semibold ${c.primary}`}>I'll be there</button>
          <button type="button" className={`h-11 rounded-full border px-6 ${c.ghost} text-[15px] font-semibold`}>Add to calendar</button>
        </div>
        <div className={`rounded-2xl border p-4 ${c.card}`}>
          <p className={`text-[12px] ${c.muted}`}>Already coming · {GUESTS.length + 18}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {GUESTS.map((g) => <li key={g} className={`rounded-full px-3 py-1 text-[13px] font-medium ${c.chip}`}>{g}</li>)}
          </ul>
        </div>
      </div>
    </ConfettiClick>
  );
}
