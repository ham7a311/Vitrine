"use client";

import { useState } from "react";
import { GlyphHaloComposer } from "./GlyphHaloComposer";

const GLOWS: Record<string, [string, string]> = {
  ember: ["#ff6a3d", "#3d6bff"],
  aurora: ["#18d6a3", "#8a5cff"],
  dawn: ["#ff4f8b", "#ffb23d"],
};

export default function Demo({ variant = "ember" }: { variant?: string }) {
  const [sent, setSent] = useState<string | null>(null);
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-[#101115] px-4">
      <GlyphHaloComposer glows={GLOWS[variant] ?? GLOWS.ember} onSubmit={(v) => setSent(`Sent with ${v.mode} · ${v.style}${v.voice ? " · voice" : ""}`)} />
      <p className="-mt-16 mb-8 min-h-5 text-center text-[13px] text-[#8b8d97]" role="status">
        {sent}
      </p>
    </div>
  );
}
