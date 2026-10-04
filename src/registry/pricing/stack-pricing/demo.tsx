"use client";

import { StackPricing } from "./StackPricing";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${night ? "bg-[#111110]" : "bg-[#ece8e0]"}`}>
      <StackPricing
        theme={night ? "night" : "paper"}
        base={{ name: "Vitrine Core", note: "Listings, bookings, calendar", price: 9 }}
        addons={[
          { id: "sync", name: "Channel sync", note: "Airbnb, Booking.com, Expedia", price: 4 },
          { id: "team", name: "Team seats", note: "Three more people", price: 6 },
          { id: "pay", name: "Payments", note: "Cards, OmanNet, split bills", price: 5 },
          { id: "stats", name: "Insights", note: "Occupancy and revenue reports", price: 3 },
          { id: "help", name: "Priority support", note: "A person in Muscat, 7am–11pm", price: 7 },
        ]}
        initial={["sync", "pay"]}
      />
    </div>
  );
}
