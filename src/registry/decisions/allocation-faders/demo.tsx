"use client";
import { AllocationFaders } from "./AllocationFaders";

const BUDGET = [
  { id: "hiring", label: "Hiring", value: 192_000 },
  { id: "marketing", label: "Marketing", value: 96_000 },
  { id: "infra", label: "Infrastructure", value: 72_000 },
  { id: "research", label: "Research", value: 72_000 },
  { id: "events", label: "Events", value: 48_000 },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${dark ? "bg-[#0e0f10]" : "bg-[#d9d3c7]"}`}>
      <div className="w-full max-w-[56rem]">
        <AllocationFaders
          title="Masar · Q1 budget"
          channels={BUDGET}
          total={480_000}
          step={1_000}
          format="currency"
          locale="en-US"
          locked={["infra"]}
          theme={dark ? "dark" : "light"}
        />
      </div>
    </div>
  );
}
