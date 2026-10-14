"use client";
import { NeonVeins, type NeonVeinsPalette } from "./NeonVeins";

const P: Record<string, NeonVeinsPalette> = {
  violet: { bg: "#040308", vein: "#5b1ef2", core: "#9e70ff", star: "#e8e6f2" },
  cyan: { bg: "#02060a", vein: "#138fd6", core: "#a2ebff", star: "#e6f0f4" },
  rose: { bg: "#080306", vein: "#e0336f", core: "#ffb4cc", star: "#f4e6ec" },
};

export default function Demo({ variant = "violet" }: { variant?: string }) {
  return <NeonVeins palette={P[variant] ?? P.violet} className="h-full min-h-full w-full" />;
}
