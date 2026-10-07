"use client";

import { CallPill } from "./CallPill";

export default function Demo({ variant = "dot" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b2351] px-4 py-12">
      <CallPill mark={variant === "phone" ? "phone" : "dot"} className="max-w-full" />
    </div>
  );
}
