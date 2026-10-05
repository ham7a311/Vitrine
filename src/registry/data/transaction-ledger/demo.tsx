"use client";
import { useRef } from "react";
import { TransactionLedger, type LedgerEntry } from "./TransactionLedger";

const ENTRIES: LedgerEntry[] = [
  { id: "t1", at: "2026-10-05T09:14:00+04:00", merchant: "Cloudframe Hosting", amount: -24_900, kind: "card", category: "Software", status: "pending", card: "1907", receipt: false },
  { id: "t2", at: "2026-10-05T08:02:00+04:00", merchant: "Qalam Studio LLC", amount: 1_250_000, kind: "transfer", category: "Incoming ACH", status: "posted" },
  { id: "t3", at: "2026-10-04T19:40:00+04:00", merchant: "Seeb Souq Café", amount: -1_850, kind: "card", category: "Meals", status: "posted", card: "6630", receipt: true, memo: "Client lunch, Masar kickoff" },
  { id: "t4", at: "2026-10-04T13:12:00+04:00", merchant: "Adspace Network", amount: -312_000, kind: "card", category: "Advertising", status: "posted", card: "4821", receipt: true },
  { id: "t5", at: "2026-10-04T10:05:00+04:00", merchant: "Layla Al-Harthy", amount: -480_000, kind: "transfer", category: "Wire out", status: "posted" },
  { id: "t6", at: "2026-10-01T07:00:00+04:00", merchant: "Wire fee", amount: -2_500, kind: "fee", category: "Account fee", status: "posted" },
  { id: "t7", at: "2026-10-01T06:58:00+04:00", merchant: "Pixelwork Fonts", amount: -9_900, kind: "card", category: "Software", status: "posted", card: "1907", receipt: false },
];

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  const saves = useRef(0);
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-10 ${light ? "bg-[#f6f6f7]" : "bg-[#0b0b0c]"}`}>
      <div className="w-full max-w-[44rem]">
        <TransactionLedger
          entries={ENTRIES}
          today="2026-10-05T12:00:00+04:00"
          timeZone="Asia/Muscat"
          locale="en-US"
          theme={light ? "light" : "dark"}
          // Simulated service: the second memo save fails, to show the kept draft.
          onMemo={() => new Promise((resolve, reject) => setTimeout(() => (++saves.current === 2 ? reject(new Error("offline")) : resolve()), 500))}
        />
      </div>
    </div>
  );
}
