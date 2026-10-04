"use client";

import { BoardingPassSignIn } from "./BoardingPassSignIn";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center overflow-hidden px-4 py-12 ${night ? "bg-[#0d0e10]" : "bg-[#ece7dd]"}`}>
      <BoardingPassSignIn theme={night ? "night" : "paper"} product="Vitrine" />
    </div>
  );
}
