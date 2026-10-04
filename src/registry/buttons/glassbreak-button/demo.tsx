"use client";

import { GlassbreakButton } from "./GlassbreakButton";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div
      className="flex min-h-full w-full flex-wrap items-center justify-center gap-6 p-10"
      style={{ background: dark ? "#10161c" : "#f6f4ef" }}
    >
      <GlassbreakButton surface={dark ? "dark" : "light"}>Request a quote</GlassbreakButton>
      <GlassbreakButton surface={dark ? "dark" : "light"} size="compact">
        Contact
      </GlassbreakButton>
    </div>
  );
}
