"use client";

import { SlopeChart, type SlopeItem } from "./SlopeChart";

const ITEMS: SlopeItem[] = [
  { name: "Muscat", values: { Bookings: [4820, 5210], Revenue: [612000, 655000] } },
  { name: "Salalah", values: { Bookings: [2140, 3980], Revenue: [281000, 512000] } },
  { name: "Nizwa", values: { Bookings: [2960, 2710], Revenue: [214000, 198000] } },
  { name: "Sur", values: { Bookings: [1620, 1890], Revenue: [139000, 171000] } },
  { name: "Jabal Akhdar", values: { Bookings: [1880, 2450], Revenue: [356000, 402000] } },
  { name: "Musandam", values: { Bookings: [2410, 1960], Revenue: [298000, 241000] } },
  { name: "Wahiba Sands", values: { Bookings: [1310, 1420], Revenue: [188000, 205000] } },
  { name: "Duqm", values: { Bookings: [690, 1140], Revenue: [84000, 152000] } },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-4 sm:p-8 ${dark ? "bg-[#0f0f0e]" : "bg-[#f2f1ed]"}`}>
      <SlopeChart items={ITEMS} periods={["2025", "2026"]} measures={["Bookings", "Revenue"]} theme={dark ? "dark" : "light"} />
    </div>
  );
}
