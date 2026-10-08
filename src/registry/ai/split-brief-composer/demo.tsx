"use client";
import { SplitBriefComposer } from "./SplitBriefComposer";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-3 py-10 sm:px-8 ${light ? "bg-[#ececea]" : "bg-[#0a0a0a]"}`}>
      <SplitBriefComposer
        theme={light ? "light" : "dark"}
        defaultText="Exports time out on Fridays. Find out why, then make the exporter retry with backoff — carefully, the CSV has to stay byte-identical."
      />
    </div>
  );
}
