"use client";

import { TidalLines } from "./TidalLines";

const COLORS: Record<string, [string, string]> = {
  phosphor: ["#86efac", "#000000"],
  frost: ["#b9cce4", "#07090d"],
  lilac: ["#c8b9ea", "#0b0810"],
  cream: ["#efe8dc", "#0e0d0b"],
};

export default function Demo({ variant = "phosphor" }: { variant?: string }) {
  const [color, bg] = COLORS[variant] ?? COLORS.phosphor;
  return (
    <TidalLines color={color} background={bg} className="h-full min-h-full w-full">
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color }}>
          Signal · Open
        </p>
        <p className="max-w-lg text-3xl font-medium tracking-tight text-white/90">Let’s make something quiet and exact.</p>
      </div>
    </TidalLines>
  );
}
