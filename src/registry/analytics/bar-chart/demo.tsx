"use client";
import { BarChart } from "./BarChart";

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const SERIES = [
  { name: "Subscriptions", values: [42, 46, 51, 55, 61, 68] },
  { name: "Services", values: [28, 24, 31, 35, 30, 37] },
  { name: "Hardware", values: [12, 18, 9, 14, 22, 17] },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`brch-demo brch-demo--${theme}`}>
      <BarChart title="Revenue by line" subtitle="Thousands of OMR, April to September" categories={MONTHS} series={SERIES} format={(n) => `${n}k`} theme={theme} />
    </div>
  );
}
