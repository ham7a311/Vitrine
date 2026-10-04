"use client";

import { DotAtlas, type AtlasTheme } from "./DotAtlas";

const T: Record<string, AtlasTheme> = {
  night: { ground: "#0b0d12", text: "#eef1f6", muted: "#8b93a3", line: "rgb(238 241 246 / 0.14)", empty: "#2a2f3a", ramp: ["#1d3a66", "#245592", "#2f6fbc", "#3987e5", "#6aa6ee", "#a6cbf6"] },
  paper: { ground: "#f6f3ec", text: "#16181d", muted: "#6b6760", line: "rgb(22 24 29 / 0.14)", empty: "#ddd8cc", ramp: ["#c6dcf6", "#9ac1ef", "#6aa2e6", "#3d84dc", "#2a6bc0", "#1d4f95"] },
};

export default function Demo({ variant = "night" }: { variant?: string }) {
  const t = T[variant] ?? T.night;
  return <DotAtlas theme={t} className="min-h-full" style={{ ["--da-tip" as string]: t.ground }} />;
}
