"use client";

import { LenticularCard } from "./LenticularCard";

function Face({ mode }: { mode: "day" | "night" }) {
  const day = mode === "day";
  return (
    <div
      className="relative flex h-full flex-col justify-between overflow-hidden p-6"
      style={{
        background: day
          ? "radial-gradient(90% 60% at 70% 20%, #fff4d9 0%, #f3c98a 30%, #d97843 62%, #5a2a3a 100%)"
          : "radial-gradient(90% 60% at 30% 25%, #3b4f7a 0%, #1b1f3d 45%, #0a0916 100%)",
        color: day ? "#2a1418" : "#e6ecfa",
      }}
    >
      <div
        className="absolute rounded-full"
        style={
          day
            ? { width: 120, height: 120, right: 34, top: 44, background: "radial-gradient(circle, #fffaf0, #ffd9a0 60%, transparent 70%)" }
            : { width: 84, height: 84, left: 40, top: 56, background: "#e9eefb", boxShadow: "inset -22px -6px 0 0 #1b1f3d, 0 0 40px rgba(200,220,255,0.35)" }
        }
      />
      <p className="relative font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">Nº 07 · Coastline series</p>
      <div className="relative">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">{day ? "Low tide" : "High tide"}</p>
        <p className="mt-1 text-6xl font-semibold tracking-[-0.04em]" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400 }}>
          {day ? "06:40" : "22:15"}
        </p>
        <p className="mt-2 text-sm opacity-80">{day ? "First light over the harbour." : "Moonrise over the breakwater."}</p>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-10">
      <LenticularCard label="Coastline poster, day and night" front={<Face mode="day" />} back={<Face mode="night" />} />
    </div>
  );
}
