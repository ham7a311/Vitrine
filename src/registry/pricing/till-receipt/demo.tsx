"use client";
import { TillReceipt } from "./TillReceipt";
import type { Addon, Plan } from "./bill";

const PLANS: Plan[] = [
  { id: "solo", name: "Solo", blurb: "One maker, unlimited projects and client links.", seat: 900, included: 1 },
  { id: "studio", name: "Studio", blurb: "Shared libraries, reviews and version history.", seat: 1900, included: 2 },
  { id: "agency", name: "Agency", blurb: "Client workspaces, audit log and roles.", seat: 3400, included: 5 },
];
const ADDONS: Addon[] = [
  { id: "storage", name: "Extra 1 TB storage", price: 800 },
  { id: "support", name: "Priority support", price: 300, perSeat: true },
  { id: "domain", name: "Custom review domain", price: 500 },
  { id: "sso", name: "Single sign-on", price: 1200 },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "28px 16px", background: night ? "#0a0a0b" : "#e9e4d8" }}>
      <TillReceipt shop="Proofline" plans={PLANS} addons={ADDONS} theme={night ? "night" : "paper"} />
    </div>
  );
}
