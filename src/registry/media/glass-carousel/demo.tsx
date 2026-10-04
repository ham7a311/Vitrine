"use client";

import { GlassCarousel } from "./GlassCarousel";

export default function Demo({ variant = "white" }: { variant?: string }) {
  return <GlassCarousel theme={variant === "night" ? "night" : "white"} className="h-full min-h-full" />;
}
