"use client";

import { TidefillCard } from "./TidefillCard";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full flex-wrap items-center justify-center gap-6 px-4 py-10 ${night ? "bg-[#0b0a0d]" : "bg-[#f3f1ec]"}`}>
      <TidefillCard theme={night ? "night" : "paper"} label="Savings goal" name="Hajj 2027" saved={2340} goal={3000} step={50} note="on track for May 2027" />
      <TidefillCard theme={night ? "night" : "paper"} label="Savings goal" name="New laptop" saved={265} goal={480} step={25} note="about 9 weeks at this rate" className="hidden md:block" />
    </div>
  );
}
