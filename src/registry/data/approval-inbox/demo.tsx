"use client";
import { useRef } from "react";
import { ApprovalInbox, type ApprovalRequest } from "./ApprovalInbox";

const ago = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString();
const REQUESTS: ApprovalRequest[] = [
  { id: "r1", kind: "reimbursement", requester: "Layla Al-Harthy", team: "Design", amount: 64_800, title: "Flights to the Salalah workshop", note: "Booked the earlier flight so the team could set up the evening before.", submitted: ago(42), flags: ["Over the travel limit by $148.00", "Receipt is a screenshot"] },
  { id: "r2", kind: "card", requester: "Omar Said", team: "Growth", amount: 200_000, title: "Card for the October ad test", note: "Monthly limit; it will only pay the ad network.", submitted: ago(180) },
  { id: "r3", kind: "limit", requester: "Salma Rashid", team: "Engineering", amount: 450_000, title: "Raise the Software card to $4,500", submitted: ago(60 * 26), flags: ["Third increase this quarter"] },
  { id: "r4", kind: "reimbursement", requester: "Hamza Al-Bulushi", team: "Studio", amount: 3_150, title: "Taxi to Ruwi for the printer pickup", submitted: ago(60 * 50) },
];

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  const calls = useRef(0);
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-10 ${light ? "bg-[#f6f6f7]" : "bg-[#0b0b0c]"}`}>
      <div className="w-full max-w-[60rem]">
        <ApprovalInbox
          requests={REQUESTS}
          undoMs={4000}
          locale="en-US"
          theme={light ? "light" : "dark"}
          // Simulated service: the second decision that reaches the server fails and comes back.
          onDecide={() => new Promise((resolve, reject) => setTimeout(() => (++calls.current === 2 ? reject(new Error("conflict")) : resolve()), 400))}
        />
      </div>
    </div>
  );
}
