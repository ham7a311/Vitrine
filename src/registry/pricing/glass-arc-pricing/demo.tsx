"use client";

import { useState } from "react";
import { GlassArcPricing, type ArcPlan } from "./GlassArcPricing";

// Plans for a small video editor.
const PLANS: ArcPlan[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    blurb: "For anyone cutting their first few films on their own.",
    features: ["Up to 2 projects at a time", "Video export up to 1080p", "Core editing tools", "Starter titles and transitions", "Works on web and desktop"],
  },
  {
    id: "plus",
    name: "Plus",
    monthly: 14.99,
    yearly: 11.99,
    blurb: "For freelancers and small crews who share one timeline.",
    features: ["Up to 40 projects at a time", "Video export up to 4K", "Colour and audio toolkit", "Shared timelines (up to 4 people)", "Full stock music library"],
  },
  {
    id: "studio",
    name: "Studio",
    monthly: 29.99,
    yearly: 24.99,
    blurb: "For studios and agencies delivering client work every week.",
    features: ["Projects without limit", "Export up to 8K + motion graphics", "Automatic captions and rough cuts", "Seats for the whole team", "Your own fonts, logos and palettes"],
    featured: true,
  },
];

export default function Demo() {
  const [chosen, setChosen] = useState("");
  return (
    <div className="min-h-full w-full bg-black">
      <GlassArcPricing plans={PLANS} onChoose={(plan, billing) => setChosen(`${plan.name}, ${billing}`)} />
      <p className="sr-only" role="status">{chosen && `Chosen: ${chosen}`}</p>
    </div>
  );
}
