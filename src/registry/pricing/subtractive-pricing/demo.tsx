"use client";

import { SubtractivePricing, type Feature } from "./SubtractivePricing";

const TIERS = [
  { id: "studio", name: "Studio", price: 96, blurb: "For agencies and larger teams" },
  { id: "team", name: "Team", price: 32, blurb: "Up to 12 people" },
  { id: "solo", name: "Solo", price: 12, blurb: "One person, every project" },
  { id: "free", name: "Free", price: 0, blurb: "To try things out" },
];
// tier = how many steps down from the top it survives (0 = Studio only, 3 = everyone)
const F: Feature[] = [
  { group: "Build", label: "Unlimited projects", tier: 2 },
  { group: "Build", label: "Custom domains", tier: 2 },
  { group: "Build", label: "Preview deployments", tier: 3 },
  { group: "Build", label: "Edge functions", tier: 1 },
  { group: "Build", label: "Scheduled jobs", tier: 1 },
  { group: "Build", label: "Build minutes · 6,000", tier: 0 },
  { group: "Collaborate", label: "Comments on previews", tier: 3 },
  { group: "Collaborate", label: "Shared environments", tier: 1 },
  { group: "Collaborate", label: "Roles & permissions", tier: 1 },
  { group: "Collaborate", label: "Client workspaces", tier: 0 },
  { group: "Operate", label: "Analytics", tier: 2 },
  { group: "Operate", label: "Audit log", tier: 0 },
  { group: "Operate", label: "SSO & SCIM", tier: 0 },
  { group: "Operate", label: "Priority support", tier: 1 },
];

export default function Demo({ variant = "frost" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-8">
      <SubtractivePricing tiers={TIERS} features={F} initial={1} accent={variant === "amber" ? "#e8a24a" : "#b9cce4"} />
    </div>
  );
}
