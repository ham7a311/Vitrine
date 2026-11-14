"use client";

import { WeightShiftButton } from "./WeightShiftButton";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-8 p-8 ${theme === "dark" ? "bg-[#0c0c0e]" : "bg-[#fafafa]"}`}>
      <WeightShiftButton theme={theme} style={{ minHeight: 60, padding: "0 32px", fontSize: "1.25rem" }}>Request access</WeightShiftButton>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <WeightShiftButton theme={theme}>Compare plans</WeightShiftButton>
        <WeightShiftButton theme={theme}>Read the changelog</WeightShiftButton>
        <WeightShiftButton theme={theme} disabled>Archived</WeightShiftButton>
      </div>
    </div>
  );
}
