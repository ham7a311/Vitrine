"use client";

import { useEffect, useState } from "react";
import { MetricMorph } from "./MetricMorph";

type State = { users: number | null; conv: number; revenue: number; latency: number; rev: number };

const START: State = { users: 12430, conv: 0.0342, revenue: 9980, latency: 184, rev: 0 };

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [s, setS] = useState<State>(START);
  const [live, setLive] = useState(true);
  const [loading, setLoading] = useState(false);

  const step = (kind: "up" | "down" | "same" | "random") =>
    setS((p) => {
      const r = kind === "random" ? Math.random() : kind === "up" ? 0.9 : kind === "down" ? 0.1 : 0.5;
      if (kind === "same" || (kind === "random" && r > 0.44 && r < 0.56)) return { ...p, rev: p.rev + 1 };
      const sign = r >= 0.5 ? 1 : -1;
      const big = Math.random() < 0.25;
      return {
        users: Math.max(0, (p.users ?? 0) + sign * Math.round((big ? 900 + Math.random() * 1400 : 3 + Math.random() * 60))),
        conv: Math.max(0.001, +(p.conv + sign * (0.0004 + Math.random() * 0.002)).toFixed(4)),
        revenue: Math.max(0, p.revenue + sign * Math.round(big ? 40 + Math.random() * 120 : 1 + Math.random() * 9)),
        latency: Math.max(20, p.latency - sign * Math.round(1 + Math.random() * 14)),
        rev: p.rev + 1,
      };
    });

  useEffect(() => {
    if (!live) return;
    const t = window.setInterval(() => step("random"), 2600);
    return () => window.clearInterval(t);
  }, [live]);

  const reload = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      step("random");
    }, 1100);
  };

  const c = night
    ? { page: "bg-[#0f1012] text-[#efeee9]", card: "bg-[#16171a] ring-white/[0.07]", btn: "ring-white/10 hover:bg-white/[0.06]", muted: "text-[#8e9096]" }
    : { page: "bg-[#f4f2ed] text-[#17160f]", card: "bg-white ring-black/[0.07]", btn: "ring-black/10 hover:bg-black/[0.04]", muted: "text-[#7a766d]" };
  const theme = night ? "night" : "paper";

  return (
    <div className={`flex h-full min-h-[560px] w-full items-center justify-center overflow-auto px-4 py-10 ${c.page}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="w-full max-w-[880px]">
        <div className={`grid gap-px overflow-hidden rounded-2xl ring-1 sm:grid-cols-2 lg:grid-cols-4 ${night ? "ring-white/[0.07]" : "ring-black/[0.07]"}`} style={{ background: night ? "rgb(255 255 255 / 0.07)" : "rgb(0 0 0 / 0.07)" }}>
          {[
            <MetricMorph key="u" theme={theme} label="Active users" compareLabel="vs 5 min ago" value={s.users} revision={s.rev} loading={loading} />,
            <MetricMorph key="c" theme={theme} label="Checkout conversion" compareLabel="vs 5 min ago" value={s.conv} format="percent" decimals={2} revision={s.rev} loading={loading} />,
            <MetricMorph key="r" theme={theme} label="Revenue today" compareLabel="vs 5 min ago" value={s.revenue} format="currency" currency="OMR" revision={s.rev} loading={loading} />,
            <MetricMorph key="l" theme={theme} label="p95 latency (ms)" compareLabel="lower is better" value={s.latency} invert revision={s.rev} loading={loading} />,
          ].map((m, i) => (
            <div key={i} className={`p-5 ${night ? "bg-[#16171a]" : "bg-white"}`}>
              {m}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-[12.5px]">
          <button type="button" onClick={() => setLive((l) => !l)} aria-pressed={live} className={`flex h-8 items-center gap-2 rounded-lg px-3 ring-1 ${c.btn}`}>
            <span className={`size-1.5 rounded-full ${live ? "bg-[#15803d]" : night ? "bg-white/30" : "bg-black/25"}`} aria-hidden="true" />
            {live ? "Live" : "Paused"}
          </button>
          <button type="button" onClick={() => step("up")} className={`h-8 rounded-lg px-3 ring-1 ${c.btn}`}>
            Rise
          </button>
          <button type="button" onClick={() => step("down")} className={`h-8 rounded-lg px-3 ring-1 ${c.btn}`}>
            Fall
          </button>
          <button type="button" onClick={() => step("same")} className={`h-8 rounded-lg px-3 ring-1 ${c.btn}`}>
            No change
          </button>
          <button type="button" onClick={reload} disabled={loading} className={`h-8 rounded-lg px-3 ring-1 disabled:opacity-40 ${c.btn}`}>
            Refresh
          </button>
          <span className={`ml-auto ${c.muted}`}>Only the changed places move · the rule shows how far up the number the change reached</span>
        </div>
      </div>
    </div>
  );
}
