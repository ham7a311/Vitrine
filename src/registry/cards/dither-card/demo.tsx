"use client";

import { DitherCard } from "./DitherCard";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full flex-wrap items-center justify-center gap-6 p-8 ${night ? "bg-[#070706]" : "bg-[#e9e3d6]"}`}>
      <DitherCard theme={night ? "night" : "paper"} seed={12} title="Masar" year="2025" meta="Trip planning · Next.js · Maps · PostgreSQL" />
      <DitherCard theme={night ? "night" : "paper"} seed={4} title="Wally" year="2024" meta="Household wallet · React Native · Stripe" />
    </div>
  );
}
