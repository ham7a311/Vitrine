"use client";

import { SpectrumRingButton } from "./SpectrumRingButton";
import { RINGS } from "./ring";

const LOOKS: Record<string, { ring: string[]; flare: string }> = {
  spectrum: { ring: RINGS.spectrum, flare: "#ffb066" },
  ice: { ring: RINGS.ice, flare: "#9fe7ff" },
  ember: { ring: RINGS.ember, flare: "#ff9a3d" },
};

export default function Demo({ variant = "spectrum" }: { variant?: string }) {
  const look = LOOKS[variant] ?? LOOKS.spectrum;
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#050506] px-4 py-14">
      <SpectrumRingButton ring={look.ring} flare={look.flare} />
    </div>
  );
}
