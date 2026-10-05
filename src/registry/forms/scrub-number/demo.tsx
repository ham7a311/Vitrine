"use client";
import { useState } from "react";
import { ScrubGroup, ScrubNumber } from "./ScrubNumber";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const [f, setF] = useState({ x: 120, y: 64, w: 240, h: 150, r: 12, rot: -6, o: 90 });
  const set = (k: keyof typeof f) => (v: number) => setF((s) => ({ ...s, [k]: v }));
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${dark ? "bg-[#121214]" : "bg-[#e9e9e6]"}`}>
      <div className="grid w-full max-w-[52rem] items-start gap-5 md:grid-cols-[minmax(0,1fr)_17rem]">
        <div className={`relative h-[360px] overflow-hidden rounded-xl border ${dark ? "border-white/10 bg-[#19191b]" : "border-black/10 bg-[#f7f7f5]"}`}
          style={{ backgroundImage: `radial-gradient(${dark ? "rgb(255 255 255 / .08)" : "rgb(0 0 0 / .08)"} 1px, transparent 1px)`, backgroundSize: "16px 16px" }}>
          <div
            className="absolute flex items-end p-3 text-[12px] font-semibold text-white"
            style={{ left: f.x, top: f.y, width: f.w, height: f.h, borderRadius: f.r, opacity: f.o / 100, transform: `rotate(${f.rot}deg)`, background: dark ? "#3d6fd8" : "#2f5fd0" }}
          >
            Masar · Field notes
          </div>
        </div>
        <ScrubGroup title="Frame" theme={dark ? "dark" : "light"}>
          <ScrubNumber label="X position" short="X" value={f.x} onChange={set("x")} min={-200} max={600} />
          <ScrubNumber label="Y position" short="Y" value={f.y} onChange={set("y")} min={-200} max={400} />
          <ScrubNumber label="Width" short="W" value={f.w} onChange={set("w")} min={8} max={600} />
          <ScrubNumber label="Height" short="H" value={f.h} onChange={set("h")} min={8} max={400} />
          <ScrubNumber label="Rotation" short="↻" value={f.rot} onChange={set("rot")} min={-180} max={180} unit="°" />
          <ScrubNumber label="Corner radius" short="◜" value={f.r} onChange={set("r")} min={0} max={120} />
          <ScrubNumber label="Opacity" short="◐" value={f.o} onChange={set("o")} min={0} max={100} unit="%" />
        </ScrubGroup>
      </div>
    </div>
  );
}
