"use client";

import { useState } from "react";
import { RingFloodCard, type Plan } from "./RingFloodCard";

const PLANS: Plan[] = [
  { id: "day", name: "Day pass", price: "OMR 6", per: "a day", blurb: "Drop in when you need a desk away from home.", features: ["Any open desk, 8am – 8pm", "Coffee and karak on the house", "Fibre Wi-Fi and printing"] },
  { id: "flex", name: "Flex", price: "OMR 45", per: "a month", badge: "Most chosen", blurb: "Twelve days a month, booked from the app.", features: ["12 days, any open desk", "4 hours of meeting rooms", "Lockers and a mail address"] },
  { id: "fixed", name: "Fixed desk", price: "OMR 85", per: "a month", blurb: "Your own desk by the window, kept as you left it.", features: ["Your desk, 24/7 access", "10 hours of meeting rooms", "Guest passes for clients"] },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  const [plan, setPlan] = useState("flex");
  const chosen = PLANS.find((p) => p.id === plan)!;
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 sm:px-10 ${paper ? "bg-[#f3f1ec] text-[#1b1a17]" : "bg-[#0b0a0d] text-[#efe8dc]"}`}>
      <div className="w-full max-w-[52rem]">
        <p className={`mb-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>Majlis Coworking · Al Khuwair</p>
        <h2 className="mb-7 text-[1.625rem] font-semibold tracking-[-0.02em]">How often will you come in?</h2>
        <RingFloodCard plans={PLANS} value={plan} onChange={setPlan} label="Membership" theme={paper ? "paper" : "night"} />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className={`text-[0.875rem] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`} aria-live="polite">
            {chosen.name} · {chosen.price} {chosen.per} · first week free
          </p>
          <button type="button" className={`h-11 rounded-full px-5 text-[0.875rem] font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 ${paper ? "bg-[#1b1a17] text-[#fffdf8] focus-visible:outline-[#2f5fd0]" : "bg-[#efe8dc] text-[#141216] focus-visible:outline-[#efe8dc]"}`}>
            Continue with {chosen.name}
          </button>
        </div>
      </div>
    </div>
  );
}
