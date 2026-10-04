"use client";

import { CitedAnswer } from "./CitedAnswer";

const SOURCES = [
  { domain: "omantourism.gov.om", title: "Wadi Shab — walking routes and safety notes" },
  { domain: "lonelyplanet.com", title: "The best time to visit Oman: a month-by-month guide" },
  { domain: "met.gov.om", title: "Muscat climate normals, 1991–2020" },
  { domain: "reddit.com", title: "Hiked Wadi Shab in November — tips?" },
];

const ANSWER = [
  { text: "November to March is the most comfortable window for Wadi Shab, with daytime highs in the high twenties.", cites: [1, 2] },
  { text: "The walk to the pools takes about 45 minutes each way and involves a short boat crossing at the trailhead.", cites: [0] },
  { text: "Go early: the car park fills by mid-morning on weekends, and the last stretch to the cave needs swimming.", cites: [0, 3] },
  { text: "Summer temperatures regularly pass 40°C, so hiking then is best avoided.", cites: [2] },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#191a1a]" : "bg-[#fcfcf9]"}`}>
      <CitedAnswer question="When is the best time to hike Wadi Shab?" sources={SOURCES} answer={ANSWER} theme={night ? "night" : "paper"} />
    </div>
  );
}
