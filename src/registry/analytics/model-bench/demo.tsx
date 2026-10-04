"use client";

import { ModelBench, type Model } from "./ModelBench";

// Fictional models and results, for illustration.
const MODELS: Model[] = [
  { id: "o3", name: "Orion 3", provider: "Orion Labs", score: 71.4, lo: 68.9, hi: 73.8, cost: 1.92, seconds: 214 },
  { id: "o3m", name: "Orion 3 Mini", provider: "Orion Labs", score: 63.2, lo: 60.6, hi: 65.7, cost: 0.41, seconds: 96 },
  { id: "lp", name: "Lumen Pro", provider: "Lumen AI", score: 68.7, lo: 66.1, hi: 71.2, cost: 2.36, seconds: 162 },
  { id: "lf", name: "Lumen Flash", provider: "Lumen AI", score: 55.9, lo: 53.1, hi: 58.6, cost: 0.12, seconds: 41 },
  { id: "k2", name: "Kestrel 2", provider: "Kestrel", score: 66.1, lo: 63.4, hi: 68.7, cost: 0.74, seconds: 238 },
  { id: "k2l", name: "Kestrel 2 Lite", provider: "Kestrel", score: 52.4, lo: 49.6, hi: 55.1, cost: 0.09, seconds: 52 },
  { id: "n70", name: "Nimbus 70B", provider: "Nimbus (open)", score: 57.1, lo: 54.3, hi: 59.8, cost: 0.52, seconds: 118 },
  { id: "n8", name: "Nimbus 8B", provider: "Nimbus (open)", score: 38.6, lo: 35.8, hi: 41.4, cost: 0.03, seconds: 34 },
  { id: "sc", name: "Sable Coder", provider: "Sable", score: 61.5, lo: 58.8, hi: 64.1, cost: 0.62, seconds: 74 },
];
const PROVIDERS = ["Orion Labs", "Lumen AI", "Kestrel", "Nimbus (open)", "Sable"];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-4 sm:p-8 ${dark ? "bg-[#0f0f0e]" : "bg-[#f2f1ed]"}`}>
      <ModelBench models={MODELS} providers={PROVIDERS} theme={dark ? "dark" : "light"} />
    </div>
  );
}
