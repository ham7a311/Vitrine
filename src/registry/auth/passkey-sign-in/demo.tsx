"use client";

import { useRef } from "react";
import { PasskeySignIn } from "./PasskeySignIn";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const tries = useRef(0);
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-6 p-8 ${paper ? "bg-[#f3eee4]" : "bg-[#0b080d]"}`}>
      <PasskeySignIn verify={() => new Promise((resolve) => setTimeout(() => resolve(++tries.current > 1), 1200))} onSendLink={() => new Promise((resolve) => setTimeout(resolve, 700))} welcomeName="Hamza" theme={paper ? "paper" : "night"} />
      <p className={`font-[family-name:Geist_Mono] text-[0.625rem] uppercase tracking-[0.14em] ${paper ? "text-[#a39b8f]" : "text-[#6f6a74]"}`}>demo · the first attempt fails</p>
    </div>
  );
}
