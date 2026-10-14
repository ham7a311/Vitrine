"use client";
import { BlueHour, type BlueHourPalette } from "./BlueHour";

const P: Record<string, BlueHourPalette> = {
  cobalt: { sky: "#02040f", band: "#0b2399", glow: "#2f5bff", floor: "#eef2ff" },
  ultraviolet: { sky: "#06020f", band: "#3a0f99", glow: "#8a4dff", floor: "#f5efff" },
  sunrise: { sky: "#0f0503", band: "#8a2a0c", glow: "#f0703a", floor: "#fff3e4" },
};

export default function Demo({ variant = "cobalt" }: { variant?: string }) {
  return <BlueHour palette={P[variant] ?? P.cobalt} className="h-full min-h-full w-full" />;
}
