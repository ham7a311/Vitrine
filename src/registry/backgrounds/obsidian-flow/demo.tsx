"use client";
import { ObsidianFlow } from "./ObsidianFlow";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  return <ObsidianFlow className="h-full min-h-full w-full" theme={variant === "light" ? "light" : "dark"} />;
}
