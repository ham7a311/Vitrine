"use client";

import { useRef } from "react";
import { LedgerCylinder } from "./LedgerCylinder";

const PALETTES = {
  phosphor: { stats: ["#8fe388", "#ede8df", "#ff6b00"], notes: "#ffe3b8", status: "#8fe388", bg: "#0e0d0b" },
  frost: { stats: ["#b9cce4", "#efe8dc", "#c8b9ea"], notes: "#e8d5b5", status: "#9fd4c8", bg: "#09080b" },
};

export default function Demo({ variant = "phosphor" }: { variant?: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const p = PALETTES[variant as keyof typeof PALETTES] ?? PALETTES.phosphor;

  return (
    <div ref={scroller} className="relative h-full overflow-y-auto overscroll-contain" style={{ background: p.bg }}>
      <div className="flex h-[38%] min-h-40 flex-col items-center justify-end pb-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
        Scroll inside the frame ↓
      </div>
      <LedgerCylinder
        scrollRoot={scroller}
        background={p.bg}
        stats={[
          { value: "48K+", label: "Downloads", color: p.stats[0] },
          { value: "1.2M", label: "Requests / day", color: p.stats[1] },
          { value: "98.4%", label: "Uptime", color: p.stats[2] },
        ]}
        notes={{ label: "Currently", items: ["Rebuilding the search index", "Testing a calmer onboarding", "Writing the v2 migration guide"], color: p.notes }}
        status={{ lines: ["> uptime: 412 days", "> status: shipping"], color: p.status }}
      />
      <div className="flex h-[60%] min-h-48 items-center justify-center font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">End of section</div>
    </div>
  );
}
