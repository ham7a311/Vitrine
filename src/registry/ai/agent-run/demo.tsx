"use client";

import { AgentRun, type AgentStep } from "./AgentRun";

const STEPS: AgentStep[] = [
  { kind: "think", label: "Planning", ms: 900 },
  { kind: "search", label: "Searched for", target: "useBillingCycle", meta: "4 results", ms: 1100 },
  { kind: "read", label: "Read", target: "src/lib/pricing.ts", ms: 800 },
  {
    kind: "edit",
    label: "Edited",
    target: "src/lib/pricing.ts",
    meta: "+6 −1",
    ms: 1500,
    detail: (
      <pre>
        <span className="del">-  if (cycle === "yearly") return base * 12 * 0.8;</span>
        {"\n"}
        <span className="add">+  const discount = PLANS[plan].yearlyDiscount ?? 0.2;</span>
        {"\n"}
        <span className="add">+  return Math.round(base * 12 * (1 - discount));</span>
      </pre>
    ),
  },
  { kind: "edit", label: "Edited", target: "src/data/plans.ts", meta: "+3 −0", ms: 1000 },
  {
    kind: "run",
    label: "Ran",
    target: "npm test -- pricing",
    meta: "12 passed",
    ms: 1900,
    detail: (
      <pre>
        {"PASS  src/lib/pricing.test.ts\n  ✓ monthly price (3 ms)\n  ✓ yearly uses per-plan discount (2 ms)\n  ✓ falls back to 20% (1 ms)\n\n"}
        <span className="ok">Tests: 12 passed, 12 total</span>
      </pre>
    ),
  },
];

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0a0a0a] p-8">
      <AgentRun
        task="Make the yearly discount configurable per plan"
        steps={STEPS}
        summary="Yearly pricing now reads a per-plan discount (defaulting to 20%). Updated pricing.ts and plans.ts, added two tests — all 12 pass."
      />
    </div>
  );
}
