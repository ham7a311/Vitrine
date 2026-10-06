"use client";

import { useRef } from "react";
import { DocketNav } from "./DocketNav";

const LINKS = [
  { label: "Product", href: "#product" as const },
  { label: "Changelog", href: "#changelog" as const },
  { label: "Pricing", href: "#pricing" as const },
  { label: "Docs", href: "#docs" as const },
];

const SECTIONS: [string, string, string][] = [
  ["product", "Preview every branch before it ships", "Masar's team opens a link, not a ticket. Each pull request gets its own address, built in 41 seconds on average."],
  ["changelog", "Four releases this month", "Rollbacks now keep the database migration state. Build logs stream instead of arriving at the end."],
  ["pricing", "Pay for seats, not for builds", "OMR 4 per seat per month. Builds are unmetered up to 20,000 a month, then we write to you before we bill you."],
  ["docs", "Written by the people who answer the email", "Every page has an author and a last-reviewed date. If it is older than six months it says so at the top."],
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const scroller = useRef<HTMLDivElement>(null);
  const c = night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f6f5f1] text-[#1b1a17]";
  const muted = night ? "text-[#8d8f95]" : "text-[#6b6861]";
  return (
    <div ref={scroller} className={`h-full w-full overflow-y-auto ${c}`} style={{ height: "100%", scrollBehavior: "auto" }}>
      <DocketNav
        theme={night ? "night" : "paper"}
        brand={{ name: "Relay", mark: "R" }}
        links={LINKS}
        cta={{ label: "Start a project", href: "#start" }}
        scrollRef={scroller}
      />
      <main className="mx-auto max-w-[44rem] px-6 pb-40">
        {SECTIONS.map(([id, title, body], i) => (
          <section key={id} id={id} className="mt-24 min-h-[70%]">
            <p className={`font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] ${muted}`}>{String(i + 1).padStart(2, "0")} · {id}</p>
            <h2 className="mt-3 font-[family-name:Instrument_Serif] text-[2.6rem] leading-[1] tracking-[-0.02em]">{title}</h2>
            <p className={`mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed ${muted}`}>{body}</p>
          </section>
        ))}
        <p className={`mt-24 font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] ${muted}`}>Scroll, or narrow the preview to see the menu</p>
      </main>
    </div>
  );
}
