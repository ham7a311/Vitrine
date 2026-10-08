"use client";
import { AgentReceipt } from "./AgentReceipt";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 sm:px-10 ${light ? "bg-[#ecebe8]" : "bg-[#0c0c0c]"}`}>
      <AgentReceipt
        theme={light ? "light" : "dark"}
        defaultText="Exports time out on Fridays. Find out why and make the exporter retry with backoff — carefully, the CSV has to stay byte-identical."
      />
    </div>
  );
}
