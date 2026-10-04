"use client";
import { MoireVeil } from "./MoireVeil";
export default function Demo({ variant = "bone" }: { variant?: string }) {
  const v = variant === "cyan" ? { ink: "#7fe0ff", paper: "#04111a", pitch: 6 } : variant === "rose" ? { ink: "#ffb3cf", paper: "#160810", pitch: 8 } : { ink: "#e8e4d8", paper: "#0c0d10", pitch: 7 };
  return <div className="h-full min-h-[24rem] w-full"><MoireVeil {...v}><p className="font-[family-name:Instrument_Serif] text-5xl italic text-white mix-blend-difference">Interference</p></MoireVeil></div>;
}
