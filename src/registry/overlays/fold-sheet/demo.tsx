"use client";

import { useMemo, useState } from "react";
import { FoldSheet } from "./FoldSheet";

const INVOICES = [
  { id: "INV-2041", client: "Muscat Municipality", amount: 4200, status: "Paid" },
  { id: "INV-2040", client: "Oman Air Cargo", amount: 1860, status: "Open" },
  { id: "INV-2039", client: "GUtech Library", amount: 640, status: "Overdue" },
  { id: "INV-2038", client: "Nizwa Dates Co.", amount: 2975, status: "Paid" },
  { id: "INV-2037", client: "Sohar Port Logistics", amount: 7310, status: "Open" },
  { id: "INV-2036", client: "Royal Hospital", amount: 1120, status: "Draft" },
];
const STATUSES = ["Paid", "Open", "Overdue", "Draft", "Void"];
const RANGES = ["7 days", "30 days", "Quarter", "Year"];
const OWNERS = ["Hamza Al-Bulushi", "Finance team", "Unassigned"];
const TAGS = ["Government", "Education", "Healthcare", "Logistics", "Retail", "Hospitality", "Energy", "Construction", "Aviation", "Agriculture", "Non-profit", "Recurring", "Annual", "Milestone", "Retainer", "Grant-funded"];

function toggle<T>(list: T[], v: T) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string[]>(["Open", "Overdue"]);
  const [range, setRange] = useState("30 days");
  const [owners, setOwners] = useState<string[]>(["Hamza Al-Bulushi"]);
  const [tags, setTags] = useState<string[]>([]);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const count = useMemo(() => {
    const base = 128;
    const s = status.length ? status.length / STATUSES.length : 1;
    const o = owners.length ? owners.length / OWNERS.length : 1;
    const t = tags.length ? Math.min(1, 0.18 + tags.length * 0.07) : 1;
    const r = { "7 days": 0.2, "30 days": 0.55, Quarter: 0.8, Year: 1 }[range] ?? 1;
    return Math.max(1, Math.round(base * s * o * t * r));
  }, [status, owners, tags, range]);
  const active = status.length + owners.length + tags.length + (min || max ? 1 : 0);

  const c = night
    ? { page: "bg-[#0f1012] text-[#ebebe8]", muted: "text-[#8e9096]", line: "border-white/[0.07]", ring: "ring-white/10", chip: "ring-white/[0.12] hover:bg-white/[0.05]", on: "bg-[#ebebe8] text-[#111214] ring-[#ebebe8]", field: "bg-[#111214] ring-white/10 focus:ring-white/40", primary: "bg-[#ebebe8] text-[#111214]" }
    : { page: "bg-[#f3f1ec] text-[#1c1b18]", muted: "text-[#6d6a62]", line: "border-black/[0.07]", ring: "ring-black/10", chip: "ring-black/[0.12] hover:bg-black/[0.04]", on: "bg-[#1c1b18] text-[#fbfaf7] ring-[#1c1b18]", field: "bg-white ring-black/10 focus:ring-black/40", primary: "bg-[#1c1b18] text-[#fbfaf7]" };

  const chip = (label: string, on: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`h-8 rounded-full px-3 text-[13px] ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${on ? c.on : c.chip} ${night ? "focus-visible:outline-white" : "focus-visible:outline-black"}`}
    >
      {label}
    </button>
  );
  const section = "mt-6 first:mt-4";
  const legend = `float-left mb-2.5 w-full text-[12px] font-medium uppercase tracking-[0.08em] ${c.muted}`;

  return (
    <div className={`relative h-full min-h-[560px] w-full overflow-hidden ${c.page}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="mx-auto max-w-[760px] px-5 py-7">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Invoices</h1>
            <p className={`text-[13px] ${c.muted}`}>GUtech Studio · Q3</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-medium ring-1 transition-colors ${c.ring} ${night ? "hover:bg-white/[0.05]" : "hover:bg-black/[0.04]"}`}
          >
            <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 4h11M4.5 8h7M6.5 12h3" />
            </svg>
            Filters
            {active > 0 && <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] tabular-nums ${c.primary}`}>{active}</span>}
          </button>
        </div>

        <ul className={`mt-6 divide-y rounded-xl ring-1 ${c.ring} ${night ? "divide-white/[0.07] bg-[#16171a]" : "divide-black/[0.07] bg-white"}`}>
          {INVOICES.map((inv) => (
            <li key={inv.id} className="flex items-center gap-4 px-4 py-3 text-[13.5px]">
              <span className={`w-[4.6rem] shrink-0 font-mono text-[12px] ${c.muted}`}>{inv.id}</span>
              <span className="min-w-0 flex-1 truncate">{inv.client}</span>
              <span className={`hidden w-16 text-[12px] sm:block ${c.muted}`}>{inv.status}</span>
              <span className="w-20 text-right tabular-nums">{inv.amount.toLocaleString("en")} <span className={`text-[11px] ${c.muted}`}>OMR</span></span>
            </li>
          ))}
        </ul>
      </div>

      <FoldSheet
        contained
        theme={night ? "night" : "paper"}
        open={open}
        onClose={() => setOpen(false)}
        title="Filter invoices"
        description={`${count} of 128 invoices match`}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setStatus([]);
                setOwners([]);
                setTags([]);
                setMin("");
                setMax("");
                setRange("Year");
              }}
              className={`h-10 rounded-[10px] px-3 text-[13.5px] font-medium ${c.muted} ${night ? "hover:text-white" : "hover:text-black"}`}
            >
              Clear all
            </button>
            <button type="button" onClick={() => setOpen(false)} className={`ml-auto h-10 rounded-[10px] px-4 text-[13.5px] font-medium tabular-nums ${c.primary}`}>
              Show {count} invoices
            </button>
          </>
        }
      >
        <fieldset className={section}>
          <legend className={legend}>Status</legend>
          <div className="clear-both flex flex-wrap gap-1.5">{STATUSES.map((s) => chip(s, status.includes(s), () => setStatus(toggle(status, s))))}</div>
        </fieldset>

        <fieldset className={section}>
          <legend className={legend}>Issued in the last</legend>
          <div className={`clear-both grid grid-cols-4 rounded-[10px] p-0.5 ring-1 ${c.ring}`}>
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={range === r}
                onClick={() => setRange(r)}
                className={`h-8 rounded-lg text-[12.5px] transition-colors ${range === r ? c.on : c.muted}`}
              >
                {r}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={section}>
          <legend className={legend}>Amount (OMR)</legend>
          <div className="clear-both flex items-center gap-2">
            <input inputMode="numeric" placeholder="Min" aria-label="Minimum amount" value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))} className={`h-9 w-full min-w-0 rounded-lg px-3 text-[13.5px] tabular-nums outline-none ring-1 ${c.field}`} />
            <span className={c.muted} aria-hidden="true">–</span>
            <input inputMode="numeric" placeholder="Max" aria-label="Maximum amount" value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))} className={`h-9 w-full min-w-0 rounded-lg px-3 text-[13.5px] tabular-nums outline-none ring-1 ${c.field}`} />
          </div>
        </fieldset>

        <fieldset className={section}>
          <legend className={legend}>Owner</legend>
          <div className="clear-both grid gap-1">
            {OWNERS.map((o) => (
              <label key={o} className={`flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[13.5px]`}>
                <input
                  type="checkbox"
                  checked={owners.includes(o)}
                  onChange={() => setOwners(toggle(owners, o))}
                  className={`size-4 shrink-0 appearance-none rounded-[5px] border bg-center bg-no-repeat transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    night ? "border-white/30 checked:border-[#ebebe8] checked:bg-[#ebebe8] focus-visible:outline-white" : "border-black/25 checked:border-[#1c1b18] checked:bg-[#1c1b18] focus-visible:outline-black"
                  }`}
                  style={{ backgroundImage: owners.includes(o) ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 8.5l2.5 2.5L12 5.5' fill='none' stroke='${night ? "%23111214" : "white"}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")` : undefined }}
                />
                {o}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={section}>
          <legend className={legend}>Client sector &amp; terms</legend>
          <div className="clear-both flex flex-wrap gap-1.5">{TAGS.map((t) => chip(t, tags.includes(t), () => setTags(toggle(tags, t))))}</div>
        </fieldset>
      </FoldSheet>
    </div>
  );
}
