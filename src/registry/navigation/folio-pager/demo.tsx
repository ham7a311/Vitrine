"use client";

import { useMemo, useState } from "react";
import { FolioPager } from "./FolioPager";

const PLACES = ["Nizwa", "Sur", "Sohar", "Salalah", "Khasab", "Ibri", "Bahla", "Rustaq", "Duqm", "Barka"];
const KINDS = ["fuel stop", "fort", "wadi", "souq", "viewpoint", "campsite", "ferry", "date farm"];
const TOTAL = 212;

const ENTRIES = Array.from({ length: TOTAL }, (_, i) => ({
  n: i + 1,
  title: `${PLACES[(i * 7) % PLACES.length]}, ${KINDS[(i * 3 + 1) % KINDS.length]}`,
  km: 18 + ((i * 53) % 410),
}));

const SIZE = 6;

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [page, setPage] = useState(6);
  const rows = useMemo(() => ENTRIES.slice((page - 1) * SIZE, page * SIZE), [page]);
  const muted = night ? "text-[#8d8f95]" : "text-[#6b6861]";
  const line = night ? "border-white/[0.09]" : "border-black/[0.09]";
  return (
    <div className={`h-full w-full overflow-y-auto ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f6f5f1] text-[#1b1a17]"}`} style={{ height: "100%" }}>
      <div className="mx-auto max-w-[50rem] px-6 pb-16 pt-12">
        <p className={`font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] ${muted}`}>Masar · Saved places</p>
        <h1 className="mb-6 mt-3 font-[family-name:Instrument_Serif] text-[2.5rem] leading-none tracking-[-0.02em]">Stops along the way</h1>
        <ul className={`border-t ${line}`} key={page}>
          {rows.map((r) => (
            <li key={r.n} className={`flex items-baseline gap-4 border-b py-3.5 ${line}`}>
              <span className={`w-10 font-[family-name:Geist_Mono] text-[0.6875rem] tabular-nums ${muted}`}>{String(r.n).padStart(3, "0")}</span>
              <span className="font-[family-name:Instrument_Serif] text-[1.375rem] leading-tight">{r.title}</span>
              <span className={`ml-auto font-[family-name:Geist_Mono] text-[0.75rem] tabular-nums ${muted}`}>{r.km} km</span>
            </li>
          ))}
        </ul>
        <FolioPager theme={night ? "night" : "paper"} total={TOTAL} pageSize={SIZE} page={page} onPage={setPage} noun="places" />
      </div>
    </div>
  );
}
