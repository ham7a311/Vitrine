"use client";

import { DuskMesh } from "./DuskMesh";

const THEMES: Record<string, { c: [string, string, string, string, string, string]; light: boolean }> = {
  dusk: { c: ["#1a1226", "#e8774f", "#f2b880", "#7b5ea7", "#2e3a87", "#f04f6b"], light: false },
  palm: { c: ["#1c140d", "#c8873a", "#e9c48a", "#6b8f4e", "#3c5a3a", "#9a4a2a"], light: false },
  lagoon: { c: ["#03161c", "#14b8a6", "#7dd3fc", "#2563eb", "#a7f3d0", "#0e7490"], light: false },
  morning: { c: ["#f6efe4", "#f3c9a8", "#cfe0f0", "#e8d7f1", "#f7e3b5", "#fbd5cf"], light: true },
};

export default function Demo({ variant = "dusk" }: { variant?: string }) {
  const t = THEMES[variant] ?? THEMES.dusk;
  return (
    <DuskMesh colors={t.c} grain={t.light ? 0.35 : 0.5} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-center justify-center px-6 text-center">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${t.light ? "text-black/45" : "text-white/60"}`}>Muscat · 18:42 · sunset</p>
        <p className={`mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl ${t.light ? "text-[#1b1a17]" : "text-white"}`}>Evenings at Shatti Al Qurum.</p>
      </div>
    </DuskMesh>
  );
}
