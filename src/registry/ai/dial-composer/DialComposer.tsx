"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import { EFFORT_HINT, EFFORT_LABEL, FILES, MODELS, MODES, fileName, fmt, usage, type ModeId, type ModelId } from "./brief";
import { angleAt, arc, clampAngle, detents, nearest, polar, SWEEP } from "./dial";
import { MakerLogo, ModeIcon } from "./logos";
import "./dial-composer.css";

/**
 * Dial Composer
 * One control sets everything. The dial has four rings — mode, model, effort, context — and you turn it
 * through whichever ring is selected; its face changes to show what it's set on. The prompt sits above,
 * the four settings read out beside it, and turning is the whole interaction.
 */

type Ring = "mode" | "model" | "effort" | "context";
const RINGS: Ring[] = ["mode", "model", "effort", "context"];
const RING_NAME: Record<Ring, string> = { mode: "Mode", model: "Model", effort: "Effort", context: "Context" };

/** Context is a breadth, not a file picker: how much of the repo the agent may read. */
const SCOPES = [
  { id: "none", name: "Message only", short: "None", files: [] as string[] },
  { id: "mentioned", name: "Mentioned files", short: "Mentioned", files: ["exporter/retry.ts", "exporter/invoice-export.ts"] },
  { id: "folder", name: "exporter/ folder", short: "Folder", files: ["exporter/retry.ts", "exporter/invoice-export.ts", "exporter/csv-writer.ts"] },
  { id: "repo", name: "Whole repo", short: "Repo", files: FILES.map((f) => f.path) },
];

export type DialBrief = { text: string; mode: ModeId; model: ModelId; effort: number; files: string[] };

export type DialComposerProps = {
  defaultMode?: ModeId;
  defaultModel?: ModelId;
  defaultEffort?: number;
  defaultScope?: number;
  placeholder?: string;
  onSend?: (brief: DialBrief) => void;
  theme?: "dark" | "light";
  className?: string;
};

const C = 120, TRACK = 92, LABEL = 108;

export function DialComposer({ defaultMode = "agent", defaultModel = "opus", defaultEffort = 2, defaultScope = 1, placeholder = "Describe a task, then turn the dial to set how it runs", onSend, theme = "dark", className = "" }: DialComposerProps) {
  const uid = useId();
  const [ring, setRing] = useState<Ring>("mode");
  const [vals, setVals] = useState<Record<Ring, number>>({
    mode: Math.max(0, MODES.findIndex((m) => m.id === defaultMode)),
    model: Math.max(0, MODELS.findIndex((m) => m.id === defaultModel)),
    effort: defaultEffort,
    context: defaultScope,
  });
  const [live, setLive] = useState<number | null>(null); // knob angle while dragging
  const [text, setText] = useState("");
  const [run, setRun] = useState<{ state: "running" | "done"; label: string } | null>(null);
  const [say, setSay] = useState("");
  const svg = useRef<SVGSVGElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const acc = useRef(0);

  const M = MODES[vals.mode], Mo = MODELS[vals.model], S = SCOPES[vals.context];
  const use = usage(S.files, vals.effort, Mo);
  const pct = Math.round(use.pct * 100);
  const count = { mode: MODES.length, model: MODELS.length, effort: EFFORT_LABEL.length, context: SCOPES.length }[ring];
  const value = vals[ring];
  const angles = detents(count);
  const angle = live ?? angles[value];

  const describe = (r: Ring, v = vals[r]) =>
    r === "mode" ? `${MODES[v].name}. ${MODES[v].does}` : r === "model" ? MODELS[v].name : r === "effort" ? `${EFFORT_LABEL[v]}. ${EFFORT_HINT[v]}` : `${SCOPES[v].name}, ${fmt(usage(SCOPES[v].files, vals.effort, Mo).files)} tokens of files`;

  const set = (r: Ring, v: number) => {
    const n = { mode: MODES.length, model: MODELS.length, effort: EFFORT_LABEL.length, context: SCOPES.length }[r];
    const to = Math.max(0, Math.min(n - 1, v));
    if (to === vals[r]) return;
    setVals((x) => ({ ...x, [r]: to }));
    setSay(`${RING_NAME[r]}: ${describe(r, to)}`);
    // A detent: the knob gives a small click.
    knob.current?.animate?.([{ transform: "scale(1)" }, { transform: "scale(0.975)" }, { transform: "scale(1)" }], { duration: 140, easing: "ease-out" });
  };
  const pickRing = (r: Ring) => {
    setRing(r);
    setSay(`Dial set to ${RING_NAME[r]}: ${describe(r)}`);
  };

  /* ---------- turning: drag, wheel, keys ---------- */
  const fromPointer = (e: RPointerEvent<SVGSVGElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    return clampAngle(angleAt(b.left + b.width / 2, b.top + b.height / 2, e.clientX, e.clientY));
  };
  const down = (e: RPointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    (e.currentTarget as unknown as HTMLElement).focus?.();
    const a = fromPointer(e);
    setLive(a);
    set(ring, nearest(a, count));
  };
  const move = (e: RPointerEvent<SVGSVGElement>) => {
    if (live === null) return;
    const a = fromPointer(e);
    setLive(a);
    set(ring, nearest(a, count));
  };
  const up = () => setLive(null);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      // Trackpads send many small deltas: gather them so one notch is one detent.
      acc.current += e.deltaY;
      if (Math.abs(acc.current) < 36) return;
      const step = acc.current > 0 ? 1 : -1;
      acc.current = 0;
      set(ring, vals[ring] + step);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  });

  const key = (e: KeyboardEvent<SVGSVGElement>) => {
    const i = RINGS.indexOf(ring);
    if (e.key === "ArrowRight") { e.preventDefault(); set(ring, value + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); set(ring, value - 1); }
    else if (e.key === "Home") { e.preventDefault(); set(ring, 0); }
    else if (e.key === "End") { e.preventDefault(); set(ring, count - 1); }
    else if (e.key === "ArrowDown") { e.preventDefault(); pickRing(RINGS[(i + 1) % RINGS.length]); }
    else if (e.key === "ArrowUp") { e.preventDefault(); pickRing(RINGS[(i + RINGS.length - 1) % RINGS.length]); }
  };

  /* ---------- sending ---------- */
  useEffect(() => {
    if (run?.state !== "running") return;
    const t = window.setTimeout(() => setRun((r) => (r ? { ...r, state: "done" } : r)), 2400);
    return () => clearTimeout(t);
  }, [run]);
  const send = () => {
    if (!text.trim()) return;
    const brief: DialBrief = { text: text.trim(), mode: M.id, model: Mo.id, effort: vals.effort, files: S.files };
    onSend?.(brief);
    setRun({ state: "running", label: `${M.name} · ${Mo.name} · ${EFFORT_LABEL[vals.effort]} · ${S.name}` });
    setSay(`Sent. ${M.name} mode with ${Mo.name}, ${EFFORT_LABEL[vals.effort]} effort, ${S.name}.`);
    setText("");
  };

  /* ---------- what each ring prints around the dial ---------- */
  const labels = (r: Ring) =>
    r === "mode" ? MODES.map((m) => m.name) : r === "model" ? MODELS.map((m) => m.short) : r === "effort" ? ["Low", "Med", "High", "XHigh", "Max"] : SCOPES.map((s) => s.short);

  return (
    <div
      className={`dlcm dlcm--${theme} ${className}`}
      data-ring={ring}
      data-mode={M.id}
      data-model={Mo.maker}
      data-effort={vals.effort}
      data-level={use.pct > 0.85 ? "full" : use.pct > 0.65 ? "warn" : "ok"}
      data-drag={live !== null || undefined}
    >
      <div className="dlcm__card">
        {run && (
          <p className="dlcm__run" data-s={run.state} aria-live="polite">
            <span className="dlcm__runicon" aria-hidden="true">{run.state === "running" ? <i className="dlcm__spin" /> : <svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" /></svg>}</span>
            {run.state === "running" ? "Running" : "Done"}
            <span>{run.label}</span>
          </p>
        )}
        <label htmlFor={`${uid}-ta`} className="dlcm__sr">Task</label>
        <textarea
          id={`${uid}-ta`}
          className="dlcm__prompt"
          rows={3}
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); }
          }}
        />

        <div className="dlcm__deck">
          {/* ---------- the dial ---------- */}
          <div className="dlcm__dialwrap">
            <svg
              ref={svg}
              className="dlcm__dial"
              viewBox="0 0 240 240"
              role="slider"
              tabIndex={0}
              aria-roledescription="dial"
              aria-label={`${RING_NAME[ring]} dial`}
              aria-valuemin={0}
              aria-valuemax={count - 1}
              aria-valuenow={value}
              aria-valuetext={describe(ring)}
              aria-describedby={`${uid}-help`}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
              onKeyDown={key}
            >
              <path className="dlcm__track" d={arc(C, C, TRACK, -SWEEP / 2, SWEEP / 2)} />
              {value > 0 || live !== null ? <path className="dlcm__fill" d={arc(C, C, TRACK, -SWEEP / 2, Math.max(-SWEEP / 2 + 0.01, angle))} /> : null}
              {angles.map((a, i) => {
                const p = polar(C, C, TRACK, a);
                const l = polar(C, C, LABEL + (ring === "model" ? 2 : 0), a);
                return (
                  <g key={`${ring}-${i}`} className="dlcm__stop" data-on={i === value || undefined} onPointerDown={(e) => { e.stopPropagation(); set(ring, i); }}>
                    <circle cx={p.x} cy={p.y} r={i === value ? 3.4 : 2.2} />
                    {ring === "model" ? (
                      <g transform={`translate(${l.x - 7} ${l.y - 7})`} className="dlcm__stoplogo">
                        <MakerLogo maker={MODELS[i].maker} size={14} />
                      </g>
                    ) : (
                      <text x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle">{labels(ring)[i]}</text>
                    )}
                  </g>
                );
              })}
            </svg>
            <div ref={knob} className="dlcm__knob" aria-hidden="true">
              <i className="dlcm__pointer" style={{ transform: `rotate(${angle}deg)` }} />
              <div className="dlcm__face" key={`${ring}-${value}`}>
                {ring === "mode" && (
                  <>
                    <span className="dlcm__faceicon dlcm__faceicon--mode"><ModeIcon id={M.id} /></span>
                    <b>{M.name}</b>
                  </>
                )}
                {ring === "model" && (
                  <>
                    <span className="dlcm__faceicon dlcm__faceicon--model"><MakerLogo maker={Mo.maker} /></span>
                    <b>{Mo.short}</b>
                  </>
                )}
                {ring === "effort" && (
                  <>
                    <span className="dlcm__bars">{EFFORT_LABEL.map((_, i) => <i key={i} data-on={i <= vals.effort || undefined} style={{ ["--h" as string]: `${5 + i * 3}px` }} />)}</span>
                    <b>{EFFORT_LABEL[vals.effort]}</b>
                  </>
                )}
                {ring === "context" && (
                  <>
                    <span className="dlcm__pct">{pct}<small>%</small></span>
                    <b>{S.short === "None" ? "Message" : S.short}</b>
                  </>
                )}
              </div>
            </div>
          </div>
          <p id={`${uid}-help`} className="dlcm__sr">Left and right turn the dial. Up and down choose what it sets: mode, model, effort or context.</p>

          {/* ---------- the readout: which ring, and what each is set to ---------- */}
          <div className="dlcm__rings" role="radiogroup" aria-label="What the dial sets">
            {RINGS.map((r) => (
              <button key={r} type="button" role="radio" aria-checked={ring === r} className="dlcm__ring" data-r={r} onClick={() => pickRing(r)}>
                <span className="dlcm__rname">{RING_NAME[r]}</span>
                <span className="dlcm__rval">
                  {r === "mode" && <><ModeIcon id={M.id} />{M.name}</>}
                  {r === "model" && <><MakerLogo maker={Mo.maker} />{Mo.name}</>}
                  {r === "effort" && <><span className="dlcm__mini">{EFFORT_LABEL.map((_, i) => <i key={i} data-on={i <= vals.effort || undefined} style={{ ["--h" as string]: `${3 + i * 1.6}px` }} />)}</span>{EFFORT_LABEL[vals.effort]}</>}
                  {r === "context" && <>{S.name}<small>{pct}%</small></>}
                </span>
              </button>
            ))}
            <p className="dlcm__files" aria-label="Files the agent can read">
              {S.files.length ? S.files.slice(0, 3).map(fileName).join(" · ") + (S.files.length > 3 ? ` · +${S.files.length - 3}` : "") : "No files — just your message"}
            </p>
          </div>

          <button type="button" className="dlcm__go" aria-label={`Send in ${M.name} mode`} aria-disabled={!text.trim() || undefined} onClick={send}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3.5M3.75 7.5 8 3.25l4.25 4.25" /></svg>
          </button>
        </div>
      </div>
      <p className="dlcm__sr" role="status" aria-live="polite">{say}</p>
    </div>
  );
}
