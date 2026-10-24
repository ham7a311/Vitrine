"use client";
import type { ComponentType } from "react";
import ArcMarkExample from "./example-arc-mark";
import StormOrbExample from "./example-storm-orb";
import PhaseRingExample from "./example-phase-ring";
import CircuitTraceExample from "./example-circuit-trace";
import CoronaExample from "./example-corona";
import FilamentExample from "./example-filament";
import PulseChipExample from "./example-pulse-chip";

// Each version is its own implementation with its own example; the gallery preview switches between them.
const EXAMPLES: Record<string, ComponentType> = {
  "arc-mark": ArcMarkExample,
  "storm-orb": StormOrbExample,
  "phase-ring": PhaseRingExample,
  "circuit-trace": CircuitTraceExample,
  "corona": CoronaExample,
  "filament": FilamentExample,
  "pulse-chip": PulseChipExample,
};

export default function Demo({ variant = "arc-mark" }: { variant?: string }) {
  const Example = EXAMPLES[variant] ?? EXAMPLES["arc-mark"];
  return <Example />;
}
