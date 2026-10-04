"use client";
import { DuneField } from "./DuneField";
export default function Demo({ variant = "golden" }: { variant?: string }) {
  const v = variant === "dusk" ? { sky: ["#3a2a5c", "#f2a68a"] as [string, string], sand: ["#c9704f", "#1c1027"] as [string, string] } : variant === "bone" ? { sky: ["#dfe6ea", "#f6f1e6"] as [string, string], sand: ["#e7dcc4", "#8a7f6a"] as [string, string] } : {};
  return <div className="h-full min-h-[24rem] w-full"><DuneField {...v} /></div>;
}
