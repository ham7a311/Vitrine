"use client";

import { useState, type ReactNode } from "react";
import { SnapFrame } from "./SnapFrame";

const I = (d: string): ReactNode => (
  <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const TOOLS = [
  { id: "bold", label: "Bold", icon: I("M5 3h4a2.5 2.5 0 010 5H5zM5 8h4.6a2.5 2.5 0 010 5H5z") },
  { id: "italic", label: "Italic", icon: I("M10 3H7M9 13H6M9.5 3l-3 10") },
  { id: "link", label: "Link", icon: I("M7 9a3 3 0 004.2.2l1.6-1.6a3 3 0 00-4.2-4.2l-.7.7M9 7a3 3 0 00-4.2-.2L3.2 8.4a3 3 0 004.2 4.2l.7-.7") },
  { id: "list", label: "Bulleted list", icon: I("M6.5 4.5h6M6.5 8h6M6.5 11.5h6M3.5 4.5h0M3.5 8h0M3.5 11.5h0") },
  { id: "quote", label: "Quote", icon: I("M3.5 5v3.5h3V5zM9.5 5v3.5h3V5zM6.5 8.5c0 1.5-.8 2.5-2.5 3M12.5 8.5c0 1.5-.8 2.5-2.5 3") },
];
const TABS = ["Draft", "Review", "Published"];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [on, setOn] = useState<Record<string, boolean>>({ bold: true });
  const [tab, setTab] = useState(0);
  const [status, setStatus] = useState("Saved to Vitrine · 2 min ago");

  const c = night
    ? { page: "bg-[#101113] text-[#efede8]", muted: "text-[#8d8f95]", line: "border-white/[0.08]", card: "bg-[#17181b]", tool: "text-[#c9c8c4] aria-pressed:bg-white/[0.1] aria-pressed:text-white", seg: "bg-white/[0.05]", segOn: "bg-[#2a2b30] text-white shadow-sm", accent: "bg-[#8ab4ff] text-[#0b1530]", ghost: "text-[#c9c8c4]", field: "bg-transparent placeholder:text-white/30", ring: "focus-visible:outline-[#8ab4ff]" }
    : { page: "bg-[#f4f2ed] text-[#1d1c19]", muted: "text-[#77736b]", line: "border-black/[0.08]", card: "bg-white", tool: "text-[#4a4842] aria-pressed:bg-black/[0.07] aria-pressed:text-black", seg: "bg-black/[0.045]", segOn: "bg-white text-black shadow-sm", accent: "bg-[#1d1c19] text-white", ghost: "text-[#4a4842]", field: "bg-transparent placeholder:text-black/30", ring: "focus-visible:outline-[#2f6fed]" };
  const focus = `focus-visible:outline-2 focus-visible:outline-offset-2 ${c.ring}`;

  return (
    <SnapFrame theme={night ? "night" : "paper"} className={`min-h-full w-full ${c.page}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-6 sm:px-8">
        <nav className={`flex items-center gap-1 border-b pb-4 ${c.line}`} aria-label="Vitrine">
          <span className="mr-3 flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <span className={`grid size-6 place-items-center rounded-md text-[11px] ${c.accent}`} aria-hidden="true">A</span>
            Vitrine Notes
          </span>
          {["Docs", "Changelog", "Pricing"].map((l) => (
            <a key={l} href="#" onClick={(e) => e.preventDefault()} className={`hidden rounded-md px-2.5 py-1.5 text-[13.5px] sm:inline ${c.muted} ${focus}`}>
              {l}
            </a>
          ))}
          <button type="button" className={`ml-auto rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${c.line} ${focus}`}>
            Hamza
          </button>
        </nav>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div role="toolbar" aria-label="Formatting" className={`flex items-center gap-0.5 rounded-xl border p-1 ${c.line} ${c.card}`}>
            {TOOLS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-label={t.label}
                aria-pressed={!!on[t.id]}
                onClick={() => setOn((o) => ({ ...o, [t.id]: !o[t.id] }))}
                className={`grid size-8 place-items-center rounded-lg ${c.tool} ${focus}`}
              >
                {t.icon}
              </button>
            ))}
          </div>
          <div role="tablist" aria-label="Stage" className={`flex rounded-[10px] p-[3px] ${c.seg}`}>
            {TABS.map((t, i) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === i}
                onClick={() => setTab(i)}
                className={`rounded-[7px] px-3 py-1 text-[13px] font-medium transition-colors ${tab === i ? c.segOn : c.muted} ${focus}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <article className={`mt-4 rounded-2xl border p-5 sm:p-7 ${c.line} ${c.card}`}>
          <label htmlFor="snap-frame-title" className={`font-mono text-[11px] uppercase tracking-[0.14em] ${c.muted}`}>
            Title
          </label>
          <input id="snap-frame-title" defaultValue="Release 2.4 — offline drafts" className={`mt-1 block w-full text-[22px] font-semibold tracking-[-0.02em] outline-none ${c.field}`} />
          <p className={`mt-4 text-[15px] leading-[1.7] ${c.muted}`}>
            Notes now save to the device first and sync when the signal comes back — on the Nizwa road, in the lift at Muscat Grand Mall, wherever. Point at this paragraph: the pointer becomes a caret the height of the type and settles on the line you’re reading.
          </p>
          <h3 className="mt-5 text-[17px] font-semibold tracking-tight">What changes for your team</h3>
          <ul className={`mt-2 list-disc space-y-1 pl-5 text-[15px] leading-[1.7] ${c.muted}`}>
            <li>Conflicts are merged by paragraph, not by file.</li>
            <li>
              Drafts older than 30 days are archived, never deleted — <a href="#" onClick={(e) => e.preventDefault()} className={`rounded-sm underline underline-offset-2 ${focus}`}>read the policy</a>.
            </li>
          </ul>
          <div className={`mt-7 flex items-center gap-2 border-t pt-5 ${c.line}`}>
            <p className={`mr-auto text-[12.5px] ${c.muted}`} role="status">
              {status}
            </p>
            <button type="button" onClick={() => setStatus("Changes discarded")} className={`rounded-lg px-3.5 py-2 text-[13.5px] font-medium ${c.ghost} ${focus}`}>
              Discard
            </button>
            <button type="button" onClick={() => setStatus(`Published to ${TABS[2]} · just now`)} className={`rounded-full px-4 py-2 text-[13.5px] font-medium ${c.accent} ${focus}`}>
              Publish
            </button>
          </div>
        </article>
      </div>
    </SnapFrame>
  );
}
