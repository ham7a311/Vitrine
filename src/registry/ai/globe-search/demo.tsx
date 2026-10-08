"use client";
import { useEffect, useState } from "react";
import { Globe, GlobeSearch, type GlobeResult } from "./GlobeSearch";

const RESULTS: GlobeResult[] = [
  { title: "Nine cafés in Lisbon that welcome laptops", site: "slowdesk.com", place: { lat: 38.7, lon: -9.1 } },
  { title: "Where to work in Muscat when the office is too quiet", site: "gulfnotes.net", place: { lat: 23.6, lon: 58.4 } },
  { title: "Tokyo kissaten with power sockets, mapped", site: "kissa-map.jp", place: { lat: 35.7, lon: 139.7 } },
  { title: "Mexico City: coffee, wifi and a long table", site: "cdmx-desk.mx", place: { lat: 19.4, lon: -99.1 } },
  { title: "Berlin's best cafés for a full working day", site: "kiezkaffee.de", place: { lat: 52.5, lon: 13.4 } },
  { title: "Cape Town spots with views and fast internet", site: "capeworks.co.za", place: { lat: -33.9, lon: 18.4 } },
  { title: "Seoul study cafés, ranked by quiet", site: "hangang-desk.kr", place: { lat: 37.6, lon: 127.0 } },
  { title: "Buenos Aires cafés that won't rush you", site: "cafecito.ar", place: { lat: -34.6, lon: -58.4 } },
  { title: "Melbourne laneway cafés for remote workers", site: "laneway.au", place: { lat: -37.8, lon: 145.0 } },
  { title: "Istanbul: tea, wifi and a window seat", site: "cayevi.com.tr", place: { lat: 41.0, lon: 29.0 } },
  { title: "Montréal cafés with outlets at every table", site: "plateau-cafe.ca", place: { lat: 45.5, lon: -73.6 } },
  { title: "Bangkok co-working cafés open past midnight", site: "nightdesk.co.th", place: { lat: 13.8, lon: 100.5 } },
];
const QUERY = "cafés with fast wifi for remote work";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  const theme = light ? "light" : "dark";
  const [found, setFound] = useState(0);
  const [run, setRun] = useState(0);
  const done = found >= RESULTS.length;

  useEffect(() => {
    if (done) return;
    const id = window.setTimeout(() => setFound((f) => f + 1), found === 0 ? 900 : 420);
    return () => window.clearTimeout(id);
  }, [found, done, run]);

  const t = light
    ? { page: "bg-[#ecebe8] text-[#1a1a1a]", card: "border-[#e0dfdb] bg-white", bubble: "bg-[#ecebe8]", muted: "text-[#6b6b6b]", btn: "border-[#e0dfdb] hover:bg-[#f2f1ee]" }
    : { page: "bg-[#0b0b0b] text-[#ececec]", card: "border-[#1f1f1f] bg-[#131313]", bubble: "bg-[#262626]", muted: "text-[#8c8c8c]", btn: "border-[#2a2a2a] hover:bg-[#1c1c1c]" };

  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${t.page}`} style={{ fontFamily: '"Inter", "Hanken Grotesk Variable", "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif' }}>
      <div className="grid w-full max-w-[40rem] gap-4">
        <div className={`grid gap-4 rounded-2xl border p-5 ${t.card}`}>
          <p className={`max-w-[85%] justify-self-end rounded-2xl px-4 py-2.5 text-[15px] ${t.bubble}`}>Find me somewhere good to work from, anywhere I might travel this year.</p>
          <GlobeSearch key={run} query={QUERY} results={RESULTS} found={found} state={done ? "done" : "searching"} theme={theme} />
        </div>
        <div className={`flex items-center gap-5 rounded-2xl border p-5 ${t.card}`}>
          <Globe size={64} theme={theme} spinning={!done} pings={RESULTS.slice(0, found).map((r) => r.place)} settle={done ? RESULTS[found - 1]?.place : undefined} />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium">{done ? `${RESULTS.length} places found` : "Looking around the world"}</p>
            <p className={`text-[13px] ${t.muted}`}>The same globe at 64px: every result lands where it came from.</p>
          </div>
          <button type="button" disabled={!done} onClick={() => { setFound(0); setRun((r) => r + 1); }} className={`h-9 shrink-0 rounded-lg border px-3 text-[13px] font-medium disabled:opacity-40 ${t.btn}`}>
            Search again
          </button>
        </div>
      </div>
    </div>
  );
}
