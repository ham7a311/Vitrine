"use client";

import { ModelPicker } from "./ModelPicker";

const MODELS = [
  { id: "swift", name: "Swift", note: "Quick answers and everyday edits", speed: 5, depth: 2 },
  { id: "vitrine", name: "Vitrine", note: "The balanced default", speed: 4, depth: 4, badge: "Default" },
  { id: "meridian", name: "Meridian", note: "Long documents, careful reasoning", speed: 2, depth: 5 },
  { id: "sketch", name: "Sketch", note: "Drafts, ideas, playful tone", speed: 4, depth: 3, badge: "Beta" },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-start justify-center p-8 pt-[18%] ${night ? "bg-[#0f0e10]" : "bg-[#f5f1e8]"}`}>
      <ModelPicker models={MODELS} value="vitrine" theme={night ? "night" : "paper"} />
    </div>
  );
}
