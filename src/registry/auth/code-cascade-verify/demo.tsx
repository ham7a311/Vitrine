"use client";

import { CodeCascadeVerify } from "./CodeCascadeVerify";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-6 px-4 py-10 ${paper ? "bg-[#f3f1ec]" : "bg-[#0b0a0d]"}`}>
      <CodeCascadeVerify verify={(code) => new Promise((resolve) => setTimeout(() => resolve(code === "246810"), 700))} onResend={() => new Promise((resolve) => setTimeout(resolve, 500))} theme={paper ? "paper" : "night"} sentTo="h•••@tryvitrine.dev" />
      <p className={`font-mono text-[10px] uppercase tracking-[0.14em] ${paper ? "text-[#a39b8f]" : "text-[#6f6a74]"}`}>demo · the code is 246810</p>
    </div>
  );
}
