"use client";
import { SegmentCounter } from "./SegmentCounter";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${dark ? "bg-[#0d0e0f]" : "bg-[#e8e8e4]"}`}>
      <div className="w-full max-w-[36rem]">
        <SegmentCounter
          label="Reminder to Masar customers"
          defaultValue={"Hi Layla, your Masar workspace renews on 19 October. We’ve kept your price at 12 OMR a month. Reply STOP to opt out, or visit masar.example/billing to change your plan."}
          maxParts={2}
          pricePerPart={0.012}
          currency="OMR"
          locale="en-GB"
          theme={dark ? "dark" : "light"}
        />
      </div>
    </div>
  );
}
