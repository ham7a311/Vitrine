"use client";
import { DeckFaq } from "./DeckFaq";
import type { Card } from "./deck";

const CARDS: Card[] = [
  { id: "c1", topic: "Plans", q: "Can I switch plans in the middle of a month?", a: "Yes. Upgrades start straight away and you pay the difference for the days left; downgrades take effect at your next renewal, so nothing is lost." },
  { id: "c2", topic: "Billing", q: "Do you offer refunds?", a: "Within 14 days of any charge, no questions asked. After that we refund unused months on yearly plans if you cancel." },
  { id: "c3", topic: "Data", q: "Where is my data stored?", a: "In the EU by default, on encrypted disks in two regions. Team and Business plans can choose the US or Australia instead." },
  { id: "c4", topic: "Teams", q: "How do guest seats work?", a: "Guests can view and comment on anything you share with them and never count towards your seats. They can't create projects." },
  { id: "c5", topic: "Account", q: "What happens if I cancel?", a: "Your workspace stays read-only for 90 days, so you can export everything. After that it's deleted for good, backups included." },
  { id: "c6", topic: "Security", q: "Do you support single sign-on?", a: "On Business plans: SAML with any identity provider, plus SCIM so people are added and removed automatically." },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "28px 16px", background: night ? "#09090c" : "#e8e4da" }}>
      <DeckFaq cards={CARDS} support={{ label: "Ask the support team", href: "#support" }} onNavigate={(_, e) => e.preventDefault()} theme={night ? "night" : "paper"} />
    </div>
  );
}
