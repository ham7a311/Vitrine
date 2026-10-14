"use client";
import { MonoBento, type MonoTile } from "./MonoBento";
import { Numeral, Shortcut, Specimen, Ticker, Toggle, Uptime } from "./tiles";

const series = [3, 4, 4, 5, 4, 6, 5, 7, 6, 6, 8, 7, 9, 8, 10, 9, 11, 10, 12, 11, 13, 12, 14, 15];

const tiles: MonoTile[] = [
  { id: "requests", title: "Requests today", body: "Served from the edge, counted the moment they land.", visual: <Numeral value={4210000} caption="Across 18 regions" series={series} />, span: { lg: [2, 2], md: [2, 2], sm: [1, 2] } },
  { id: "uptime", title: "Status, in public", body: "Every incident logged, nothing rounded.", visual: <Uptime />, span: { lg: [2, 1], md: [2, 1] }, href: "#status" },
  { id: "type", title: "One typeface", visual: <Specimen /> },
  { id: "keys", title: "Keyboard first", visual: <Shortcut /> },
  { id: "log", title: "Shipped this month", visual: <Ticker lines={[
    { tag: "v4.2.0", text: "Cold starts down to 40ms" }, { tag: "v4.1.3", text: "Branch previews keep their data" },
    { tag: "v4.1.0", text: "Audit log export" }, { tag: "v4.0.2", text: "Faster search across projects" }, { tag: "v4.0.0", text: "New CLI, half the flags" },
  ]} />, span: { lg: [2, 1], md: [2, 1] }, href: "#changelog" },
  { id: "motion", title: "Calm by default", body: "Motion off until you want it.", visual: <Toggle label="Interface motion" initial={false} />, span: { lg: [2, 1], md: [2, 1] } },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", background: paper ? "#fff" : "#000" }}>
      <MonoBento theme={paper ? "paper" : "night"} kicker="Ledger · platform" title="Plain tools for serious work." lede="No gradients, no confetti. Just the parts that keep a product running, kept in plain sight."
        tiles={tiles} onNavigate={(_, e) => e.preventDefault()} />
    </div>
  );
}
