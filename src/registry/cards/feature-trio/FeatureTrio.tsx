"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./feature-trio.css";

/**
 * Feature Trio
 * A feature section where each card shows instead of tells. Every card has a
 * small, real-looking piece of product UI at the top. At rest they idle at a
 * slow pace; the card you point at (or focus) runs at full speed and its
 * accent comes up, while the other two quieten. Copy stays short underneath.
 */

type Props = { accent?: string; className?: string };

function useActive(on: boolean, ms: number, steps: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % steps), on ? ms : ms * 4);
    return () => clearInterval(id);
  }, [on, ms, steps]);
  return i;
}

const LOG = ["Cloning repository", "Installing 214 packages", "Building 38 routes", "Uploading to 32 regions", "Ready · 41s"];

function BuildDemo({ on }: { on: boolean }) {
  const i = useActive(on, 700, LOG.length + 2);
  return (
    <div className="feature-trio__demo feature-trio__log" aria-hidden="true">
      {LOG.map((l, k) => (
        <p key={l} data-state={k < i ? "done" : k === i ? "run" : "wait"}>
          <i />
          {l}
        </p>
      ))}
    </div>
  );
}

function LatencyDemo({ on }: { on: boolean }) {
  const pts = useRef<number[]>(Array.from({ length: 40 }, (_, k) => 40 + Math.sin(k / 3) * 8));
  const [, tick] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const last = pts.current[pts.current.length - 1];
      const spike = Math.random() < 0.06 ? 30 : 0;
      pts.current = [...pts.current.slice(1), Math.max(18, Math.min(88, last + (Math.random() - 0.5) * 12 + (46 - last) * 0.2 + spike))];
      tick((t) => t + 1);
    }, on ? 120 : 480);
    return () => clearInterval(id);
  }, [on]);
  const d = pts.current.map((v, k) => `${k === 0 ? "M" : "L"}${(k / 39) * 200},${100 - v}`).join(" ");
  const now = Math.round(pts.current[pts.current.length - 1]);
  return (
    <div className="feature-trio__demo feature-trio__chart" aria-hidden="true">
      <p><span>p95 latency</span><b>{now} ms</b></p>
      <svg viewBox="0 0 200 100" preserveAspectRatio="none">
        <path className="feature-trio__area" d={`${d} L200,100 L0,100 Z`} />
        <path className="feature-trio__line" d={d} />
      </svg>
    </div>
  );
}

function ShieldDemo({ on }: { on: boolean }) {
  const [n, setN] = useState(18402);
  const [hits, setHits] = useState<{ id: number; x: number }[]>([]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    const t = setInterval(() => {
      setN((v) => v + 1 + Math.floor(Math.random() * 3));
      const hit = { id: id++, x: 10 + Math.random() * 80 };
      setHits((h) => [...h.slice(-5), hit]);
    }, on ? 380 : 1500);
    return () => clearInterval(t);
  }, [on]);
  return (
    <div className="feature-trio__demo feature-trio__shield" aria-hidden="true">
      <div className="feature-trio__wall">
        {hits.map((h) => <i key={h.id} style={{ left: `${h.x}%` } as CSSProperties} />)}
      </div>
      <p><span>Blocked today</span><b>{n.toLocaleString("en-US")}</b></p>
    </div>
  );
}

const CARDS = [
  { k: "01", title: "Ship from a push", body: "Every commit builds, previews and — when you're ready — goes live in every region at once.", Demo: BuildDemo },
  { k: "02", title: "See it as it runs", body: "Latency, errors and traffic, per route, in real time. The graph is the incident report.", Demo: LatencyDemo },
  { k: "03", title: "Safe by default", body: "Bots, floods and bad actors are stopped at the edge before they ever reach your code.", Demo: ShieldDemo },
];

export function FeatureTrio({ accent = "#b9cce4", className = "" }: Props) {
  const [hot, setHot] = useState<number | null>(null);
  return (
    <div className={`feature-trio ${className}`} style={{ "--ft-accent": accent } as CSSProperties}>
    <ul className="feature-trio__grid" data-hot={hot ?? undefined} onMouseLeave={() => setHot(null)}>
      {CARDS.map(({ k, title, body, Demo }, i) => (
        <li key={k}>
          <a
            href="#"
            className="feature-trio__card"
            data-on={hot === i || undefined}
            onMouseEnter={() => setHot(i)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(null)}
            onClick={(e) => e.preventDefault()}
          >
            <Demo on={hot === i} />
            <span className="feature-trio__k">{k}</span>
            <span className="feature-trio__title">{title}</span>
            <span className="feature-trio__body">{body}</span>
          </a>
        </li>
      ))}
    </ul>
    </div>
  );
}
