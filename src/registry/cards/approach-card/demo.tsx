"use client";

import { ApproachCard } from "./ApproachCard";

export default function Demo({ variant = "pair" }: { variant?: string }) {
  const masar = (
    <ApproachCard
      index="01" year="2025" title="Masar"
      summary="A trip planner for Oman that turns scattered bookings into one calm itinerary."
      stack={["Next.js", "Maps", "PostgreSQL"]}
      accent="#b9cce4"
    />
  );
  if (variant === "single")
    return <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-10">{masar}</div>;
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-6 bg-[#0b080d] p-10">
      {masar}
      <ApproachCard
        index="02" year="2024" title="Wally"
        summary="A shared wallet for households — split, settle and see where the month went."
        stack={["React Native", "Node", "Stripe"]}
        accent="#e8a24a"
      />
    </div>
  );
}
