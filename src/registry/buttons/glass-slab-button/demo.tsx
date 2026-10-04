"use client";

import { GlassSlabButton } from "./GlassSlabButton";

export default function Demo({ variant = "violet" }: { variant?: string }) {
  const ice = variant === "ice";
  const glow = ice ? "#7fd8ff" : "#c25cff";
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-5 p-10" style={{ background: ice ? "#03070d" : "#07040e" }}>
      <GlassSlabButton glow={glow}>Enter the studio</GlassSlabButton>
      <GlassSlabButton glow={glow}>Book a session</GlassSlabButton>
    </div>
  );
}
