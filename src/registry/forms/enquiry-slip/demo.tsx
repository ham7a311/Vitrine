"use client";

import { EnquirySlip } from "./EnquirySlip";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-5 py-10 ${night ? "bg-[#0f1012]" : "bg-[#f1efe8]"}`}>
      <EnquirySlip
        theme={night ? "night" : "paper"}
        to={{ name: "Hamza Al-Bulushi", email: "hello@gutech.example" }}
        topics={["A new product", "A redesign", "Something small", "Just a question"]}
        timeZone="Asia/Muscat"
        replyWithin="within two working days"
        referencePrefix="HB"
        onSend={() => new Promise((r) => setTimeout(r, 900))}
      />
    </div>
  );
}
