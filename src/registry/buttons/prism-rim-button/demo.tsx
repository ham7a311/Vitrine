"use client";

import { PrismRimButton } from "./PrismRimButton";
import { RIMS } from "./rim";

export default function Demo({ variant = "spectrum" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-black px-4 py-12">
      <PrismRimButton rim={RIMS[variant] ?? RIMS.spectrum} size={20} className="max-w-full" />
    </div>
  );
}
