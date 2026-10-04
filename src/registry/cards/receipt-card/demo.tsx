"use client";

import { ReceiptCard } from "./ReceiptCard";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-start justify-center bg-[#0b080d] px-8 pb-10 pt-12">
      <ReceiptCard
        plan="Studio"
        price="$24"
        cadence="per seat / month"
        blurb="For small teams shipping every week."
        reference="Nº 000417"
        lines={[
          { item: "Unlimited projects", value: "INCL" },
          { item: "Shared component library", value: "INCL" },
          { item: "Review workflows", value: "INCL" },
          { item: "Version history · 90 days", value: "INCL" },
          { item: "Priority support", value: "INCL" },
        ]}
        total={{ label: "TOTAL / SEAT", value: "$24.00" }}
        cta={{ label: "Start with Studio", href: "#studio" }}
      />
    </div>
  );
}
