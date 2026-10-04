"use client";

import { Tessera } from "./Tessera";

const THEMES: Record<string, [string, string, string, string]> = {
  frost: ["#07050a", "#7f93b8", "#eef3fb", "#c8a0e0"],
  amber: ["#080604", "#b88a4c", "#fff1d6", "#ff8a5c"],
  sea: ["#03080a", "#4f8f9a", "#e6fbff", "#9ff0de"],
};

export default function Demo({ variant = "frost" }: { variant?: string }) {
  return (
    <Tessera palette={THEMES[variant] ?? THEMES.frost} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full items-end p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">Leaded glass · 7 panes across</p>
      </div>
    </Tessera>
  );
}
