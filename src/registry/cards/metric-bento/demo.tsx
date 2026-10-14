"use client";
import { MetricBento, type MetricTile } from "./MetricBento";
import { seeded } from "./metrics";
import { BarList, Funnel, HeatCalendar, KpiTrend, LiveCounter, PlanMix } from "./tiles";

const rnd = seeded(42);
const revenue = Array.from({ length: 24 }, (_, i) => Math.round(31000 + i * 720 + Math.sin(i * 0.8) * 1900 + rnd() * 1400));
const weeksOf = ["Apr 21", "Apr 28", "May 5", "May 12", "May 19", "May 26", "Jun 2", "Jun 9", "Jun 16", "Jun 23", "Jun 30", "Jul 7", "Jul 14", "Jul 21", "Jul 28", "Aug 4", "Aug 11", "Aug 18", "Aug 25", "Sep 1", "Sep 8", "Sep 15", "Sep 22", "Sep 29"].map((d) => `week of ${d}`);
const start = new Date(2026, 6, 20);
const counts = Array.from({ length: 84 }, (_, i) => { const wd = (start.getDay() + i) % 7; const weekend = wd === 0 || wd === 6; return Math.max(0, Math.round((weekend ? 3 : 14) + rnd() * (weekend ? 5 : 22) + i * 0.12)); });

const tiles: MetricTile[] = [
  { id: "revenue", title: "Monthly recurring revenue", meta: "24 weeks", visual: <KpiTrend label="Monthly recurring revenue" values={revenue} labels={weeksOf} />, span: { lg: [2, 1], md: [2, 1] } },
  { id: "live", title: "Requests", meta: "live", visual: <LiveCounter /> },
  { id: "mix", title: "Plan mix", visual: <PlanMix items={[{ label: "Team", value: 1284 }, { label: "Business", value: 642 }, { label: "Enterprise", value: 188 }]} /> },
  { id: "deploys", title: "Deploys", meta: "12 weeks", visual: <HeatCalendar start={start} counts={counts} />, span: { lg: [2, 1], md: [2, 1] } },
  { id: "countries", title: "Top countries", meta: "this month", visual: <BarList rows={[{ label: "Germany", value: 4210 }, { label: "United States", value: 3870 }, { label: "Brazil", value: 2140 }, { label: "Japan", value: 1690 }, { label: "Kenya", value: 980 }]} />, span: { lg: [2, 1], md: [2, 1] } },
  { id: "funnel", title: "Sign-up funnel", meta: "last 30 days", visual: <Funnel steps={[{ label: "Visited", value: 48200 }, { label: "Signed up", value: 6120 }, { label: "Activated", value: 3480 }, { label: "Paid", value: 912 }]} />, span: { lg: [4, 1], md: [2, 1] } },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", background: paper ? "#f4f4f1" : "#0a0b0e" }}>
      <MetricBento theme={paper ? "paper" : "night"} eyebrow="Live · updated a moment ago" title="The whole business, on one screen." lede="Point at the trend to scrub it, hover a day to read it. Numbers here are the real thing, not screenshots."
        tiles={tiles} />
    </div>
  );
}
