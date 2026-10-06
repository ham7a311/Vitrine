"use client";
import { DonutChart } from "./DonutChart";

const SLICES = [
  { name: "Search", value: 18400 },
  { name: "Social", value: 12750 },
  { name: "Email", value: 7200 },
  { name: "Events", value: 5300 },
  { name: "Partners", value: 3150 },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`dnut-demo dnut-demo--${theme}`}>
      <DonutChart title="Marketing spend by channel, Q3" slices={SLICES} totalLabel="Total spend" format={(n) => `OMR ${n.toLocaleString("en-US")}`} theme={theme} />
    </div>
  );
}
