"use client";

import { BayerHorizon } from "./BayerHorizon";

const P: Record<string, { palette: [string, string, string]; ink: string; muted: string; setting?: boolean }> = {
  lilac: { palette: ["#0b080d", "#3a2748", "#e6d6f2"], ink: "#f3ecf7", muted: "#b9a9c7" },
  frost: { palette: ["#070a0e", "#1f3146", "#d3e3f5"], ink: "#eef4fb", muted: "#9fb2c7" },
  ember: { palette: ["#0c0807", "#5b2c1a", "#f3c592"], ink: "#fbefe2", muted: "#caa283", setting: true },
};

export default function Demo({ variant = "lilac" }: { variant?: string }) {
  const v = P[variant] ?? P.lilac;
  return (
    <BayerHorizon palette={v.palette} setting={v.setting}>
      <div className="flex h-full min-h-[30rem] flex-col justify-start px-[8%] pt-[12%]">
        <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em]" style={{ color: v.muted }}>Field notes · No. 12</p>
        <h1 className="mt-4 max-w-[16ch] font-[family-name:Instrument_Serif] text-[clamp(2.4rem,5.4vw,4.4rem)] leading-[1] tracking-[-0.02em]" style={{ color: v.ink }}>
          The last hour of light, in three colours.
        </h1>
      </div>
    </BayerHorizon>
  );
}
