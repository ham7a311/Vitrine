"use client";

import { Isobar } from "./Isobar";

const THEMES: Record<string, [string, string]> = {
  frost: ["#b9cce4", "#07080c"],
  lilac: ["#c8b9ea", "#0c0910"],
  paper: ["#2a1830", "#ece4d6"],
};

export default function Demo({ variant = "frost" }: { variant?: string }) {
  const [color, bg] = THEMES[variant] ?? THEMES.frost;
  return (
    <Isobar color={color} background={bg} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full items-end justify-between p-6 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color, opacity: 0.6 }}>
        <span>Surface analysis</span>
        <span>1013 hPa</span>
      </div>
    </Isobar>
  );
}
