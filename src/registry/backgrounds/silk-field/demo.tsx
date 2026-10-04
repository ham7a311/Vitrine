"use client";

import { useEffect, useState } from "react";
import { SILK_PALETTES, SilkField, type SilkPalette } from "./SilkField";

type Name = keyof typeof SILK_PALETTES;
const ORDER: Name[] = ["tide", "violet", "ember", "phosphor", "verdigris", "graphite", "dusk", "umber"];

export default function Demo({ variant = "tide" }: { variant?: string }) {
  const cycling = variant === "cycle";
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!cycling) return;
    const id = setInterval(() => setI((n) => (n + 1) % ORDER.length), 3200);
    return () => clearInterval(id);
  }, [cycling]);

  const name: Name = cycling ? ORDER[i] : ((variant in SILK_PALETTES ? variant : "tide") as Name);
  const palette = SILK_PALETTES[name] as SilkPalette;
  const lens = name === "dusk" || name === "umber" ? "none" : "cursor";

  return (
    <SilkField palette={palette} lens={lens} lensRadius={0.28} intensity={name === "dusk" ? 0.9 : 0.75} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full items-end p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">
          {name} · lens {lens}
        </p>
      </div>
    </SilkField>
  );
}
