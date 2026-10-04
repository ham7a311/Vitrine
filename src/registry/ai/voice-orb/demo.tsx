"use client";

import { VoiceOrb } from "./VoiceOrb";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${dark ? "bg-[#0d0d0d]" : "bg-white"}`}>
      <VoiceOrb theme={dark ? "dark" : "light"} />
    </div>
  );
}
