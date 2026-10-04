"use client";

import { AttachmentTray } from "./AttachmentTray";

const FILES = [
  { id: "1", name: "Q3-board-deck.pdf", kind: "pdf" as const, bytes: 4.8e6 },
  { id: "2", name: "churn-by-cohort.csv", kind: "sheet" as const, bytes: 9.2e5 },
  { id: "3", name: "hero-shot.png", kind: "image" as const, bytes: 2.6e6, failAt: 0.62 },
  { id: "4", name: "pricing.tsx", kind: "code" as const, bytes: 1.4e5 },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0f0e10]" : "bg-[#f5f1e8]"}`}>
      <AttachmentTray initial={FILES} theme={night ? "night" : "paper"} />
    </div>
  );
}
