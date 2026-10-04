"use client";

import { HelpDeskFaq, type Topic } from "./HelpDeskFaq";

const TOPICS: Topic[] = [
  {
    name: "Bookings",
    icon: "calendar",
    articles: [
      { q: "How do I change the dates of a stay?", updated: "2 Oct 2026", body: ["Open Trips, choose the booking and tap Change dates. You’ll see what the new dates cost before anything changes.", "Changes are free up to 48 hours before check-in. Inside 48 hours, the host decides — their policy is shown on the booking."] },
      { q: "Can I add a guest after booking?", updated: "18 Sep 2026", body: ["Yes, as long as the place has room. Go to the booking, tap Guests and add them; the price updates straight away.", "Guests you add get their own copy of the itinerary by email and in the app."] },
      { q: "Where do I find my booking reference?", updated: "4 Aug 2026", body: ["It’s the six-character code at the top of every booking, like ATL-7QK2. It’s also in the subject line of your confirmation email."] },
    ],
  },
  {
    name: "Payments",
    icon: "card",
    articles: [
      { q: "When will my refund arrive?", updated: "29 Sep 2026", body: ["Refunds go back to the card you paid with. Most banks in Oman show them within 5–7 working days; some international cards take up to 10.", "If it has been longer than that, reply to your cancellation email and we’ll send the bank reference so they can trace it."] },
      { q: "Which cards do you accept?", updated: "12 Jul 2026", body: ["Visa, Mastercard and American Express, plus Apple Pay and Google Pay. Debit cards from every Omani bank work, including OmanNet."] },
      { q: "Can I split a payment with friends?", updated: "1 Sep 2026", body: ["For groups of four or more, choose Split at checkout. Each person gets a link to pay their share; the booking is held for 24 hours while everyone pays."] },
      { q: "Why was I charged in OMR?", updated: "20 Jun 2026", body: ["All prices are in Omani rials. If your card is in another currency, your bank converts it — we never add a fee of our own."] },
    ],
  },
  {
    name: "Your account",
    icon: "person",
    articles: [
      { q: "How do I reset my password?", updated: "5 Sep 2026", body: ["On the sign-in screen choose Forgot password and enter your email. The link works once and lasts an hour."] },
      { q: "Can I use Vitrine without an account?", updated: "11 May 2026", body: ["You can browse and save places, but booking needs an account so we can send your confirmation and reach you if plans change."] },
    ],
  },
  {
    name: "Hosting",
    icon: "home",
    articles: [
      { q: "How do I list my camp or guesthouse?", updated: "22 Sep 2026", body: ["Choose Host on Vitrine, add photos and your house rules, and set your prices in rials. A local partner visits within a week to verify the listing."] },
      { q: "When do hosts get paid?", updated: "14 Aug 2026", body: ["Payouts are sent the day after a guest checks in, to any Omani bank account."] },
    ],
  },
  {
    name: "Safety",
    icon: "shield",
    articles: [
      { q: "What if something goes wrong during my stay?", updated: "1 Oct 2026", body: ["Call the 24-hour line in the app — it connects you to someone in Muscat, in Arabic or English. In an emergency, call 9999 first."] },
      { q: "Are desert drives guided?", updated: "3 Sep 2026", body: ["Every 4×4 transfer we sell is driven by a licensed local guide. We don’t offer self-drive into the sands."] },
    ],
  },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${night ? "bg-[#0d0e10]" : "bg-[#ece8e0]"}`}>
      <HelpDeskFaq theme={night ? "night" : "paper"} topics={TOPICS} title="Vitrine Help" />
    </div>
  );
}
