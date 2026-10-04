"use client";

import { AccountChooser, type Account } from "./AccountChooser";

const ACCOUNTS: Account[] = [
  { id: "h", name: "Hamza Taj", email: "hamza@tryvitrine.dev", last: "Today", hue: 212 },
  { id: "m", name: "Maryam Al-Harthy", email: "maryam@gutech.edu.om", last: "3 days ago", hue: 14 },
  { id: "s", name: "Vitrine Studio", email: "studio@tryvitrine.dev", last: "Last week", hue: 152 },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${night ? "bg-[#0d0e10]" : "bg-[#efebe3]"}`}>
      <AccountChooser theme={night ? "night" : "paper"} accounts={ACCOUNTS} product="Vitrine" />
    </div>
  );
}
