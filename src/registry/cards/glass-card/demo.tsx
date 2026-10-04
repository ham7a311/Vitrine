"use client";

import { GlassSlabButton } from "../../buttons/glass-slab-button/GlassSlabButton";
import { GlassCard } from "./GlassCard";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-6 bg-[#05030a] p-8">
      <GlassCard
        eyebrow="Vitrine Studio · Pro"
        title="Every component, source and prompt"
        price="OMR 19 / month · cancel any time"
        features={["Every component, with source", "Copy-ready prompts per variant", "Workshop skills and recipes"]}
        action={<GlassSlabButton glow="#c25cff">Start the trial</GlassSlabButton>}
      />
    </div>
  );
}
