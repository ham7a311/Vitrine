"use client";

import { GamutPicker } from "./GamutPicker";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-10" style={{ background: paper ? "#ece8df" : "#08090b" }}>
      <GamutPicker theme={paper ? "paper" : "night"} />
    </div>
  );
}
