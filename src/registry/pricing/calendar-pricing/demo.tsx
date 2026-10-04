"use client";

import { CalendarPricing } from "./CalendarPricing";

const PLANS = [
  { id: "solo", name: "Solo", monthly: 9, blurb: "For one person shipping side projects and client work.", features: ["3 projects", "Preview deploys for every branch", "Custom domains with HTTPS", "Email support, replies within a day"] },
  { id: "team", name: "Team", monthly: 24, blurb: "For a small team that deploys several times a day.", features: ["Unlimited projects", "Up to 10 seats, then $4 a seat", "Required approvals for production", "Audit log kept for a year"] },
  { id: "business", name: "Business", monthly: 79, blurb: "For companies that need controls, contracts and a named contact.", features: ["Single sign-on and SCIM", "Deploy windows and freeze periods", "99.95% uptime in the contract", "A named engineer in your time zone"] },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-4 sm:p-10 ${night ? "bg-[#0b0a0d]" : "bg-[#efece5]"}`}>
      <CalendarPricing plans={PLANS} defaultPlan="team" theme={night ? "night" : "paper"} />
    </div>
  );
}
