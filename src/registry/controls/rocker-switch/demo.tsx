"use client";

import { useState } from "react";
import { RockerSwitch } from "./RockerSwitch";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  const [mains, setMains] = useState(true);
  const [fan, setFan] = useState(false);
  const [lamp, setLamp] = useState(false);
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-10 ${paper ? "bg-[#d9d4c8] text-[#24221d]" : "bg-[#0e0f11] text-[#d9dadd]"}`}>
      <div className={`flex gap-8 rounded-[18px] px-9 py-7 ${paper ? "bg-[#c9c3b5] shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_20px_40px_-20px_rgb(0_0_0/0.4)]" : "bg-[#1a1b1e] shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_20px_40px_-20px_rgb(0_0_0/0.8)]"}`}>
        <RockerSwitch label="Mains" checked={mains} onChange={setMains} />
        <RockerSwitch label="Fan" checked={fan} onChange={setFan} led="#45d483" />
        <RockerSwitch label="Lamp" checked={lamp} onChange={setLamp} led="#ffc23d" />
      </div>
    </div>
  );
}
