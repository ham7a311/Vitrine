"use client";

import { SwatchCard, type Glaze } from "./SwatchCard";

const GLAZES: Glaze[] = [
  { id: "frankincense", name: "Frankincense white", color: "#ece4d3", price: 6.5, stock: 14 },
  { id: "wadi", name: "Wadi green", color: "#5f8a6b", price: 6.5, stock: 8 },
  { id: "sur", name: "Sur indigo", color: "#2f4f86", price: 7.25, stock: 3 },
  { id: "date", name: "Date brown", color: "#6b3f2a", price: 6.5, stock: 11 },
  { id: "copper", name: "Copper lustre", color: "#b46a3c", price: 8.75, stock: 0 },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-4 sm:p-10 ${night ? "bg-[#0c0b0e]" : "bg-[#efebe3]"}`}>
      <SwatchCard
        theme={night ? "night" : "paper"}
        maker="Bahla Pottery · Handmade"
        title="Finjan cup, 90 ml"
        detail="Thrown on the wheel in Bahla from local red clay and dipped by hand, so the glaze line is never quite the same twice. The foot is left bare."
        glazes={GLAZES}
        defaultGlaze="wadi"
      />
    </div>
  );
}
