"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./sankey-flow.css";

/**
 * Sankey Flow
 * Where visitors come from, where they go, and how it ends — as flows whose width is the number
 * of people. Bands draw in from the left the first time you see it; point at a node or a band to
 * follow just those people through the site.
 */

export type Flow = { from: string; to: string; value: number };
type Props = { columns: string[][]; flows: Flow[]; title?: string; goal?: string; theme?: "light" | "dark"; motion?: "full" | "reduced"; className?: string };

const W = 860, H = 380, NODE = 14, GAP = 14;
const SERIES_LIGHT = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"];
const SERIES_DARK = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181"];

export function SankeyFlow({ columns, flows, title = "Visitor journeys, last 30 days", goal = "Booked", theme = "light", motion = "full", className = "" }: Props) {
  const [hover, setHover] = useState<{ node?: string; link?: number } | null>(null);
  const [view, setView] = useState<"chart" | "table">("chart");
  const [seen, setSeen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const series = theme === "dark" ? SERIES_DARK : SERIES_LIGHT;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches) return setSeen(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [motion]);

  const layout = useMemo(() => {
    const total = flows.filter((f) => columns[0].includes(f.from)).reduce((a, f) => a + f.value, 0);
    const maxN = Math.max(...columns.map((c) => c.length));
    const k = (H - GAP * (maxN - 1)) / total;
    const nodes = new Map<string, { x: number; y: number; h: number; col: number; value: number; inY: number; outY: number }>();
    columns.forEach((col, ci) => {
      const vals = col.map((n) => Math.max(flows.filter((f) => f.to === n).reduce((a, f) => a + f.value, 0), flows.filter((f) => f.from === n).reduce((a, f) => a + f.value, 0)));
      const used = vals.reduce((a, v) => a + v * k, 0) + GAP * (col.length - 1);
      let y = (H - used) / 2;
      col.forEach((n, i) => {
        const h = vals[i] * k;
        nodes.set(n, { x: (ci / (columns.length - 1)) * (W - NODE), y, h, col: ci, value: vals[i], inY: y, outY: y });
        y += h + GAP;
      });
    });
    // Stack each link at both ends in the order of the node on the other side, so bands don't cross needlessly.
    const order = (n: string) => {
      const nd = nodes.get(n)!;
      return nd.y;
    };
    const links = [...flows]
      .map((f, i) => ({ ...f, i }))
      .sort((a, b) => order(a.from) - order(b.from) || order(a.to) - order(b.to))
      .map((f) => {
        const a = nodes.get(f.from)!, b = nodes.get(f.to)!, h = f.value * k;
        const y0 = a.outY, y1 = b.inY;
        a.outY += h;
        b.inY += h;
        return { ...f, h, x0: a.x + NODE, x1: b.x, y0, y1 };
      });
    return { nodes, links, total };
  }, [columns, flows]);

  const sourceColour = (name: string) => series[columns[0].indexOf(name) % series.length] ?? "var(--muted)";
  // First-stage bands carry their source's colour; later bands are neutral, so colour never implies an origin it can't know.
  const linkColour = (l: Flow) => (columns[0].includes(l.from) ? sourceColour(l.from) : l.to === goal ? "var(--ink)" : "var(--muted)");
  const related = (l: { from: string; to: string; i: number }) => {
    if (!hover) return true;
    if (hover.link !== undefined) return hover.link === l.i;
    return l.from === hover.node || l.to === hover.node;
  };
  const band = (l: { x0: number; x1: number; y0: number; y1: number; h: number }) => {
    const mx = (l.x0 + l.x1) / 2;
    return `M${l.x0} ${l.y0} C${mx} ${l.y0} ${mx} ${l.y1} ${l.x1} ${l.y1} L${l.x1} ${l.y1 + l.h} C${mx} ${l.y1 + l.h} ${mx} ${l.y0 + l.h} ${l.x0} ${l.y0 + l.h} Z`;
  };
  const goalNode = layout.nodes.get(goal);
  const share = goalNode ? Math.round((goalNode.value / layout.total) * 100) : 0;
  const hl = hover?.link !== undefined ? layout.links.find((l) => l.i === hover.link) : null;
  const hn = hover?.node ? layout.nodes.get(hover.node) : null;

  return (
    <div ref={wrap} className={`skf skf--${theme} ${className}`}>
      <header className="skf__head">
        <div>
          <p className="skf__title">{title}</p>
          <p className="skf__hero">
            {share}% <span>of {layout.total.toLocaleString("en-GB")} visitors {goal.toLowerCase()}</span>
          </p>
        </div>
        <button type="button" className="skf__view" aria-pressed={view === "table"} onClick={() => setView((v) => (v === "chart" ? "table" : "chart"))}>
          {view === "chart" ? "Table" : "Chart"}
        </button>
      </header>
      <p className="skf__hint" aria-live="polite">
        {hl ? `${hl.from} → ${hl.to}: ${hl.value.toLocaleString("en-GB")} visitors (${Math.round((hl.value / layout.nodes.get(hl.from)!.value) * 100)}% of ${hl.from})` : hn ? `${hover!.node}: ${hn.value.toLocaleString("en-GB")} visitors` : "Point at a node or a band to follow it."}
      </p>
      {view === "chart" ? (
        <div className="skf__plot" data-seen={seen ? "" : undefined}>
          <svg viewBox={`-4 -4 ${W + 8} ${H + 8}`} role="img" aria-label={`${title}. ${share}% of visitors ${goal.toLowerCase()}.`}>
            <g className="skf__links">
              {layout.links.map((l) => (
                <path
                  key={l.i}
                  d={band(l)}
                  fill={linkColour(l)}
                  className="skf__link"
                  data-dim={related(l) ? undefined : ""}
                  data-goal={l.to === goal ? "" : undefined}
                  style={{ ["--d" as string]: `${columns.findIndex((c) => c.includes(l.from)) * 220}ms` }}
                  onPointerEnter={() => setHover({ link: l.i })}
                  onPointerLeave={() => setHover(null)}
                />
              ))}
            </g>
            {[...layout.nodes.entries()].map(([n, nd]) => (
              <g key={n} onPointerEnter={() => setHover({ node: n })} onPointerLeave={() => setHover(null)} className="skf__node">
                <rect x={nd.x} y={nd.y} width={NODE} height={Math.max(2, nd.h)} rx={3} data-goal={n === goal ? "" : undefined} />
                <text x={nd.col === columns.length - 1 ? nd.x - 8 : nd.x + NODE + 8} y={nd.y + nd.h / 2} textAnchor={nd.col === columns.length - 1 ? "end" : "start"} dominantBaseline="middle">
                  <tspan className="skf__name">{n}</tspan>
                  <tspan className="skf__num" dx="6">
                    {nd.value.toLocaleString("en-GB")}
                  </tspan>
                </text>
              </g>
            ))}
          </svg>
        </div>
      ) : (
        <div className="skf__table-wrap">
          <table className="skf__table">
            <thead>
              <tr>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col">Visitors</th>
              </tr>
            </thead>
            <tbody>
              {flows.map((f) => (
                <tr key={`${f.from}-${f.to}`}>
                  <td>{f.from}</td>
                  <td>{f.to}</td>
                  <td>{f.value.toLocaleString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
