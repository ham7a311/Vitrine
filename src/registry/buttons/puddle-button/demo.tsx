"use client";

import { PuddleButton } from "./PuddleButton";

export default function Demo({ variant = "dusk" }: { variant?: string }) {
  const lagoon = variant === "lagoon";
  return (
    <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden p-8" style={{ background: lagoon ? "#06141c" : "#140c1d" }}>
      <div
        aria-hidden="true"
        className="absolute inset-[-20%]"
        style={{
          background: lagoon
            ? "radial-gradient(32% 42% at 34% 44%, #14b8a6, transparent 70%), radial-gradient(30% 40% at 68% 56%, #3b82f6, transparent 70%), radial-gradient(22% 28% at 52% 30%, #a3e635, transparent 70%)"
            : "radial-gradient(32% 42% at 34% 44%, #ff7a59, transparent 70%), radial-gradient(30% 40% at 68% 56%, #8b5cf6, transparent 70%), radial-gradient(22% 28% at 52% 30%, #f5c26b, transparent 70%)",
        }}
      />
      {/* Stripes behind the glass, so the bend is easy to see. */}
      <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.22) 0 2px, transparent 2px 14px)" }} />
      <div className="relative flex flex-col items-center gap-5 text-center text-white">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] opacity-80">Qurum Beach · high tide 4:12pm</p>
        <PuddleButton>Check tide times</PuddleButton>
        <p className="text-[0.8125rem] opacity-80">Press anywhere on the glass</p>
      </div>
    </div>
  );
}
