"use client";

import { ChalkMenuPricing, type MenuPlan } from "./ChalkMenuPricing";

const PLANS: MenuPlan[] = [
  { name: "Solo", blurb: "for one person and a good idea", monthly: 4, yearly: 3.2, items: ["3 projects", "Shared links", "Email help"] },
  { name: "Studio", blurb: "for small teams who ship together", monthly: 15, yearly: 12, items: ["Up to 8 people", "Unlimited projects", "Comments & review"], pick: true },
  { name: "Firm", blurb: "for the whole company, every client", monthly: 39, yearly: 31.2, items: ["Unlimited people", "SSO & audit log", "A person in Muscat"] },
];

export default function Demo({ variant = "chalk" }: { variant?: string }) {
  const white = variant === "whiteboard";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${white ? "bg-[#e9e6df]" : "bg-[#2b2520]"}`}>
      <ChalkMenuPricing theme={white ? "whiteboard" : "chalk"} plans={PLANS} title="Vitrine" subtitle="Plans · served daily" />
    </div>
  );
}
