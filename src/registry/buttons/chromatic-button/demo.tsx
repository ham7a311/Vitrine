"use client";

import { ChromaticButton } from "./ChromaticButton";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-5 bg-[#020403] p-10">
      <ChromaticButton label="Run diagnostics" />
      <ChromaticButton label="Deploy" />
    </div>
  );
}
