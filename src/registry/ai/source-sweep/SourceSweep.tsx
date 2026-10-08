"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { SOURCES, summary, type SourceId } from "./sources";
import "./source-sweep.css";

/**
 * Source Sweep
 * An assistant searching several places at once — Google, Notion, Reddit, GitHub, Wikipedia — shown as a
 * row of their marks. The one being searched has three dots circling it; each then settles to what it
 * found, or says it found nothing. When every source is done the line becomes a summary that opens the
 * results, grouped by where they came from.
 */

export type SweepResult = { title: string; meta: string };
export type SourceRun = {
  id: SourceId;
  status: "waiting" | "searching" | "done";
  found?: number;
  results?: SweepResult[];
};

export type SourceSweepProps = {
  query: string;
  runs: SourceRun[];
  theme?: "dark" | "light";
  className?: string;
};

function Mark({ id, light }: { id: SourceId; light: boolean }) {
  const s = SOURCES[id];
  return (
    <svg viewBox="0 0 24 24" className="srsw__icon" style={{ color: s.tint[light ? 1 : 0] }} aria-hidden="true">
      <path d={s.path} />
    </svg>
  );
}

export function SourceSweep({ query, runs, theme = "dark", className = "" }: SourceSweepProps) {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const light = theme === "light";
  const sum = summary(runs);

  /* Nothing circles where nobody can see it. */
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let onScreen = true;
    const sync = () => setPaused(!onScreen || document.hidden);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  useEffect(() => { if (!sum.all) setOpen(false); }, [sum.all]);

  const now = runs.find((r) => r.status === "searching");

  return (
    <div ref={root} className={`srsw srsw--${theme} ${className}`} data-done={sum.all || undefined} data-paused={paused || undefined}>
      <p className="srsw__head">
        <span className="srsw__verb">{sum.all ? "Searched for" : "Searching for"}</span>
        <span className="srsw__query">{query}</span>
      </p>

      <ul className="srsw__row" aria-label="Sources">
        {runs.map((r) => {
          const s = SOURCES[r.id];
          const none = r.status === "done" && !r.found;
          return (
            <li key={r.id} className="srsw__src" data-status={r.status} data-none={none || undefined}>
              <span className="srsw__mark">
                <Mark id={r.id} light={light} />
                {r.status === "searching" && (
                  <span className="srsw__orbit" aria-hidden="true">
                    {[0, 1, 2].map((i) => <i key={i} style={{ ["--i" as string]: i } as CSSProperties} />)}
                  </span>
                )}
                {r.status === "done" && !none && <b key="n" className="srsw__badge" aria-hidden="true">{r.found}</b>}
              </span>
              <span className="srsw__name">
                {s.name}
                <span className="srsw__sr">
                  {r.status === "waiting" ? ", waiting" : r.status === "searching" ? ", searching" : none ? ", nothing found" : `, ${r.found} found`}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="srsw__foot">
        {sum.all ? (
          <button type="button" className="srsw__sum" aria-expanded={open} aria-controls={`${uid}-list`} onClick={() => setOpen((o) => !o)}>
            {sum.text}
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" /></svg>
          </button>
        ) : (
          <span className="srsw__sum" data-live>
            {now ? <>Looking in <b key={now.id}>{SOURCES[now.id].name}</b></> : "Starting"}
            <span className="srsw__of"> · {runs.filter((r) => r.status === "done").length} of {runs.length}</span>
          </span>
        )}
      </div>

      {sum.all && open && (
        <div id={`${uid}-list`} className="srsw__list">
          {runs.map((r) => (
            <section key={r.id} className="srsw__group" aria-label={SOURCES[r.id].name}>
              <p className="srsw__gh">
                <span className="srsw__mark srsw__mark--sm"><Mark id={r.id} light={light} /></span>
                {SOURCES[r.id].name}
                <span className="srsw__gn">{r.found ? `${r.found} result${r.found === 1 ? "" : "s"}` : "nothing found"}</span>
              </p>
              {!!r.results?.length && (
                <ol>
                  {r.results.map((x, i) => (
                    <li key={i}>
                      <span className="srsw__title">{x.title}</span>
                      <span className="srsw__meta">{x.meta}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>
      )}

      <p className="srsw__sr" role="status" aria-live="polite">
        {sum.all ? `${sum.text}.` : now ? `Searching ${SOURCES[now.id].name} for ${query}.` : `Searching for ${query}.`}
      </p>
    </div>
  );
}
