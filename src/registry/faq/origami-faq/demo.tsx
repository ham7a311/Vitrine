"use client";

import { OrigamiFaq, type Fold } from "./OrigamiFaq";

const ITEMS: Fold[] = [
  {
    q: "What does a stay include?",
    a: [
      "Dinner and breakfast, cooked over the fire by the family who run the camp.",
      "A 4×4 transfer from Al Mintirib, and sandboards if you want them.",
      "Bedding, lanterns, and a night sky you won’t get in Muscat.",
    ],
  },
  {
    q: "When is the best time to go?",
    a: [
      "October to April. Days are warm, nights are cool enough for a blanket.",
      "From May the dunes are too hot to walk by mid-morning.",
      "Ramadan evenings are quieter and lovely — iftar is served at the camp.",
    ],
  },
  {
    q: "Can I cancel?",
    a: [
      "Free cancellation up to seven days before you arrive.",
      "Inside a week, you can move your dates once at no cost.",
      "Weather cancellations are always refunded in full.",
    ],
  },
  {
    q: "Is it suitable for children?",
    a: [
      "Yes — tents sleep up to five, and camps have shaded play areas.",
      "Camel rides are short and led on foot by a guide.",
      "Ask for a tent near the fire circle; it’s the best spot for stories.",
    ],
  },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full justify-center px-5 py-12 ${night ? "bg-[#14130f] text-[#efe8dc]" : "bg-[#efe8d8] text-[#1f1c17]"}`}>
      <div className="w-full max-w-[40rem]">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${night ? "text-[#f0a36a]" : "text-[#b5541f]"}`}>Wahiba Sands · before you go</p>
        <h2 className="mt-3 text-[clamp(2rem,5vw,2.8rem)] leading-none tracking-[-0.01em]" style={{ fontFamily: '"Instrument Serif", Newsreader, Georgia, serif' }}>
          Folded notes for a night in the dunes
        </h2>
        <OrigamiFaq className="mt-8" theme={night ? "night" : "paper"} items={ITEMS} title="Desert camp questions" />
      </div>
    </div>
  );
}
