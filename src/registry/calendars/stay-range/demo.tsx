"use client";

import { useState } from "react";
import { StayRange, type Stay } from "./StayRange";

// A fixed "today", so the server and the browser agree on every date.
const TODAY = "2026-11-12";
// Casa Alba, Lisbon: nights other guests already hold.
const BOOKED = ["2026-11-14", "2026-11-15", "2026-11-25", "2026-11-26", "2026-11-27", "2026-12-05", "2026-12-06", "2026-12-18", "2026-12-19", "2026-12-20", "2026-12-24", "2026-12-25", "2026-12-26", "2026-12-31"];
// Friday and Saturday nights cost more.
const rate = (night: string) => ([5, 6].includes(new Date(night).getUTCDay()) ? 214 : 168);

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  const [reserved, setReserved] = useState<Stay | null>(null);
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-3 p-4 sm:p-8 ${theme === "dark" ? "bg-[#0b0a09] text-[#a39b92]" : "bg-[#f3eee6] text-[#78716c]"}`}>
      <StayRange theme={theme} today={TODAY} booked={BOOKED} minNights={2} rate={rate} currency="EUR" onChange={() => setReserved(null)} onReserve={setReserved} />
      <p className="m-0 min-h-5 text-[13px]" role="status">{reserved ? `Casa Alba is held for you: ${reserved.nights} nights from ${reserved.from}.` : "Casa Alba, Lisbon · two-night minimum"}</p>
    </div>
  );
}
