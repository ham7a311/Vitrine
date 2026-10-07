"use client";

import { NebulaPillButton } from "./NebulaPillButton";
import { PALETTES } from "./nebula";

export default function Demo({ variant = "nebula" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-black px-4 py-12">
      <NebulaPillButton palette={PALETTES[variant] ?? PALETTES.nebula} size={20} className="max-w-full" />
    </div>
  );
}
