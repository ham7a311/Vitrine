"use client";
import { SummitStats } from "./SummitStats";

const MONEY = (n: number) => (n >= 1000 ? `£${(n / 1000).toFixed(n % 1000 ? 1 : 0)}k` : `£${n}`);

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "28px 16px", background: night ? "#080a11" : "#ebe3d5" }}>
      <SummitStats
        title="Raised for the Hollin Valley footbridge"
        value={186400}
        goal={250000}
        note="1,912 backers · 64 days to go"
        format={MONEY}
        checkpoints={[
          { at: 25000, label: "Local businesses pledged", date: "2 Feb" },
          { at: 80000, label: "Council match-funding unlocked", date: "9 Mar" },
          { at: 150000, label: "Engineering survey paid for", date: "21 Apr" },
          { at: 210000, label: "Steel ordered", date: "Next" },
        ]}
        theme={night ? "night" : "paper"}
      />
    </div>
  );
}
