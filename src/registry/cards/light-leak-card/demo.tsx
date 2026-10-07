"use client";

import { LightLeakCard, type LeakTone } from "./LightLeakCard";

const TONES: Record<string, LeakTone> = {
  indigo: { light: "#3b4dff", deep: "#0d0f2c", rim: "#9aa6ff", page: "#09092a" },
  teal: { light: "#14b8a6", deep: "#06181a", rim: "#8ff0e2", page: "#041416" },
  amber: { light: "#ff8a1f", deep: "#1a0f06", rim: "#ffc88f", page: "#140b04" },
};

export default function Demo({ variant = "indigo" }: { variant?: string }) {
  const tone = TONES[variant] ?? TONES.indigo;
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-14" style={{ background: `linear-gradient(180deg, ${tone.page}, #000 92%)` }}>
      <LightLeakCard tone={tone} />
    </div>
  );
}
