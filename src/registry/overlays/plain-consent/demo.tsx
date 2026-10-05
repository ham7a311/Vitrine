"use client";

import { PlainConsent, type ConsentCategory } from "./PlainConsent";

const CATEGORIES: ConsentCategory[] = [
  { id: "session", name: "Session", essential: true, what: "Keeps you signed in as you move between pages, and remembers the choices you make here.", lasts: "Until you close the browser; this choice for 12 months", by: "This site" },
  { id: "prefs", name: "Preferences", what: "Remembers your theme and language so the page doesn't flash white at night.", lasts: "12 months", by: "This site" },
  { id: "measure", name: "Measurement", what: "Counts visits and which pages get read, without recording who you are. Addresses are cut down to a region before they are stored.", lasts: "13 months", by: "Tally, self-hosted" },
  { id: "embeds", name: "Embeds", what: "Lets maps and videos load from other sites. Those sites can then set cookies of their own, which we can't see or control.", lasts: "Decided by them", by: "Map and video hosts" },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const muted = night ? "text-[#8d8f95]" : "text-[#6b6861]";
  return (
    <div className={`relative h-full min-h-[520px] w-full overflow-hidden ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f6f5f1] text-[#1b1a17]"}`}>
      <div className="mx-auto max-w-[40rem] px-6 pt-14">
        <p className={`font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] ${muted}`}>Masar · Trip planning for Oman</p>
        <h1 className="mt-3 font-[family-name:Instrument_Serif] text-[2.75rem] leading-none tracking-[-0.02em]">Plan the drive from Muscat to Salalah</h1>
        <p className={`mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed ${muted}`}>
          Eleven hours, three fuel stops, and one stretch with no signal. Choose either button below, then open the tab that is left behind to change your mind.
        </p>
      </div>
      <PlainConsent contained theme={night ? "night" : "paper"} categories={CATEGORIES} />
    </div>
  );
}
