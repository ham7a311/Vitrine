"use client";

import { ChromeText } from "./ChromeText";

const BG: Record<string, string> = {
  chrome: "radial-gradient(120% 70% at 50% 62%, #1b2a48 0%, #0a1020 45%, #04060c 100%)",
  gold: "radial-gradient(120% 70% at 50% 62%, #3a2408 0%, #140c03 48%, #070402 100%)",
  rose: "radial-gradient(120% 70% at 50% 62%, #3b1a2a 0%, #150910 48%, #08040a 100%)",
};

export default function Demo({ variant = "chrome" }: { variant?: string }) {
  const finish = (["chrome", "gold", "rose"].includes(variant) ? variant : "chrome") as "chrome" | "gold" | "rose";
  return (
    <div className="flex min-h-full w-full items-center justify-center overflow-hidden px-4 py-16" style={{ background: BG[finish] }}>
      <ChromeText text="Vitrine" tagline="Est. 2026 · Muscat" finish={finish} />
    </div>
  );
}
