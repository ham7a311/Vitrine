"use client";

import { SankeyFlow, type Flow } from "./SankeyFlow";

const COLUMNS = [["Search", "Social", "Direct", "Email"], ["Destinations", "Deals", "Guides"], ["Booked", "Saved", "Left"]];
const FLOWS: Flow[] = [
  { from: "Search", to: "Destinations", value: 5200 }, { from: "Search", to: "Deals", value: 2400 }, { from: "Search", to: "Guides", value: 1800 },
  { from: "Social", to: "Destinations", value: 1400 }, { from: "Social", to: "Guides", value: 2600 }, { from: "Social", to: "Deals", value: 600 },
  { from: "Direct", to: "Destinations", value: 2100 }, { from: "Direct", to: "Deals", value: 1300 },
  { from: "Email", to: "Deals", value: 1700 }, { from: "Email", to: "Destinations", value: 500 },
  { from: "Destinations", to: "Booked", value: 2300 }, { from: "Destinations", to: "Saved", value: 2700 }, { from: "Destinations", to: "Left", value: 4200 },
  { from: "Deals", to: "Booked", value: 2600 }, { from: "Deals", to: "Saved", value: 900 }, { from: "Deals", to: "Left", value: 2500 },
  { from: "Guides", to: "Booked", value: 500 }, { from: "Guides", to: "Saved", value: 1500 }, { from: "Guides", to: "Left", value: 2400 },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-4 sm:p-8 ${dark ? "bg-[#0f0f0e]" : "bg-[#f2f1ed]"}`}>
      <SankeyFlow columns={COLUMNS} flows={FLOWS} theme={dark ? "dark" : "light"} />
    </div>
  );
}
