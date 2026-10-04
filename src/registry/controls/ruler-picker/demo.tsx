"use client";

import { RulerPicker } from "./RulerPicker";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-12" style={{ background: night ? "#09090b" : "#ebe5d9" }}>
      <RulerPicker theme={night ? "night" : "paper"} />
    </div>
  );
}
