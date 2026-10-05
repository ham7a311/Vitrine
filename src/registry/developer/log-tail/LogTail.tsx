"use client";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ago, compile, highlight, LEVELS, visible, windowOf, type Level, type LogLine } from "./log";
import "./log-tail.css";

export type { Level, LogLine } from "./log";
export type LogTailProps = {
  /** The buffer so far; append to it and the view follows. */
  lines: LogLine[];
  title?: string;
  /** Height of the scroll area in pixels. */
  height?: number;
  defaultLevels?: Level[];
  theme?: "light" | "dark";
  className?: string;
};

const ROW = 22;
const pad = (n: number, w = 2) => String(n).padStart(w, "0");
const clock = (t: number) => { const d = new Date(t); return <>{pad(d.getHours())}:{pad(d.getMinutes())}:{pad(d.getSeconds())}<small>.{pad(d.getMilliseconds(), 3)}</small></>; };

/**
 * Log Tail
 * A streaming log that follows new lines until you scroll up, then holds still
 * and counts what arrived. Level filters, pattern highlighting that never
 * throws on a bad regex, and only the rows on screen are rendered.
 */
export function LogTail({ lines, title = "Logs", height = 420, defaultLevels = ["info", "warn", "error"], theme = "light", className = "" }: LogTailProps) {
  const id = useId();
  const [levels, setLevels] = useState(() => new Set<Level>(defaultLevels));
  const [query, setQuery] = useState("");
  const [only, setOnly] = useState(false);
  const [relative, setRelative] = useState(false);
  const [follow, setFollow] = useState(true);
  const [seen, setSeen] = useState(-1);
  const [top, setTop] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const box = useRef<HTMLDivElement>(null);

  const pat = useMemo(() => compile(query), [query]);
  const shown = useMemo(() => visible(lines, levels, pat.re, only), [lines, levels, pat, only]);
  const counts = useMemo(() => Object.fromEntries(LEVELS.map((l) => [l, lines.filter((x) => x.level === l).length])) as Record<Level, number>, [lines]);
  const fresh = follow ? 0 : shown.filter((l) => l.id > seen).length;
  const lastId = shown[shown.length - 1]?.id ?? -1;

  useEffect(() => { if (!relative) return; const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [relative]);

  // Following: stay pinned to the bottom as lines arrive.
  useLayoutEffect(() => {
    const el = box.current;
    if (!el || !follow) return;
    el.scrollTop = el.scrollHeight;
    setTop(el.scrollTop);
    setSeen(lastId);
  }, [follow, lastId, shown.length]);

  const onScroll = () => {
    const el = box.current!;
    setTop(el.scrollTop);
    const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
    if (atEnd !== follow) setFollow(atEnd);
    if (!atEnd && follow) setSeen(lastId);
  };
  const jump = () => { setFollow(true); box.current?.scrollTo({ top: box.current.scrollHeight }); };
  const toggle = (l: Level) => setLevels((s) => { const n = new Set(s); if (n.has(l)) n.delete(l); else n.add(l); return n; });

  const { from, to } = windowOf(shown.length, top, height, ROW);
  const hits = pat.re ? shown.filter((l) => { pat.re!.lastIndex = 0; return pat.re!.test(l.msg); }).length : 0;

  return (
    <section className={`ltail ltail--${theme} ${className}`} aria-labelledby={`${id}-t`}>
      <header className="ltail__bar">
        <h3 id={`${id}-t`} className="ltail__title"><span className="ltail__live" data-on={follow || undefined} aria-hidden="true" />{title}</h3>
        <div className="ltail__levels" role="group" aria-label="Levels">
          {LEVELS.map((l) => (
            <button key={l} type="button" className={`ltail__lvl ltail__lvl--${l}`} aria-pressed={levels.has(l)} onClick={() => toggle(l)}>{l}<span>{counts[l]}</span></button>
          ))}
        </div>
        <label className="ltail__search">
          <span className="ltail__sr">Highlight pattern (regular expression)</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="/pattern/" spellCheck={false} aria-invalid={!!pat.error || undefined} aria-describedby={`${id}-e`} />
        </label>
        <label className="ltail__check"><input type="checkbox" checked={only} onChange={(e) => setOnly(e.target.checked)} />Only matches</label>
        <button type="button" className="ltail__time" aria-pressed={relative} onClick={() => { setNow(Date.now()); setRelative((r) => !r); }}>{relative ? "Relative" : "Clock"}</button>
      </header>
      <p id={`${id}-e`} className="ltail__err" aria-live="polite">{pat.error ?? (query ? `${hits} matching ${hits === 1 ? "line" : "lines"}` : "")}</p>

      <div className="ltail__body">
        <div ref={box} className="ltail__scroll" style={{ height }} onScroll={onScroll} role="log" aria-live="off" aria-label={`${title}, ${shown.length} lines shown`} tabIndex={0}>
          <div style={{ height: shown.length * ROW, position: "relative" }}>
            {shown.slice(from, to).map((l, k) => (
              <div key={l.id} className={`ltail__line ltail__line--${l.level}`} style={{ top: (from + k) * ROW }} data-new={(!follow && l.id > seen) || undefined}>
                <time dateTime={new Date(l.t).toISOString()}>{relative ? ago(l.t, now) : clock(l.t)}</time>
                <b>{l.level.toUpperCase()}</b>
                {l.source && <i>{l.source}</i>}
                <span>{highlight(l.msg, pat.re).map((p, j) => (p.hit ? <mark key={j}>{p.text}</mark> : p.text))}</span>
              </div>
            ))}
          </div>
          {!shown.length && <p className="ltail__none">{lines.length ? "No lines match these filters." : "Waiting for lines…"}</p>}
        </div>
        {!follow && (
          <button type="button" className="ltail__new" onClick={jump}>
            {fresh ? `${fresh} new` : "Follow"} <span aria-hidden="true">↓</span>
          </button>
        )}
      </div>
      <p className="ltail__foot" aria-live="polite">{follow ? "Following new lines" : `Paused at line ${Math.min(shown.length, Math.floor(top / ROW) + 1)} of ${shown.length}. Scroll to the end to follow again.`}</p>
    </section>
  );
}
