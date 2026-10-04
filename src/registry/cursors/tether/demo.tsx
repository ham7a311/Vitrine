"use client";

import { Tether } from "./Tether";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const c = night
    ? { page: "bg-[#0f0f0e] text-[#f1ece2]", muted: "text-[#8f897e]", line: "border-white/[0.08]", cord: "#e0603a", link: "decoration-white/25" }
    : { page: "bg-[#efebe2] text-[#1c1b17]", muted: "text-[#76705f]", line: "border-black/[0.08]", cord: "#2f5bd3", link: "decoration-black/25" };

  return (
    <Tether
      theme={night ? "night" : "paper"}
      cord={c.cord}
      href="#hello"
      nail={[0.74, 0.14]}
      className={`h-full min-h-[560px] w-full ${c.page}`}
      style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}
      tag={
        <span className="block">
          <span className="block font-mono text-[9.5px] uppercase tracking-[0.2em] opacity-55">Hello, I’m</span>
          <span className="mt-1 block text-[26px] font-semibold leading-none tracking-[-0.03em]">Hamza</span>
          <span className="mt-1.5 block text-[12px] leading-snug opacity-65">Product designer · Muscat</span>
          <span className="mt-4 flex items-center gap-1.5 border-t pt-2.5 text-[12px] font-medium" style={{ borderColor: "currentColor", borderTopWidth: 0.5 }}>
            <span className="size-1.5 rounded-full bg-[#2fae6b]" aria-hidden="true" />
            Open to work
            <span className="ml-auto" aria-hidden="true">→</span>
          </span>
        </span>
      }
    >
      <div className="flex h-full min-h-[560px] w-full max-w-5xl flex-col justify-end px-5 pb-10 pt-16 sm:px-10">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${c.muted}`}>Contact</p>
        <h2 className="mt-3 max-w-[12ch] text-[clamp(2.4rem,7vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.04em]" id="hello">
          Say hello before the coffee’s cold.
        </h2>
        <p className={`mt-5 max-w-[40ch] text-[15px] leading-relaxed ${c.muted}`}>
          Pick the tag up from its nail and carry it around. Click anywhere to hang it on a new pin; press Esc to let go where you are.
        </p>
        <div className={`mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t pt-5 text-[14px] ${c.line}`}>
          <a href="#hello" className={`underline underline-offset-4 ${c.link}`}>
            hello@tryvitrine.dev
          </a>
          <span className={c.muted}>+968 2400 0000</span>
          <span className={c.muted}>Al Khuwair, Muscat</span>
        </div>
      </div>
    </Tether>
  );
}
