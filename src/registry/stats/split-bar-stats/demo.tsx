"use client";

import { SplitBarStats } from "./SplitBarStats";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const c = night
    ? ["#b9cce4", "#f0b37a", "#7fd1a8", "#c8b9ea", "#e8a0a8", "#d8d1c4"]
    : ["#2f5fd0", "#d9733a", "#1f7a4d", "#7c5cc4", "#b4372a", "#8a8377"];
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${night ? "bg-[#0b0a0d] text-[#efe8dc]" : "bg-[#f3f1ec] text-[#1b1a17]"}`}>
      <div className="w-full max-w-3xl">
        <p className={`mb-4 font-mono text-[11px] uppercase tracking-[0.16em] ${night ? "text-[#9c96a1]" : "text-[#6f6a62]"}`}>Al Khuwair household · where it went</p>
        <SplitBarStats
          theme={night ? "night" : "paper"}
          label="Household spending"
          periods={["Month", "Year"]}
          shares={[
            { label: "Rent", values: [520, 6240], color: c[0] },
            { label: "Groceries", values: [310, 3480], color: c[1] },
            { label: "School", values: [180, 3150], color: c[2] },
            { label: "Transport", values: [140, 1560], color: c[3] },
            { label: "Savings", values: [200, 1900], color: c[4] },
            { label: "Other", values: [95, 1420], color: c[5] },
          ]}
        />
      </div>
    </div>
  );
}
