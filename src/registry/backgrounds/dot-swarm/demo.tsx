"use client";

import { DotSwarm } from "./DotSwarm";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return <DotSwarm dot={paper ? "#161412" : "#f2efe9"} ground={paper ? "#efe9dc" : "#0b0b0c"} className="h-full min-h-full" />;
}
