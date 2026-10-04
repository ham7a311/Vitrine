"use client";

import { UsageRuler } from "./UsageRuler";

const TIERS = [
  { name: "Starter", upTo: 5, perSeat: 12, note: "For a person or a pair — everything you need to ship." },
  { name: "Team", upTo: 50, perSeat: 10, note: "Shared environments, roles and review workflows." },
  { name: "Scale", upTo: 200, perSeat: 8, note: "Audit log, SSO, priority support and usage controls." },
  { name: "Enterprise", upTo: 500, perSeat: 6, note: "Dedicated regions, SLAs and a named engineer." },
];

export default function Demo({ variant = "frost" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-8">
      <UsageRuler tiers={TIERS} accent={variant === "amber" ? "#e8a24a" : "#b9cce4"} />
    </div>
  );
}
