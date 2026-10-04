"use client";

import { LightboxCompare } from "./LightboxCompare";

const PLANS = [
  { id: "free", name: "Hobby", price: "$0", note: "For trying it out" },
  { id: "solo", name: "Solo", price: "$9", note: "per month" },
  { id: "team", name: "Team", price: "$24", note: "per month, 3 seats" },
  { id: "business", name: "Business", price: "$79", note: "per month, 10 seats" },
];

const GROUPS = [
  {
    name: "Build",
    rows: [
      { feature: "Projects", values: ["1", "3", "Unlimited", "Unlimited"] },
      { feature: "Preview deploys", hint: "One URL per branch", values: [true, true, true, true] },
      { feature: "Build minutes", values: ["100", "1,000", "6,000", "25,000"] },
      { feature: "Custom domains", values: [false, true, true, true] },
    ],
  },
  {
    name: "Collaborate",
    rows: [
      { feature: "Seats", values: ["1", "1", "3", "10"] },
      { feature: "Comments on previews", values: [false, false, true, true] },
      { feature: "Required approvals", hint: "Before production deploys", values: [false, false, true, true] },
    ],
  },
  {
    name: "Operate",
    rows: [
      { feature: "Audit log", values: [false, false, "30 days", "1 year"] },
      { feature: "Single sign-on", values: [false, false, false, true] },
      { feature: "Support", values: ["Community", "Email", "Email, 1 day", "Named engineer"] },
    ],
  },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-start justify-center p-4 sm:p-10 ${night ? "bg-[#0b0a0d]" : "bg-[#f4f2ed]"}`}>
      <div className="w-full max-w-4xl">
        <LightboxCompare plans={PLANS} groups={GROUPS} defaultPlan="team" theme={night ? "night" : "paper"} />
      </div>
    </div>
  );
}
