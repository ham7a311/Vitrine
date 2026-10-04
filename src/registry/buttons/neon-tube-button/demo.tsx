"use client";

import { NeonTubeButton } from "./NeonTubeButton";

export default function Demo({ variant = "pink" }: { variant?: string }) {
  const color = variant === "cyan" ? "#4fd8ff" : variant === "amber" ? "#ffb347" : "#ff4fa3";
  return (
    <div
      className="flex min-h-full w-full items-center justify-center p-8"
      style={{ background: "radial-gradient(70% 60% at 50% 45%, #1d1820, #0a080b 75%), #0a080b" }}
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#8f8994]">Late set · Friday · Doors 22:00</p>
        <NeonTubeButton color={color}>Get on the list</NeonTubeButton>
      </div>
    </div>
  );
}
