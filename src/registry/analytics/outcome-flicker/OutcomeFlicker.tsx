"use client";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { DEADLINE, OPTIONS, QUESTION, RUNS, inTen, onTime, simulate, tally, type Option } from "./draws";
import "./outcome-flicker.css";

/**
 * Outcome Flicker
 * A forecast shown as outcomes you can count, not a range you have to decode. Each frame is one possible
 * future — "run 37: ready Thursday" — and a tally fills underneath until the share that made it is
 * plain to see. It never moves on its own: it starts paused, steps in discrete frames, and a summary
 * view lays every run out at once.
 */

export type OutcomeFlickerProps = {
  options?: Option[];
  question?: string;
  seed?: number;
  theme?: "dark" | "light";
  className?: string;
};

const STEP = 450;
const MAX_DAY = 10;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Tue", "Wed", "Thu", "Fri"];
const dayName = (d: number) => {
  const i = Math.min(DAYS.length - 1, Math.max(0, Math.ceil(d) - 1));
  return `${i >= 5 ? "next " : ""}${DAYS[i]}`;
};
const nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 });

const I = {
  play: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" /></svg>,
  pause: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 3.5v9m5-9v9" /></svg>,
  step: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 3.5v9l6-4.5zM12 3.5v9" /></svg>,
  back: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12 3.5v9L6 8zM4 3.5v9" /></svg>,
  reset: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3M3.5 3v2.5H6" /></svg>,
};

export function OutcomeFlicker({ options = OPTIONS, question = QUESTION, seed = 7, theme = "dark", className = "" }: OutcomeFlickerProps) {
  const uid = useId();
  const runs = useMemo(() => options.map((o, i) => simulate(o, seed * 31 + i * 101)), [options, seed]);
  const [opt, setOpt] = useState(0);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState<"frames" | "summary">("frames");
  const [reduce, setReduce] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [tabHidden, setTabHidden] = useState(false);
  const [say, setSay] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const days = runs[opt];
  const summary = view === "summary" || reduce;
  const t = tally(days, frame);
  const cur = frame > 0 ? days[frame - 1] : null;

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduce(m.matches);
    set();
    m.addEventListener?.("change", set);
    return () => m.removeEventListener?.("change", set);
  }, []);

  /* Never animate where nobody is looking. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    const vis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, []);

  const running = playing && !summary && onScreen && !tabHidden && frame < RUNS;
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setFrame((f) => f + 1), STEP);
    return () => window.clearTimeout(id);
  }, [running, frame]);
  useEffect(() => {
    if (playing && frame >= RUNS) {
      setPlaying(false);
      const all = tally(days);
      setSay(`All ${RUNS} runs shown: ${all.yes} on time.`);
    }
  }, [playing, frame, days]);

  const choose = (i: number) => {
    setOpt(i);
    setFrame(0);
    setPlaying(false);
    const all = tally(runs[i]);
    setSay(`${options[i].name}. ${summary ? `On time in ${all.yes} of ${RUNS} runs.` : "Paused at the start."}`);
  };
  const step = (d: 1 | -1) => {
    setPlaying(false);
    const n = Math.max(0, Math.min(RUNS, frame + d));
    setFrame(n);
    setSay(n > 0 ? `Run ${n}: ready ${dayName(days[n - 1])}, ${onTime(days[n - 1]) ? "on time" : "late"}. ${tally(days, n).yes} of ${n} on time so far.` : "Back to the start.");
  };
  const toggle = () => {
    if (frame >= RUNS) setFrame(0);
    setPlaying((p) => !p);
    setSay(playing ? `Paused. ${t.yes} of ${t.seen} on time so far.` : "Playing.");
  };
  const onKey = (e: KeyboardEvent) => {
    if (summary || (e.target as HTMLElement).closest("[role=radiogroup]")) return;
    if (e.key === " " && (e.target as HTMLElement).tagName !== "BUTTON") { e.preventDefault(); toggle(); }
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  };

  const x = (d: number) => `${(Math.min(d, MAX_DAY) / MAX_DAY) * 100}%`;

  return (
    <div ref={rootRef} className={`otfl otfl--${theme} ${className}`} data-view={summary ? "summary" : "frames"} onKeyDown={onKey}>
      <div className="otfl__card">
        <header className="otfl__head">
          <div>
            <span className="otfl__label">Forecast · {RUNS} simulated runs</span>
            <h3 id={`${uid}-q`}>{question}</h3>
          </div>
          <div className="otfl__views" role="radiogroup" aria-label="View">
            {(["frames", "summary"] as const).map((v) => (
              <button key={v} type="button" role="radio" aria-checked={(summary ? "summary" : "frames") === v} disabled={reduce && v === "frames"} onClick={() => { setView(v); setPlaying(false); }}>
                {v === "frames" ? "One run at a time" : "All runs"}
              </button>
            ))}
          </div>
        </header>

        <div className="otfl__opts" role="radiogroup" aria-label="Option">
          {options.map((o, i) => {
            const all = tally(runs[i]);
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={i === opt}
                className="otfl__opt"
                onClick={() => choose(i)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  e.preventDefault();
                  const n = (i + (e.key === "ArrowRight" ? 1 : -1) + options.length) % options.length;
                  choose(n);
                  (e.currentTarget.parentElement!.children[n] as HTMLElement).focus();
                }}
                tabIndex={i === opt ? 0 : -1}
              >
                <b>{o.name}</b>
                <span>{o.note}</span>
                {summary && <em>{all.pct}%</em>}
              </button>
            );
          })}
        </div>

        {summary ? (
          /* ---------- every run at once ---------- */
          <div className="otfl__sum">
            {options.map((o, i) => {
              const all = tally(runs[i]);
              return (
                <figure key={o.id} className="otfl__strip" data-on={i === opt || undefined}>
                  <figcaption>
                    <b>{o.name}</b>
                    <span>on time in <strong>{all.yes}</strong> of {RUNS} runs · about {inTen(all.pct)}</span>
                  </figcaption>
                  <div className="otfl__dots" role="img" aria-label={`${o.name}: ${all.yes} of ${RUNS} runs ready by Friday`}>
                    <i className="otfl__late" style={{ left: x(DEADLINE) }} />
                    {runs[i].map((d, k) => (
                      <b key={k} data-ok={onTime(d) || undefined} style={{ left: x(d), top: `${12 + ((k * 37) % 19) * 4}%` }} />
                    ))}
                  </div>
                </figure>
              );
            })}
            <Axis />
          </div>
        ) : (
          /* ---------- one run at a time ---------- */
          <div className="otfl__frames">
            <div className="otfl__now" aria-hidden="true">
              <span className="otfl__runno">{cur == null ? "—" : `Run ${frame}`}</span>
              <span className="otfl__result" data-ok={cur == null ? undefined : onTime(cur)} key={frame}>
                {cur == null ? "Press play, or step through the runs" : <>Ready {dayName(cur)} <small>{nf.format(cur)} days</small> · {onTime(cur) ? "on time" : "late"}</>}
              </span>
            </div>
            <div className="otfl__track" aria-hidden="true">
              <i className="otfl__late" style={{ left: x(DEADLINE) }} />
              <i className="otfl__deadline" style={{ left: x(DEADLINE) }}><span>Friday</span></i>
              {cur != null && <i className="otfl__mark" data-ok={onTime(cur) || undefined} style={{ left: x(cur) }} key={frame} />}
            </div>
            <Axis />

            <div className="otfl__tally" aria-hidden="true">
              {days.map((d, k) => (
                <i key={k} data-s={k >= frame ? undefined : onTime(d) ? "yes" : "no"} data-cur={k === frame - 1 || undefined} />
              ))}
            </div>
            <p className="otfl__count">
              {frame === 0 ? (
                <>Nothing counted yet. Each run is one way next week could go.</>
              ) : (
                <><b>{t.yes}</b> of {t.seen} runs on time<span> · {t.no} late{frame >= 20 && ` · about ${inTen(t.pct)} so far`}</span></>
              )}
            </p>

            <div className="otfl__ctl">
              <button type="button" className="otfl__btn" aria-label="Previous run" disabled={frame === 0} onClick={() => step(-1)}>{I.back}</button>
              <button type="button" className="otfl__btn" data-k="go" aria-label={playing ? "Pause" : frame >= RUNS ? "Replay" : "Play"} onClick={toggle}>
                {playing ? I.pause : I.play}
                <span>{playing ? "Pause" : frame >= RUNS ? "Replay" : "Play"}</span>
              </button>
              <button type="button" className="otfl__btn" aria-label="Next run" disabled={frame >= RUNS} onClick={() => step(1)}>{I.step}</button>
              <button type="button" className="otfl__btn" aria-label="Back to the start" disabled={frame === 0} onClick={() => { setPlaying(false); setFrame(0); setSay("Back to the start."); }}>{I.reset}</button>
              <span className="otfl__keys" aria-hidden="true"><kbd>←</kbd><kbd>→</kbd> step · <kbd>Space</kbd> play</span>
            </div>
          </div>
        )}
      </div>
      <p className="otfl__sr" role="status" aria-live="polite">{say}</p>
    </div>
  );
}

function Axis() {
  return (
    <div className="otfl__axis" aria-hidden="true">
      {DAYS.map((d, i) => (
        <span key={i} style={{ left: `${((i + 0.5) / MAX_DAY) * 100}%` }} data-next={i >= 5 || undefined}>{d}</span>
      ))}
    </div>
  );
}
