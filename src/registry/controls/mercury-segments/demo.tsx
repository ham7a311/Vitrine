"use client";

import { useState } from "react";
import { MercurySegments } from "./MercurySegments";

export default function Demo({ variant = "mercury" }: { variant?: string }) {
  const [v, setV] = useState("week");
  const tint = variant === "gold" ? "#e8c07a" : variant === "rose" ? "#e9b3b0" : "#c9d3de";
  if (variant === "billing")
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[#0c0b0a] p-8">
        <MercurySegments label="Billing" segments={[{ id: "m", label: "Monthly" }, { id: "y", label: "Yearly · save 20%" }]} tint="#e8c07a" />
      </div>
    );
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-5 bg-[#0c0b0a] p-8">
      <MercurySegments
        key={variant}
        label="Range"
        tint={tint}
        value={v}
        onChange={setV}
        segments={[{ id: "day", label: "Day" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }, { id: "year", label: "Year" }]}
      />
      <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.14em] text-[#7d7782]">showing · last {v}</p>
    </div>
  );
}
