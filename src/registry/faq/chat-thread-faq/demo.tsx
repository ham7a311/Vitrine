"use client";

import { ChatThreadFaq, type Qa } from "./ChatThreadFaq";

const ITEMS: Qa[] = [
  { id: "dates", q: "Can I change my dates?", a: "Yes — free of charge up to 48 hours before check-in. Open the booking, tap Change dates and pick new ones; you’ll see any price difference before you confirm.", next: ["transfer", "refund"] },
  { id: "refund", q: "How do refunds work?", a: "Refunds go back to the card you paid with in 5–7 working days. Cancel more than 7 days ahead and it’s a full refund; inside 7 days the camp’s own policy applies, and it’s shown on every listing.", next: ["omr"] },
  { id: "transfer", q: "Is there a transfer from Muscat?", a: "Most Wahiba Sands camps include a 4×4 pickup from Al Mintirib. From Muscat it’s about two and a half hours — add the Vitrine Shuttle at checkout for OMR 18 per person each way.", next: ["group"] },
  { id: "group", q: "Can I book for a group?", a: "Groups of up to 30 can book in one go. Over 10 people, you get a planner who can split the payment between guests.", next: ["refund"] },
  { id: "omr", q: "Do you charge in rials?", a: "Every price is in Omani rials. Cards in other currencies are charged in OMR and converted by your bank — we never add a conversion fee.", next: ["dates"] },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${night ? "bg-[#0d0e10]" : "bg-[#ece8e0]"}`}>
      <ChatThreadFaq
        theme={night ? "night" : "paper"}
        items={ITEMS}
        agent={{ name: "Vitrine Help", role: "Answers in seconds" }}
        human={{ label: "Talk to a person", reply: "I’ve let Salim know — he’s online and usually replies within three minutes. You’ll get a notification right here." }}
      />
    </div>
  );
}
