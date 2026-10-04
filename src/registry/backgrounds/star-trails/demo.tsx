"use client";
import { StarTrails } from "./StarTrails";
export default function Demo({ variant = "blue" }: { variant?: string }) {
  const h = variant === "amber" ? 35 : variant === "violet" ? 285 : 215;
  return <div className="h-full min-h-[24rem] w-full"><StarTrails hue={h} /></div>;
}
