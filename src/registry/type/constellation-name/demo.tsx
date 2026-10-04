"use client";
import { ConstellationName } from "./ConstellationName";
export default function Demo({ variant = "ice" }: { variant?: string }) {
  const v = variant === "ember" ? { c: "#ffc28a", bg: "#0e0906" } : variant === "mint" ? { c: "#a6f0cf", bg: "#050c09" } : { c: "#cfe0ff", bg: "#05070d" };
  return <div className="h-full min-h-[22rem] w-full" style={{ background: v.bg }}><ConstellationName text="Hamza" color={v.c} /></div>;
}
