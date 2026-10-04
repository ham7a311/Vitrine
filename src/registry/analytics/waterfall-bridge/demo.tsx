"use client";

import { WaterfallBridge, type Step } from "./WaterfallBridge";

const make = (rev: number, fees: number, staff: number, mkt: number, tech: number, other: number, tax: number): Step[] => {
  const steps: Step[] = [
    { label: "Revenue", value: rev, kind: "total" },
    { label: "Partner fees", value: -fees },
    { label: "Staff", value: -staff },
    { label: "Marketing", value: -mkt },
    { label: "Tech & hosting", value: -tech },
    { label: "Other income", value: other },
    { label: "Tax", value: -tax },
  ];
  const net = steps.slice(1).reduce((s, x) => s + x.value, rev);
  return [...steps, { label: "Net profit", value: net, kind: "total" }];
};
const PERIODS = {
  Q2: make(412000, 118000, 96000, 74000, 31000, 12000, 14800),
  Q3: make(468000, 131000, 99000, 52000, 34000, 18500, 22600),
};

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-10" style={{ background: dark ? "#0d0d0d" : "#f9f9f7" }}>
      <WaterfallBridge periods={PERIODS} title="Profit bridge · Vitrine Oman" theme={dark ? "dark" : "light"} />
    </div>
  );
}
