"use client";

import { useState } from "react";
import { PerimeterHoldButton } from "./PerimeterHoldButton";

export default function Demo() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-5 bg-[#0b080d] p-10">
      <PerimeterHoldButton onConfirm={() => setCount((c) => c + 1)} />
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
        Press and hold · confirmed {count}×
      </p>
    </div>
  );
}
