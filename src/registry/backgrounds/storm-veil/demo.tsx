"use client";
import { StormVeil, type StormVeilPalette } from "./StormVeil";

const P: Record<string, StormVeilPalette> = {
  midnight: { void: "#010209", body: "#323e62", light: "#a3b4dd", cover: 0.29 },
  overcast: { void: "#0f2240", body: "#557ba3", light: "#cfe2f5", cover: 0.21 },
  ash: { void: "#0a0a0b", body: "#625d58", light: "#ece6dc", cover: 0.3 },
};

export default function Demo({ variant = "midnight" }: { variant?: string }) {
  return <StormVeil palette={P[variant] ?? P.midnight} className="h-full min-h-full w-full" />;
}
