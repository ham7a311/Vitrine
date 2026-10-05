"use client";
import { useEffect, useId, useMemo, useState } from "react";
import { FIELDS, describe, next, parse } from "./cron";
import "./cron-builder.css";

export type CronBuilderProps = {
  defaultValue?: string;
  /** Called with every valid expression. */
  onChange?: (cron: string) => void;
  timeZone?: string;
  label?: string;
  locale?: string;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

type Mode = "minutes" | "hourly" | "daily" | "weekdays" | "weekly" | "monthly" | "custom";
type Simple = { mode: Mode; every: number; minute: number; hour: number; days: number[]; dom: number };
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const pad = (n: number) => String(n).padStart(2, "0");

function toCron(s: Simple): string {
  switch (s.mode) {
    case "minutes": return `*/${s.every} * * * *`;
    case "hourly": return `${s.minute} * * * *`;
    case "daily": return `${s.minute} ${s.hour} * * *`;
    case "weekdays": return `${s.minute} ${s.hour} * * 1-5`;
    case "weekly": return `${s.minute} ${s.hour} * * ${s.days.length ? s.days.join(",") : "1"}`;
    case "monthly": return `${s.minute} ${s.hour} ${s.dom} * *`;
    default: return "";
  }
}
// Read an expression back into the builder when it has one of the simple shapes.
function fromCron(text: string, prev: Simple): Simple {
  const p = text.trim().split(/\s+/);
  const base = { ...prev, mode: "custom" as Mode };
  if (p.length !== 5 || !parse(text).ok) return base;
  const [mi, h, dom, mon, dow] = p;
  const n = (x: string) => /^\d+$/.test(x);
  if (/^\*\/\d+$/.test(mi) && h === "*" && dom === "*" && mon === "*" && dow === "*") return { ...prev, mode: "minutes", every: Number(mi.slice(2)) };
  if (mon !== "*" || !n(mi)) return base;
  const minute = Number(mi);
  if (h === "*" && dom === "*" && dow === "*") return { ...prev, mode: "hourly", minute };
  if (!n(h)) return base;
  const hour = Number(h);
  if (dom === "*" && dow === "*") return { ...prev, mode: "daily", minute, hour };
  if (dom === "*" && dow === "1-5") return { ...prev, mode: "weekdays", minute, hour };
  if (dom === "*" && /^\d(,\d)*$/.test(dow)) return { ...prev, mode: "weekly", minute, hour, days: dow.split(",").map(Number).map((d) => (d === 7 ? 0 : d)).sort() };
  if (n(dom) && dow === "*") return { ...prev, mode: "monthly", minute, hour, dom: Number(dom) };
  return base;
}

/**
 * Cron Builder
 * One schedule in three linked forms: a sentence you build from menus, the
 * cron expression itself with each field labelled, and the next runs laid out
 * across the coming two weeks. Edit any of them and the others follow.
 */
export function CronBuilder({ defaultValue = "15 9 * * 1-5", onChange, timeZone = "UTC", label = "Schedule", locale, theme = "light", motion = true, className = "" }: CronBuilderProps) {
  const id = useId();
  const [text, setText] = useState(defaultValue);
  const [simple, setSimple] = useState<Simple>(() => fromCron(defaultValue, { mode: "daily", every: 15, minute: 0, hour: 9, days: [1], dom: 1 }));
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 60_000); return () => clearInterval(t); }, []);

  const parsed = useMemo(() => parse(text), [text]);
  const runs = useMemo(() => (parsed.ok && now !== null ? next(parsed.cron, now, 8, timeZone) : []), [parsed, now, timeZone]);
  const strip = useMemo(() => (parsed.ok && now !== null ? next(parsed.cron, now, 700, timeZone, now + 14 * 86_400_000) : []), [parsed, now, timeZone]);

  const fmtDay = useMemo(() => new Intl.DateTimeFormat(locale, { timeZone, weekday: "short", day: "numeric", month: "short" }), [locale, timeZone]);
  const fmtDayYear = useMemo(() => new Intl.DateTimeFormat(locale, { timeZone, weekday: "short", day: "numeric", month: "short", year: "numeric" }), [locale, timeZone]);
  const fmtTime = useMemo(() => new Intl.DateTimeFormat(locale, { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }), [locale, timeZone]);
  const keyOf = useMemo(() => new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }), [timeZone]);
  const minutesOf = (t: number) => { const [h, m] = fmtTime.format(t).split(":").map(Number); return h * 60 + m; };

  const setFromText = (v: string) => {
    setText(v);
    setSimple((s) => fromCron(v, s));
    if (parse(v).ok) onChange?.(v.trim());
  };
  const setFromSimple = (patch: Partial<Simple>) => {
    const s = { ...simple, ...patch };
    setSimple(s);
    const c = toCron(s);
    if (c) { setText(c); onChange?.(c); }
  };

  const tokens = text.trim().split(/\s+/);
  const badFields = new Set(parsed.ok ? [] : parsed.errors.map((e) => e.field));
  const rel = (t: number) => {
    if (now === null) return "";
    const m = Math.round((t - now) / 60000);
    if (m < 60) return `in ${m} min`;
    if (m < 60 * 24) return `in ${Math.floor(m / 60)} h ${m % 60 ? `${m % 60} min` : ""}`.trim();
    return `in ${Math.round(m / 1440)} days`;
  };
  const days = now === null ? [] : Array.from({ length: 14 }, (_, i) => now + i * 86_400_000);
  const perDay = new Map<string, number[]>();
  for (const t of strip) { const k = keyOf.format(t); perDay.set(k, [...(perDay.get(k) ?? []), minutesOf(t)]); }

  return (
    <section className={`cronb cronb--${theme} ${className}`} data-motion={motion ? undefined : "off"} aria-labelledby={`${id}-t`}>
      <header className="cronb__head">
        <h3 id={`${id}-t`} className="cronb__title">{label}</h3>
        <p className="cronb__tz">Times in {timeZone.replace(/_/g, " ")}</p>
      </header>

      <div className="cronb__builder" role="group" aria-label="Build the schedule">
        <label className="cronb__ctl">
          <span>Runs</span>
          <select value={simple.mode} onChange={(e) => { const mode = e.target.value as Mode; if (mode === "custom") setSimple((s) => ({ ...s, mode })); else setFromSimple({ mode }); }}>
            <option value="minutes">Every few minutes</option>
            <option value="hourly">Every hour</option>
            <option value="daily">Every day</option>
            <option value="weekdays">Every weekday</option>
            <option value="weekly">On chosen days</option>
            <option value="monthly">Once a month</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        {simple.mode === "minutes" && (
          <label className="cronb__ctl"><span>Every</span>
            <select value={simple.every} onChange={(e) => setFromSimple({ every: Number(e.target.value) })}>
              {[5, 10, 15, 20, 30].map((n) => <option key={n} value={n}>{n} minutes</option>)}
            </select>
          </label>
        )}
        {simple.mode === "hourly" && (
          <label className="cronb__ctl"><span>At minute</span>
            <select value={simple.minute} onChange={(e) => setFromSimple({ minute: Number(e.target.value) })}>
              {Array.from({ length: 12 }, (_, i) => i * 5).map((n) => <option key={n} value={n}>:{pad(n)}</option>)}
            </select>
          </label>
        )}
        {simple.mode === "monthly" && (
          <label className="cronb__ctl"><span>On day</span>
            <select value={simple.dom} onChange={(e) => setFromSimple({ dom: Number(e.target.value) })}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        )}
        {["daily", "weekdays", "weekly", "monthly"].includes(simple.mode) && (
          <label className="cronb__ctl"><span>At</span>
            <input type="time" value={`${pad(simple.hour)}:${pad(simple.minute)}`} onChange={(e) => { const [h, m] = e.target.value.split(":").map(Number); if (Number.isFinite(h) && Number.isFinite(m)) setFromSimple({ hour: h, minute: m }); }} />
          </label>
        )}
        {simple.mode === "weekly" && (
          <div className="cronb__days" role="group" aria-label="Days">
            {DAYS.map((d, i) => (
              <button key={i} type="button" aria-pressed={simple.days.includes(i)} aria-label={DAY_NAMES[i]}
                onClick={() => { const set = simple.days.includes(i) ? simple.days.filter((x) => x !== i) : [...simple.days, i].sort(); if (set.length) setFromSimple({ days: set }); }}>{d}</button>
            ))}
          </div>
        )}
        {simple.mode === "custom" && <p className="cronb__custom">A custom schedule. Edit the expression below.</p>}
      </div>

      <p className="cronb__sentence" aria-live="polite">{parsed.ok ? describe(parsed.cron) : "This expression doesn't run."}</p>

      <div className="cronb__expr">
        <label htmlFor={`${id}-x`} className="cronb__sr">Cron expression</label>
        <input id={`${id}-x`} className="cronb__input" value={text} spellCheck={false} autoComplete="off" onChange={(e) => setFromText(e.target.value)} aria-invalid={!parsed.ok || undefined} aria-describedby={`${id}-e`} />
        <ol className="cronb__fields" aria-hidden="true">
          {FIELDS.map((f, i) => <li key={f.name} data-bad={badFields.has(f.name) || badFields.has("all") || undefined}><code>{tokens[i] ?? "·"}</code><span>{f.label}</span></li>)}
        </ol>
        <p id={`${id}-e`} className="cronb__error" role={parsed.ok ? undefined : "alert"}>{parsed.ok ? "" : parsed.errors.map((e) => e.message).join(" ")}</p>
      </div>

      <div className="cronb__runs">
        <h4 className="cronb__sub">Next two weeks <span>{strip.length >= 700 ? "700+" : strip.length} runs</span></h4>
        <div className="cronb__strip" aria-hidden="true">
          {days.map((t) => {
            const k = keyOf.format(t), ms = perDay.get(k) ?? [];
            return (
              <div key={k} className="cronb__day" data-busy={ms.length > 48 || undefined}>
                <span className="cronb__track">{ms.length <= 48 && ms.map((m, i) => <i key={i} style={{ top: `${(m / 1440) * 100}%` }} />)}</span>
                <span className="cronb__day-name">{fmtDay.format(t).split(",")[0]}</span>
              </div>
            );
          })}
        </div>
        <ol className="cronb__list">
          {runs.map((t) => <li key={t}><span>{(now !== null && new Date(t).getUTCFullYear() !== new Date(now).getUTCFullYear() ? fmtDayYear : fmtDay).format(t)}</span><strong>{fmtTime.format(t)}</strong><em>{rel(t)}</em></li>)}
          {parsed.ok && now !== null && runs.length === 0 && <li className="cronb__none">No run in the next six years.</li>}
        </ol>
      </div>
    </section>
  );
}
