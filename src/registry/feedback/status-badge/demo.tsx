"use client";
import { StatusBadge, type StatusBadgeProps } from "./StatusBadge";
import { ALL } from "./status";

const LOOKS = ["soft", "outline", "solid", "dot"] as const;
const ROWS: [string, string, StatusBadgeProps["status"], string?][] = [
  ["Order #4821", "Today, 09:42", "confirmed"],
  ["Order #4822", "Today, 10:05", "pending", "Processing"],
  ["Order #4817", "Yesterday", "cancelled"],
  ["Payout to ••41", "2 Oct", "failed"],
];

export default function Demo({ variant = "soft" }: { variant?: string }) {
  const look = (LOOKS as readonly string[]).includes(variant) ? (variant as (typeof LOOKS)[number]) : "soft";
  const panel = (theme: "light" | "dark") => (
    <section className={`stbg-demo__panel stbg-demo__panel--${theme}`} aria-label={theme === "dark" ? "On dark" : "On light"}>
      <div className="stbg-demo__set">{ALL.map((s) => <StatusBadge key={s} status={s} look={look} theme={theme} />)}</div>
      <ul className="stbg-demo__list">
        {ROWS.map(([name, when, status, label]) => (
          <li key={name}><b>{name}</b><small>{when}</small><StatusBadge status={status} label={label} look={look} size="sm" theme={theme} /></li>
        ))}
      </ul>
    </section>
  );
  return <div className="stbg-demo">{panel("light")}{panel("dark")}</div>;
}
