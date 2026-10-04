"use client";

import { ColourCamera, InsideCamera, type InsideStyle } from "./CameraArt";
import { ImageCompare } from "./ImageCompare";

const LOOK: Record<InsideStyle, { label: string; accent: string; bg: string }> = {
  xray: { label: "X-ray", accent: "#e8f4ff", bg: "#0b0f17" },
  night: { label: "Night vision", accent: "#c6ffb8", bg: "#070b07" },
  blueprint: { label: "Blueprint", accent: "#ffffff", bg: "#0c1f3d" },
};

export default function Demo({ variant = "xray" }: { variant?: string }) {
  const style = (variant in LOOK ? variant : "xray") as InsideStyle;
  const l = LOOK[style];
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-5 px-4 py-10" style={{ background: l.bg }}>
      <div className="w-full max-w-3xl">
        <ImageCompare before={<InsideCamera style={style} />} after={<ColourCamera />} beforeLabel={l.label} afterLabel="Colour" accent={l.accent} label="The VTR-1 camera, inside and out" />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">VTR-1 · drag the line, or focus the knob and use the arrow keys</p>
    </div>
  );
}
