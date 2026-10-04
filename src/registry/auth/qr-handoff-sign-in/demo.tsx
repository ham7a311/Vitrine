"use client";

import { QrHandoffSignIn } from "./QrHandoffSignIn";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${paper ? "bg-[#f3f1ec]" : "bg-[#0b0a0d]"}`}>
      <QrHandoffSignIn theme={paper ? "paper" : "night"} product="Vitrine" device="Hamza's iPhone" demo />
    </div>
  );
}
