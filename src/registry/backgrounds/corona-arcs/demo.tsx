"use client";
import { CoronaArcs, type CoronaArcsPalette } from "./CoronaArcs";

const P: Record<string, CoronaArcsPalette> = {
  crimson: { bg: "#0e0204", deep: "#5a0b1b", mid: "#d6324b", hot: "#ffb4a2" },
  amber: { bg: "#0d0602", deep: "#5a2407", mid: "#e6812b", hot: "#ffe1b2" },
  iris: { bg: "#05030f", deep: "#261062", mid: "#6b4ef0", hot: "#d8ceff" },
};

export default function Demo({ variant = "crimson" }: { variant?: string }) {
  return <CoronaArcs palette={P[variant] ?? P.crimson} className="h-full min-h-full w-full" />;
}
