"use client";

import { FlutedGlass } from "./FlutedGlass";

const THEMES: Record<string, [string, string, string, string, string]> = {
  amber: ["#140c08", "#d9733a", "#8a3b2a", "#f0b37a", "#ffd7a0"],
  sea: ["#04121a", "#1f7a8c", "#2f5fd0", "#7fd1c4", "#e9f7ff"],
  mono: ["#0c0c0d", "#5b5b60", "#2a2a2e", "#b8b6b0", "#f4f1ea"],
};

export default function Demo({ variant = "amber" }: { variant?: string }) {
  return (
    <FlutedGlass colors={THEMES[variant] ?? THEMES.amber} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col justify-end p-6 sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">Qantab Studio · Interiors</p>
        <p className="mt-2 max-w-md text-2xl font-semibold tracking-tight text-white sm:text-4xl">Light, slowed down.</p>
      </div>
    </FlutedGlass>
  );
}
