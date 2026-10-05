"use client";
import { useState } from "react";
import { QueryCell, type QueryResult } from "./QueryCell";

const EXAMPLES = {
  stations: `-- Busiest stations in September\nSELECT station, count(*) AS rides, round(avg(minutes), 1) AS avg_minutes\nFROM rides\nWHERE started_at >= '2026-09-01'\nGROUP BY station\nORDER BY rides DESC\nLIMIT 6;`,
  hours: `SELECT date_part('hour', started_at) AS hour, count(*) AS rides\nFROM rides\nGROUP BY hour\nORDER BY hour;`,
  typo: `SELECT station, count(*) AS rides\nFORM rides\nGROUP BY station;`,
};

const RESULTS: Record<string, QueryResult> = {
  stations: { columns: [{ name: "station", type: "VARCHAR" }, { name: "rides", type: "BIGINT" }, { name: "avg_minutes", type: "DOUBLE" }], rows: [["Mutrah Corniche", 4812, 18.4], ["Qurum Beach", 3977, 22.1], ["Al Mouj Marina", 3120, 14.9], ["Ruwi Centre", 2264, 9.7], ["Seeb Souq", 1508, 11.2], ["Bawshar Dunes", 412, null]] },
  hours: { columns: [{ name: "hour", type: "BIGINT" }, { name: "rides", type: "BIGINT" }], rows: Array.from({ length: 24 }, (_, h) => [h, Math.round(120 + 900 * Math.exp(-((h - 18) ** 2) / 8) + 520 * Math.exp(-((h - 7.5) ** 2) / 3))]) },
};

const normal = (s: string) => s.replace(/--[^\n]*/g, "").replace(/\s+/g, " ").replace(/;\s*$/, "").trim().toLowerCase();

// Simulated engine: it recognises the example queries and reports real-looking parser errors; nothing else runs.
function run(sql: string, signal: AbortSignal) {
  return new Promise<QueryResult>((resolve, reject) => {
    const timer = setTimeout(() => {
      const lines = sql.split("\n");
      const bad = lines.findIndex((l) => /\bform\b/i.test(l.replace(/--.*$/, "")));
      if (bad >= 0) {
        const col = lines[bad].search(/\bform\b/i);
        return reject(Object.assign(new Error(`Parser Error: syntax error at or near "FORM"\n\nLINE ${bad + 1}: ${lines[bad]}\n${" ".repeat(9 + String(bad + 1).length + col)}^`), { line: bad + 1 }));
      }
      const key = (Object.keys(EXAMPLES) as (keyof typeof EXAMPLES)[]).find((k) => normal(EXAMPLES[k]) === normal(sql));
      if (key && RESULTS[key]) resolve(RESULTS[key]);
      else reject(new Error("Catalog Error: this demo engine only runs the example queries above."));
    }, 380 + Math.random() * 320);
    signal.addEventListener("abort", () => { clearTimeout(timer); reject(new DOMException("Aborted", "AbortError")); });
  });
}

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const [example, setExample] = useState<keyof typeof EXAMPLES>("stations");
  const chip = `min-h-[34px] border-2 px-3 font-[family-name:DM_Mono,ui-monospace,monospace] text-[12px] uppercase tracking-[0.02em] ${dark ? "border-[#f4efea] text-[#f4efea]" : "border-[#383838] text-[#383838]"}`;
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-10 sm:px-8 ${dark ? "bg-[#1f1f1f]" : "bg-[#f4efea]"}`}>
      <div className="w-full max-w-[52rem]">
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Example queries">
          {(["stations", "hours", "typo"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={example === k} onClick={() => setExample(k)} className={`${chip} ${example === k ? "bg-[#ffde00] !text-[#383838]" : ""}`}>{k === "stations" ? "Busiest stations" : k === "hours" ? "Rides by hour" : "With a typo"}</button>
          ))}
        </div>
        <QueryCell key={example} defaultSql={EXAMPLES[example]} run={run} title="muscat_bikes.rides" theme={dark ? "dark" : "light"} locale="en-GB" />
      </div>
    </div>
  );
}
