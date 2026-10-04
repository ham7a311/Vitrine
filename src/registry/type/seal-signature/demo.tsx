"use client";

import { SealSignature } from "./SealSignature";

const SETS: Record<string, { name: string; number: string; color: string }[]> = {
  indigo: [{ name: "Hamza Al-Bulushi", number: "01", color: "#5C7CFA" }],
  rose: [{ name: "Hamza Al-Bulushi", number: "02", color: "#EF6FA7" }],
  jade: [{ name: "Hamza Al-Bulushi", number: "03", color: "#2FBF71" }],
  trio: [
    { name: "Hamza Al-Bulushi", number: "01", color: "#5C7CFA" },
    { name: "Hamza Al-Bulushi", number: "02", color: "#EF6FA7" },
    { name: "Hamza Al-Bulushi", number: "03", color: "#2FBF71" },
  ],
};

export default function Demo({ variant = "indigo" }: { variant?: string }) {
  const seals = SETS[variant] ?? SETS.indigo;
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-x-10 gap-y-16 bg-[#0c0b0a] px-5 py-14 sm:p-10">
      {seals.map((s, i) => (
        <div key={s.number} className={seals.length > 1 ? "w-[min(100%,215px)] sm:w-[220px]" : "w-[min(100%,215px)] sm:w-[260px]"}>
          <SealSignature {...s} offset={i * 3.7} />
        </div>
      ))}
    </div>
  );
}
