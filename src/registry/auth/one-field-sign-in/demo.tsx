"use client";

import { OneFieldSignIn } from "./OneFieldSignIn";

const sendCode = async () => { await new Promise((resolve) => setTimeout(resolve, 700)); };
const verify = async (code: string) => { await sendCode(); return code !== "000000"; };

export default function Demo({ variant = "night" }: { variant?: string }) {
  if (variant === "paper")
    return (
      <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 bg-[#f3eee4] p-8">
        <OneFieldSignIn sendCode={sendCode} verify={verify} theme="paper" accent="#c4673f" title="Sign in to Vitrine" />
        <p className="text-xs text-[#645d54]">Demo · no email is sent · any code except 000000</p>
      </div>
    );
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 bg-[#0b080d] p-8">
      <OneFieldSignIn sendCode={sendCode} verify={verify} />
      <p className="font-[family-name:Geist_Mono] text-[0.625rem] uppercase tracking-[0.14em] text-[#6f6a74]">demo · no email is sent · any code except 000000</p>
    </div>
  );
}
