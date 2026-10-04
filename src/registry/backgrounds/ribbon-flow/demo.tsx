"use client";

import { RibbonFlow } from "./RibbonFlow";

const THEMES: Record<string, { colors: string[]; bg: string }> = {
  aurora: { colors: ["#8fa8d8", "#a898e0", "#7fc4c8", "#d8a8c8"], bg: "#08060c" },
  ember: { colors: ["#e8a24a", "#d8704a", "#f0c890", "#a85a6a"], bg: "#0b0706" },
  mono: { colors: ["#efe8dc", "#a7a1ab", "#b9cce4"], bg: "#08070a" },
};

export default function Demo({ variant = "aurora" }: { variant?: string }) {
  const t = THEMES[variant] ?? THEMES.aurora;
  return (
    <RibbonFlow colors={t.colors} background={t.bg} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full items-end p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">Silk · {t.colors.length} ribbons</p>
      </div>
    </RibbonFlow>
  );
}
