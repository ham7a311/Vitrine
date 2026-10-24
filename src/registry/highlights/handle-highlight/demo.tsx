"use client";

import { HandleHighlight, type HandleShape } from "./HandleHighlight";

const LOOKS: Record<string, { shape: HandleShape; night: boolean; b: string }> = {
  circles: { shape: "circle", night: true, b: "#ff5fa2" },
  squares: { shape: "square", night: false, b: "#f0601f" },
  triangles: { shape: "triangle", night: true, b: "#a58bff" },
  diamonds: { shape: "diamond", night: false, b: "#178a64" },
};

export default function Demo({ variant = "circles" }: { variant?: string }) {
  const look = LOOKS[variant] ?? LOOKS.circles;
  const { shape, night, b } = look;
  return (
    <div className={`flex min-h-full w-full items-center px-6 py-16 sm:px-14 ${night ? "bg-[#0e0f13] text-[#f1f2f5]" : "bg-[#f6f5f1] text-[#15161a]"}`}>
      <div className="mx-auto w-full max-w-4xl">
        <p className={`mb-6 font-mono text-[11px] uppercase tracking-[0.18em] ${night ? "text-white/40" : "text-black/45"}`}>Vitrine · Handoff</p>
        <h2 className="m-0 font-[family-name:Inter] text-[clamp(2.3rem,7vw,5.2rem)] font-semibold leading-[1.38] tracking-[-0.04em]">
          Ship the layout you{" "}
          <HandleHighlight shape={shape} color={b} delay={300}>actually designed.</HandleHighlight>
        </h2>
        <p className={`mt-9 max-w-[48ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-[1.9] ${night ? "text-white/60" : "text-black/60"}`}>
          Spacing, type and states come across exactly as drawn, so review is about the idea, not the pixels.
        </p>
      </div>
    </div>
  );
}
