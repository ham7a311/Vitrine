"use client";

import { AuroraFootCard, ICONS } from "./AuroraFootCard";
import { LOOKS } from "./aurora";

const COPY = {
  magenta: { icon: ICONS.lock, title: "Always guarded", text: "Every payment is screened as it happens, so fraud stops before it starts." },
  lime: { icon: ICONS.link, title: "Pay by link", text: "Make a payment link in seconds and share it wherever your customers are." },
  iris: { icon: ICONS.trend, title: "Built on best practice", text: "Follows the standards banks and auditors already trust." },
  ember: { icon: ICONS.gauge, title: "Fast across borders", text: "Send and settle in forty currencies without the week-long wait." },
} as const;

export default function Demo({ variant = "magenta" }: { variant?: string }) {
  const key = (variant in COPY ? variant : "magenta") as keyof typeof COPY;
  const c = COPY[key];
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#050506] px-4 py-16">
      <AuroraFootCard look={LOOKS[key]} icon={c.icon} title={c.title}>
        {c.text}
      </AuroraFootCard>
    </div>
  );
}
