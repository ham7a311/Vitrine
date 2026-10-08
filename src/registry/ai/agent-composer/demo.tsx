"use client";
import { AgentComposer } from "./AgentComposer";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  return (
    <div className={`flex min-h-full w-full items-end justify-center px-4 pb-[18vh] pt-40 sm:px-8 ${light ? "bg-[#f3f3f2]" : "bg-[#0d0d0d]"}`}>
      <AgentComposer
        theme={light ? "light" : "dark"}
        defaultMode="agent"
        defaultModel="opus"
        defaultEffort={2}
        defaultFiles={["exporter/invoice-export.ts", "exporter/retry.ts", "logs/export-friday.log"]}
      />
    </div>
  );
}
