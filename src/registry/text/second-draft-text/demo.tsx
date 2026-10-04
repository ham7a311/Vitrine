"use client";

import { SecondDraftText } from "./SecondDraftText";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className="flex min-h-full w-full items-center px-6 py-16 sm:px-14" style={{ background: night ? "#0f0e0d" : "#f5f0e7" }}>
      <SecondDraftText theme={night ? "night" : "paper"} className="mx-auto w-full max-w-4xl" />
    </div>
  );
}
