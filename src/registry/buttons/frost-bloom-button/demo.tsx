"use client";

import { FrostBloomButton } from "./FrostBloomButton";
import { PALETTES } from "./bloom";

export default function Demo({ variant = "azure" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-black px-4 py-12">
      <FrostBloomButton palette={PALETTES[variant] ?? PALETTES.azure} size={20} className="max-w-full" />
    </div>
  );
}
