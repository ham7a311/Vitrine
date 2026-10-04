"use client";

import { useState } from "react";
import { Keycap } from "./Keycap";

export default function Demo() {
  const [log, setLog] = useState("Press ⌘K, ⌘↵ or Esc on your keyboard");
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 bg-[#0b080d] p-8">
      <div className="flex flex-wrap items-end justify-center gap-3">
        <Keycap keys={["⌘", "K"]} label="Search" wide match={{ key: "k", meta: true }} onPress={() => setLog("Search opened")} />
        <Keycap keys={["⌘", "↵"]} label="Send" wide tone="accent" match={{ key: "Enter", meta: true }} onPress={() => setLog("Message sent")} />
        <Keycap keys={["esc"]} tone="bone" match={{ key: "Escape" }} onPress={() => setLog("Dismissed")} />
      </div>
      <p className="h-4 font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.14em] text-[#6f6a74]" aria-live="polite">{log}</p>
    </div>
  );
}
