"use client";
import { useEffect, useRef, useState } from "react";
import { LogTail, type Level, type LogLine } from "./LogTail";

// A fictional Masar API: a seeded stream so every visit reads the same.
const SOURCES = ["api", "worker", "db", "auth", "cache"];
const TEMPLATES: [Level, string][] = [
  ["info", "GET /v1/docs/{n} 200 in {ms}ms"],
  ["info", "POST /v1/comments 201 in {ms}ms"],
  ["debug", "cache hit doc:{n} ttl=300"],
  ["debug", "pool size=12 idle={k}"],
  ["info", "job export-{n} finished in {ms}ms"],
  ["warn", "slow query on blocks ({ms}ms) user_id={n}"],
  ["info", "session refreshed for user {n}"],
  ["error", "timeout after {ms}ms calling storage.sign"],
  ["warn", "retrying webhook {n} (attempt {k} of 5)"],
  ["debug", "GC pause {k}ms"],
];

const CALM = [0, 1, 2, 3, 4, 6, 9];

function make(seed: number, id: number, t: number): LogLine {
  let a = seed;
  const r = () => ((a = (a * 16807) % 2147483647) / 2147483647);
  const roll = r();
  const [level, tpl] = TEMPLATES[roll < 0.05 ? 7 : roll < 0.14 ? 5 : roll < 0.2 ? 8 : CALM[Math.floor(r() * CALM.length)]];
  const msg = tpl.replace("{n}", String(1000 + Math.floor(r() * 9000))).replace("{ms}", String(4 + Math.floor(r() * (level === "info" ? 180 : 900)))).replace("{k}", String(1 + Math.floor(r() * 4)));
  return { id, t, level, source: SOURCES[Math.floor(r() * SOURCES.length)], msg };
}

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const [lines, setLines] = useState<LogLine[]>([]);
  const next = useRef(600);

  useEffect(() => {
    // Seeded on the client so server and browser clocks never disagree.
    const start = Date.now() - 600 * 900;
    setLines(Array.from({ length: 600 }, (_, i) => make(i * 7919 + 13, i, start + i * 900)));
    const t = setInterval(() => {
      const n = 1 + (next.current % 3), base = next.current, now = Date.now();
      next.current += n;
      const add = Array.from({ length: n }, (_, k) => make((base + k) * 7919 + 13, base + k, now));
      setLines((ls) => [...ls, ...add].slice(-5000));
    }, 700);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#08090a]" : "bg-[#e9eae7]"}`}>
      <div className="mx-auto w-full max-w-[60rem]">
        <LogTail title="masar-api · production" lines={lines} theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
