"use client";

import { PlainPointer } from "./PlainPointer";

const ROWS = [
  { k: "Studio", v: "Shatti Al Qurum, Way 2601" },
  { k: "Hours", v: "Sun–Thu, 9:00–17:00" },
  { k: "Phone", v: "+968 2400 0000" },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const night = variant === "night";
  const c = night
    ? { page: "bg-[#0d0d0e] text-[#efede8]", muted: "text-[#8e8c87]", line: "border-white/[0.08]", link: "decoration-white/30 hover:decoration-white/80", ring: "focus-visible:outline-white" }
    : { page: "bg-white text-[#111113]", muted: "text-[#6b6b73]", line: "border-black/[0.08]", link: "decoration-black/25 hover:decoration-black/70", ring: "focus-visible:outline-[#111113]" };

  return (
    <PlainPointer arrow={night ? "light" : "dark"} className={`min-h-full w-full ${c.page}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-center px-5 py-14 sm:px-8">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${c.muted}`}>Contact</p>
        <h2 className="mt-3 text-[clamp(1.8rem,4.6vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Nothing fancy. Just a good arrow.</h2>
        <p className={`mt-4 max-w-[42ch] text-[15px] leading-relaxed ${c.muted}`}>One crisp cursor across the whole page, drawn where your hand is, with no glow and no lag.</p>
        <dl className={`mt-8 divide-y border-y text-[14px] ${c.line} ${night ? "divide-white/[0.08]" : "divide-black/[0.08]"}`}>
          {ROWS.map((r) => (
            <div key={r.k} className="flex justify-between gap-6 py-3">
              <dt className={c.muted}>{r.k}</dt>
              <dd className="text-right">{r.v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex gap-6 text-[14px]">
          <a href="#" onClick={(e) => e.preventDefault()} className={`rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 ${c.link} ${c.ring}`}>
            hello@tryvitrine.dev
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className={`rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 ${c.link} ${c.ring}`}>
            Directions
          </a>
        </div>
      </div>
    </PlainPointer>
  );
}
