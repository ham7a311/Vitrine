"use client";

import type { CSSProperties } from "react";
import { MagneticButton } from "./MagneticButton";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const night = variant !== "paper";
  const solid = (night ? { "--bg": "#f1efe9", "--fg": "#111111" } : { "--bg": "#111111", "--fg": "#ffffff" }) as CSSProperties;
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-5 p-10" style={{ background: night ? "#0d0d0f" : "#f1efe9", color: night ? "#f1efe9" : "#111111" }}>
      <MagneticButton style={solid}>Start a project</MagneticButton>
      <MagneticButton className="mgb--ghost">See the work</MagneticButton>
    </div>
  );
}
