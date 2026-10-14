"use client";
import { ThreadMap } from "./ThreadMap";
import type { Turn } from "./map";

const TURNS: Turn[] = [
  { id: "1", role: "user", text: "Our weather app hits the forecast API on every screen. Can we cache it without serving stale data during storms?" },
  { id: "2", role: "assistant", text: "Yes — cache per location with a short lifetime, and let severe-weather alerts bypass it. Here's the shape of the cache entry:", code: "type Entry = {\n  forecast: Forecast\n  fetchedAt: number\n  ttl: number // seconds\n}" },
  { id: "3", role: "user", text: "How short is short? Most people check twice a morning." },
  { id: "4", role: "assistant", text: "Fifteen minutes is a good default: forecasts upstream refresh every hour, so you'd serve at most a quarter-hour-old answer while cutting requests by about 80%.", tool: "Read api/usage.csv · 41,280 calls last week" },
  { id: "5", role: "user", text: "And storms?" },
  { id: "6", role: "assistant", text: "Shorten the lifetime when the forecast itself says things are changing — when there's an active alert or the precipitation chance jumps.", code: "function ttlFor(f: Forecast) {\n  if (f.alerts.length) return 0\n  if (f.precipChance > 0.6) return 300\n  return 900\n}" },
  { id: "7", role: "user", text: "Nice. Where should the cache live, memory or disk?" },
  { id: "8", role: "assistant", text: "Both: memory for the session, and disk so a cold start can show the last forecast instantly while it refreshes in the background. Mark the screen as 'updating' until the fresh one lands." },
  { id: "9", role: "user", text: "Can you write the read path?" },
  { id: "10", role: "assistant", text: "Here's a read-through cache that returns the stored entry straight away and revalidates when it's past its lifetime:", code: "async function forecast(loc: Loc) {\n  const hit = memory.get(loc.key) ?? (await disk.get(loc.key))\n  if (hit && Date.now() - hit.fetchedAt < hit.ttl * 1000) return hit.forecast\n  const fresh = await api.forecast(loc)\n  const entry = { forecast: fresh, fetchedAt: Date.now(), ttl: ttlFor(fresh) }\n  memory.set(loc.key, entry); await disk.set(loc.key, entry)\n  return fresh\n}" },
  { id: "11", role: "user", text: "Run the tests against it?" },
  { id: "12", role: "assistant", text: "Done. Two failures were the old tests expecting a network call on every read; I updated them to assert the cache hit instead.", tool: "Ran npm test · 58 passed, 2 updated" },
  { id: "13", role: "user", text: "What about when the user changes location quickly, like on a train?" },
  { id: "14", role: "assistant", text: "Round the coordinates to about a kilometre for the cache key, so nearby points share an entry, and cancel any request for a location the user has already moved past." },
  { id: "15", role: "user", text: "Perfect. Summarise the storm rules for the release notes." },
  { id: "16", role: "assistant", text: "Forecasts are cached for 15 minutes, 5 when rain is likely, and never while a severe-weather alert is active — so storms always show live data." },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "24px 16px", background: night ? "#0b0b0d" : "#ece9e2" }}>
      <ThreadMap title="Caching the forecast" turns={TURNS} theme={night ? "night" : "paper"} />
    </div>
  );
}
