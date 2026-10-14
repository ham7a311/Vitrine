"use client";
import { VelvetGrain, type VelvetGrainPalette } from "./VelvetGrain";

const P: Record<string, VelvetGrainPalette> = {
  oxblood: { bg: "#070405", dye: "#7a1515", grain: 0.14 },
  moss: { bg: "#050604", dye: "#4c5c1d", grain: 0.14 },
  indigo: { bg: "#04050a", dye: "#232c6c", grain: 0.14 },
};

export default function Demo({ variant = "oxblood" }: { variant?: string }) {
  return <VelvetGrain palette={P[variant] ?? P.oxblood} className="h-full min-h-full w-full" />;
}
