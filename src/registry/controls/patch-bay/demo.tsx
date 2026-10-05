"use client";
import { PatchBay, type Input, type Jack } from "./PatchBay";

const OUTPUTS: Jack[] = [
  { id: "form", name: "Signup form", type: "JSON" },
  { id: "cam", name: "Studio camera", type: "video" },
  { id: "mic", name: "Desk mic", type: "audio" },
  { id: "sensor", name: "Humidity sensor", type: "number" },
  { id: "docs", name: "Docs export", type: "text" },
];
const INPUTS: Input[] = [
  { id: "hook", name: "Webhook", accepts: ["JSON"] },
  { id: "rec", name: "Recorder", accepts: ["video", "audio"] },
  { id: "chart", name: "Dashboard chart", accepts: ["number"] },
  { id: "index", name: "Search index", accepts: ["text", "JSON"] },
  { id: "spk", name: "Speakers", accepts: ["audio"] },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#0b0b0a]" : "bg-[#dedcd5]"}`}>
      <div className="mx-auto w-full max-w-[46rem]">
        <PatchBay
          title="Masar studio routing"
          outputs={OUTPUTS}
          inputs={INPUTS}
          defaultCables={[{ from: "form", to: "hook" }, { from: "cam", to: "rec" }, { from: "sensor", to: "chart" }]}
          theme={dark ? "dark" : "light"}
        />
      </div>
    </div>
  );
}
