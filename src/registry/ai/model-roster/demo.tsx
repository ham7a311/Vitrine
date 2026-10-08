"use client";
import { ModelRoster, type RosterModel } from "./ModelRoster";

const MODELS: RosterModel[] = [
  { id: "grok-4-7", name: "Grok 4.7", maker: "xai", on: true },
  { id: "grok-4-6", name: "Grok 4.6", maker: "xai", on: true },
  { id: "composer-2-5", name: "Composer 2.5", maker: "cursor", on: true },
  { id: "opus-5-5", name: "Claude Opus 5.5", maker: "claude", on: true },
  { id: "gpt-5-6-sol", name: "GPT-5.6 Sol", maker: "openai", on: true },
  { id: "fable-5-1", name: "Claude Fable 5.1", maker: "claude", on: true },
  { id: "sonnet-5-5", name: "Claude Sonnet 5.5", maker: "claude", on: true },
  { id: "opus-5", name: "Claude Opus 5", maker: "claude", on: false },
  { id: "opus-4-8", name: "Claude Opus 4.8", maker: "claude", on: false },
  { id: "gpt-5-5", name: "GPT-5.5", maker: "openai", on: false },
];

const MORE: RosterModel[] = [
  { id: "grok-4-5", name: "Grok 4.5", maker: "xai", on: false },
  { id: "composer-2", name: "Composer 2", maker: "cursor", on: false },
  { id: "haiku-4-5", name: "Claude Haiku 4.5", maker: "claude", on: false },
  { id: "gpt-5-4-mini", name: "GPT-5.4 Mini", maker: "openai", on: false },
];

// A simulated refresh: the list is already current.
const refresh = () => new Promise<void>((r) => setTimeout(r, 650));

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  return (
    <div className={`flex min-h-full w-full items-start justify-center px-3 py-10 sm:py-16 ${light ? "bg-[#ededec]" : "bg-[#0c0c0c]"}`}>
      <ModelRoster models={MODELS} more={MORE} onRefresh={refresh} theme={light ? "light" : "dark"} />
    </div>
  );
}
