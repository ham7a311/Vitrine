"use client";

import { TicketCard } from "./TicketCard";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-8 [container-type:inline-size]">
      <TicketCard
        event="Northstar Build Summit"
        venue="Harbour Hall · Level 2 · Main Stage"
        date="Sat 24 Oct"
        time="09:00"
        seat={[
          { label: "Row", value: "C" },
          { label: "Seat", value: "14" },
          { label: "Gate", value: "2" },
        ]}
        code="NS-24-0417-C14"
      />
    </div>
  );
}
