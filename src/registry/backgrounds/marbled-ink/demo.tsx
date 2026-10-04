"use client";
import { MarbledInk } from "./MarbledInk";
const P: Record<string, [string, string, string, string]> = {
  endpaper: ["#0f2a3a", "#e8dcc0", "#b3392b", "#f5efe0"],
  oxblood: ["#2a0d10", "#e9d3b4", "#c58a2e", "#f2e6cf"],
  celadon: ["#123a34", "#efe9d6", "#4fa38f", "#f8f3e4"],
};
export default function Demo({ variant = "endpaper" }: { variant?: string }) {
  return <div className="h-full min-h-[24rem] w-full"><MarbledInk colors={P[variant] ?? P.endpaper} /></div>;
}
