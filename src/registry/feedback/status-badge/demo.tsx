"use client";
import { StatusBadge, type StatusBadgeProps } from "./StatusBadge";
import { ALL } from "./status";

const LOOKS: [NonNullable<StatusBadgeProps["look"]>, string][] = [["soft", "Soft"], ["outline", "Outline"], ["solid", "Solid"], ["dot", "Dot"]];
const ROWS: [string, string, StatusBadgeProps["status"], string?][] = [
  ["Order #4821", "Today, 09:42", "confirmed"],
  ["Order #4822", "Today, 10:05", "pending", "Processing"],
  ["Order #4817", "Yesterday", "cancelled"],
  ["Payout to ••41", "2 Oct", "failed"],
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`stbg-demo stbg-demo--${theme}`}>
      {LOOKS.map(([look, name]) => (
        <section key={look} aria-label={name}>
          <h3>{name}</h3>
          <div className="stbg-demo__set">{ALL.map((s) => <StatusBadge key={s} status={s} look={look} theme={theme} />)}</div>
        </section>
      ))}
      <section aria-label="In a list">
        <h3>In a list</h3>
        <ul className="stbg-demo__list">
          {ROWS.map(([name, when, status, label]) => (
            <li key={name}><b>{name}</b><small>{when}</small><StatusBadge status={status} label={label} size="sm" theme={theme} /></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
