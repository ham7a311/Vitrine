"use client";

import { PunchCheck, PunchTicket } from "./PunchCheck";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className="flex min-h-full w-full items-center justify-center p-8" style={{ background: paper ? "#e2dccf" : "#1c1a17" }}>
      <PunchTicket title="Muttrah ferry · add-ons" code="WY 0412" hole={paper ? "#e2dccf" : "#1c1a17"}>
        <PunchCheck hint="+ OMR 2.500" defaultChecked>
          Upper deck seat
        </PunchCheck>
        <PunchCheck hint="+ OMR 1.200">Karak tea and luqaimat</PunchCheck>
        <PunchCheck hint="+ OMR 4.000">Snorkel stop at Fahal</PunchCheck>
        <PunchCheck hint="Free">Return before sunset</PunchCheck>
      </PunchTicket>
    </div>
  );
}
