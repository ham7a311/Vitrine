"use client";

import { DitherPortrait } from "./DitherPortrait";

const INKS: Record<string, { ink: string; paper: string }> = {
  ink: { ink: "#1b1a17", paper: "#efe9dc" },
  phosphor: { ink: "#8fe388", paper: "#07100a" },
  violet: { ink: "#c9b6ff", paper: "#140c2b" },
};

export default function Demo({ variant = "ink" }: { variant?: string }) {
  const c = INKS[variant] ?? INKS.ink;
  return <DitherPortrait {...c} className="h-full min-h-full" />;
}
