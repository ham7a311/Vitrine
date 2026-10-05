"use client";
import { useRef } from "react";
import { TransferComposer } from "./TransferComposer";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  const sends = useRef(0);
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-10 ${light ? "bg-[#f6f6f7]" : "bg-[#0b0b0c]"}`}>
      <div className="w-full max-w-[34rem]">
        <TransferComposer
          theme={light ? "light" : "dark"}
          locale="en-US"
          today="2026-10-05"
          accounts={[{ id: "op", name: "Operating", last4: "2210", balance: 8_421_055 }, { id: "tax", name: "Tax reserve", last4: "8834", balance: 1_260_000 }]}
          recipients={[{ id: "q", name: "Qalam Studio LLC", bank: "Ruwi Savings", last4: "5521" }, { id: "l", name: "Layla Al-Harthy", bank: "Gulf Coast Bank", last4: "0937" }]}
          // Simulated service: the first send is rejected so the error stays on the review step.
          onSend={() => new Promise((resolve, reject) => setTimeout(() => (++sends.current === 1 ? reject(new Error("The receiving bank didn't answer in time. Nothing left your account; try again.")) : resolve({ reference: `TRF-${String(48213 + sends.current)}` })), 900))}
        />
      </div>
    </div>
  );
}
