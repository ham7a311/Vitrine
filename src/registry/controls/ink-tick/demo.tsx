"use client";

import { InkTick } from "./InkTick";

const TASKS = [
  { t: "Book the dhow for Thursday sunset", done: true },
  { t: "Send Hamza the final itinerary", done: true },
  { t: "Reserve dinner at Bait Al Luban", done: false },
  { t: "Pack sun cream and water shoes", done: false },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#12110e] text-[#ece5d4]" : "bg-[#f3eee3] text-[#1d1b17]"}`}>
      <fieldset className="w-full max-w-md">
        <legend className="mb-3 font-[family-name:Instrument_Serif] text-[2rem] italic leading-none">Before the weekend</legend>
        <div className="flex flex-col">
          {TASKS.map((x) => (
            <InkTick key={x.t} defaultChecked={x.done} ink={night ? "#8fb4ff" : "#1d4ed8"} className="text-[1.0625rem]">
              {x.t}
            </InkTick>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
