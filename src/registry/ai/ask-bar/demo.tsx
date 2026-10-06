"use client";
import { AskBar, type AskModel } from "./AskBar";

const MODELS: AskModel[] = [
  { id: "swift", name: "Swift", detail: "Quick answers for everyday questions" },
  { id: "deep", name: "Deep", detail: "Slower, thinks through harder problems" },
  { id: "scholar", name: "Scholar", detail: "Reads widely and cites its sources" },
];

// A fictional assistant: canned replies so the demo works offline.
function respond(prompt: string, model: AskModel) {
  const p = prompt.toLowerCase();
  if (p.includes("muscat") || p.includes("weekend")) return "Here's a gentle weekend in Muscat:\n\nSaturday morning, walk the Mutrah corniche before the heat, then the souq for frankincense. Lunch by the water, a rest, and a dhow out at sunset.\n\nSunday, an early drive to Wadi Shab, the swim to the hidden cave, and back for dinner in Qurum.";
  if (model.id === "deep") return `Let's take this step by step.\n\nFirst, what you're really asking: "${prompt}". Then the parts we know, the parts we can check, and the one decision that matters most. Tell me which you'd like to start with.`;
  if (model.id === "scholar") return `A careful answer would draw on a few good sources. On "${prompt}", I'd start with the most recent overview, compare two primary accounts, and note where they disagree, with each claim linked so you can check it.`;
  return `Good question. In short: start small, write down what you learn, and check it against one real example. Want me to go deeper on "${prompt}"?`;
}

export default function Demo({ variant = "dark" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full">
      <AskBar
        className="w-full"
        greeting="What shall we look into today?"
        placeholder="Ask Qalam"
        models={MODELS}
        respond={respond}
        theme={variant === "light" ? "light" : "dark"}
      />
    </div>
  );
}
