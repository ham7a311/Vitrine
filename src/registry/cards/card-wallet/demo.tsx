"use client";
import { useRef } from "react";
import { CardWallet, type WalletCard } from "./CardWallet";

const CARDS: WalletCard[] = [
  { id: "ads", nickname: "Ads · Meta & search", holder: "Hamza Al-Bulushi", last4: "4821", expires: "08/29", color: "ink", limit: 1_500_000, spent: 1_342_050 },
  { id: "saas", nickname: "Software", holder: "Hamza Al-Bulushi", last4: "1907", expires: "03/28", color: "graphite", limit: 300_000, spent: 124_000 },
  { id: "travel", nickname: "Team travel", holder: "Layla Al-Harthy", last4: "6630", expires: "11/27", color: "moss", limit: 800_000, spent: 210_475 },
  { id: "old", nickname: "Old contractor card", holder: "Omar Said", last4: "0412", expires: "01/27", color: "sand", limit: 50_000, spent: 0, frozen: true },
];
// Test numbers only. A real reveal goes through your server after a step-up check.
const SECRETS: Record<string, { number: string; cvc: string }> = {
  ads: { number: "4000 0012 3456 4821", cvc: "318" }, saas: { number: "4000 0098 7654 1907", cvc: "502" },
  travel: { number: "4000 0055 5555 6630", cvc: "771" }, old: { number: "4000 0000 0000 0412", cvc: "090" },
};

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  const freezes = useRef(0);
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-10 sm:px-8 ${light ? "bg-[#f6f6f7]" : "bg-[#0b0b0c]"}`}>
      <div className="w-full max-w-[60rem]">
        <CardWallet
          cards={CARDS}
          theme={light ? "light" : "dark"}
          locale="en-US"
          reveal={(id) => new Promise((resolve) => setTimeout(() => resolve(SECRETS[id]), 600))}
          // Simulated service: every third freeze change fails, to show the rollback.
          onFreeze={() => new Promise((resolve, reject) => setTimeout(() => (++freezes.current % 3 === 0 ? reject(new Error("timeout")) : resolve()), 500))}
        />
      </div>
    </div>
  );
}
