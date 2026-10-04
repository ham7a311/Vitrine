"use client";

import { useState } from "react";
import { TrashDrop } from "./TrashDrop";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const all = ["Draft — Salalah weekend", "Copy of itinerary (2)", "Old receipt, Nizwa souq"];
  const [items, setItems] = useState(all);
  const [last, setLast] = useState<string | null>(null);
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0e0e11] text-[#ecebf0]" : "bg-[#f3f1ec] text-[#1b1a17]"}`}>
      <div className={`flex w-full max-w-sm flex-col gap-5 rounded-[20px] p-6 ${night ? "bg-[#18181d]" : "bg-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.35)]"}`}>
        <ul className="flex flex-col">
          {items.map((t) => (
            <li key={t} className={`flex items-center justify-between gap-3 border-b py-2 text-[14px] last:border-0 ${night ? "border-white/10" : "border-black/[0.07]"}`}>
              <span>{t}</span>
              <TrashDrop label={`Delete ${t}`} onDelete={() => { setItems((x) => x.filter((y) => y !== t)); setLast(t); }} />
            </li>
          ))}
          {!items.length && <li className="py-3 text-[14px] opacity-55">Nothing left in drafts.</li>}
        </ul>
        <div className="flex min-h-9 items-center justify-between text-[13px]" aria-live="polite">
          {last ? <span className="opacity-60">Deleted “{last}”</span> : <span />}
          {last && (
            <button type="button" className="font-medium underline underline-offset-4" onClick={() => { setItems((x) => all.filter((y) => x.includes(y) || y === last)); setLast(null); }}>
              Undo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
