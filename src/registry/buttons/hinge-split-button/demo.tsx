"use client";

import { useState } from "react";
import { HingeSplitButton } from "./HingeSplitButton";

const OPTIONS = [
  { id: "prod", label: "Deploy to production", detail: "tryvitrine.dev · runs checks first" },
  { id: "staging", label: "Deploy to staging", detail: "staging.tryvitrine.dev · no approval needed" },
  { id: "schedule", label: "Schedule for 18:00", detail: "Goes out after the Muscat working day" },
  { id: "nocache", label: "Deploy without cache", detail: "Slower; rebuilds every dependency" },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  const [log, setLog] = useState("Commit 7f3c2a1 · Move search to edge runtime");
  return (
    <div className={`flex min-h-full w-full items-start justify-center px-6 pb-56 pt-16 ${paper ? "bg-[#f3f1ec]" : "bg-[#0b0a0d]"}`}>
      <div className="flex flex-col items-center gap-4">
        <HingeSplitButton
          theme={paper ? "paper" : "night"}
          options={OPTIONS}
          subject="vitrine-web"
          onAction={(id) => setLog(`${OPTIONS.find((o) => o.id === id)!.label.replace(/^Deploy/, "Deploying").replace(/^Schedule/, "Scheduled")} · vitrine-web @ 7f3c2a1`)}
        />
        <p className={`font-mono text-[0.75rem] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`} aria-live="polite">{log}</p>
      </div>
    </div>
  );
}
