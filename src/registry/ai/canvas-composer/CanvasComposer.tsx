"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent } from "react";
import { EFFORT_LABEL, FILES, MODELS, fmt, usage, type ModeId } from "./brief";
import { PIECES, byKey, dock, empty, isDocked, missing, undock, within, type Docked, type Kind, type Piece } from "./desk";
import { MakerLogo, ModeIcon } from "./logos";
import "./canvas-composer.css";

/**
 * Canvas Composer
 * A briefing desk. The prompt sits on a sheet in the middle; modes, models, effort levels and files lie
 * around it as pieces. You brief the agent by putting pieces on the sheet — drag them, or tap — and
 * anything still on the desk is plainly not part of the brief.
 */

export type CanvasBrief = { text: string; mode: string; model: string; effort: number; files: string[] };

export type CanvasComposerProps = {
  initial?: Partial<Docked>;
  onSend?: (brief: CanvasBrief) => void;
  theme?: "dark" | "light";
  className?: string;
};

const TRAYS: { kind: Kind; title: string; area: string }[] = [
  { kind: "file", title: "Files", area: "files" },
  { kind: "mode", title: "Modes", area: "modes" },
  { kind: "model", title: "Models", area: "models" },
  { kind: "effort", title: "Effort", area: "effort" },
];
const SLOT_NAME: Record<Exclude<Kind, "file">, string> = { mode: "Mode", model: "Model", effort: "Effort" };

function PieceFace({ p }: { p: Piece }) {
  if (p.kind === "mode") return <><ModeIcon id={p.value as ModeId} /><span>{p.label}</span></>;
  if (p.kind === "model") return <><MakerLogo maker={MODELS.find((m) => m.id === p.value)!.maker} /><span>{p.label}</span></>;
  if (p.kind === "effort")
    return (
      <>
        <span className="cvsc__bars" aria-hidden="true">{EFFORT_LABEL.map((_, i) => <i key={i} data-on={i <= +p.value || undefined} style={{ ["--h" as string]: `${3 + i * 2}px` }} />)}</span>
        <span>{p.label}</span>
      </>
    );
  const ext = p.value.split(".").pop()!;
  return <><b className="cvsc__ext" data-k={ext}>{ext === "ts" ? "TS" : ext.toUpperCase()}</b><span>{p.label}</span></>;
}

const attrs = (p: Piece) => ({
  "data-kind": p.kind,
  "data-v": p.kind === "model" ? MODELS.find((m) => m.id === p.value)!.maker : p.value,
});

export function CanvasComposer({ initial = { model: "model:opus", effort: "effort:2", files: ["file:exporter/retry.ts"] }, onSend, theme = "dark", className = "" }: CanvasComposerProps) {
  const uid = useId();
  const [docked, setDocked] = useState<Docked>({ ...empty, ...initial });
  const [text, setText] = useState("");
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [run, setRun] = useState<{ state: "running" | "done"; label: string } | null>(null);
  const [say, setSay] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ key: string; el: HTMLElement; x: number; y: number; moved: boolean } | null>(null);
  const flip = useRef<{ key: string; to: "chip" | "piece"; rect: DOMRect } | null>(null);

  const need = missing(docked, text);
  const model = MODELS.find((m) => `model:${m.id}` === docked.model) ?? MODELS[1];
  const effort = docked.effort ? +byKey(docked.effort).value : 1;
  const files = docked.files.map((k) => byKey(k).value);
  const use = usage(files, effort, model);

  /* FLIP: a piece travels from where it was to where it lands. */
  useLayoutEffect(() => {
    const f = flip.current;
    flip.current = null;
    if (!f) return;
    const el = root.current?.querySelector<HTMLElement>(f.to === "chip" ? `[data-chip="${f.key}"]` : `[data-piece="${f.key}"]`);
    if (!el || !el.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = f.rect.left + f.rect.width / 2 - (r.left + r.width / 2);
    const dy = f.rect.top + f.rect.height / 2 - (r.top + r.height / 2);
    el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(1.04)` }, { transform: "translate(0, 0) scale(1)" }], { duration: 380, easing: "cubic-bezier(0.2, 0.9, 0.25, 1.1)" });
  });

  const put = (p: Piece, from?: DOMRect) => {
    const { next, displaced } = dock(docked, p);
    if (from) flip.current = { key: p.key, to: "chip", rect: from };
    setDocked(next);
    setSay(`${p.label} added to the brief${displaced ? `, replacing ${byKey(displaced).label}` : ""}.`);
  };
  const take = (p: Piece, from?: DOMRect) => {
    if (from) flip.current = { key: p.key, to: "piece", rect: from };
    setDocked((d) => undock(d, p));
    setSay(`${p.label} taken off the brief.`);
  };

  /* ---------- dragging a piece onto the sheet ---------- */
  const down = (e: RPointerEvent<HTMLButtonElement>, p: Piece) => {
    if (e.button !== 0 || isDocked(docked, p)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { key: p.key, el: e.currentTarget, x: e.clientX, y: e.clientY, moved: false };
  };
  const move = (e: RPointerEvent<HTMLButtonElement>) => {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (!g.moved && Math.hypot(dx, dy) < 5) return;
    if (!g.moved) { g.moved = true; setDrag(g.key); }
    g.el.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-4, Math.min(4, dx / 40))}deg)`;
    const s = sheet.current?.getBoundingClientRect();
    setOver(!!s && within(e.clientX, e.clientY, s));
  };
  const up = (e: RPointerEvent<HTMLButtonElement>, p: Piece) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g) return;
    const s = sheet.current?.getBoundingClientRect();
    const rect = g.el.getBoundingClientRect();
    setDrag(null);
    setOver(false);
    if (!g.moved) return; // a tap: the click handler docks it
    g.el.dataset.swallow = "1";
    if (s && within(e.clientX, e.clientY, s)) {
      g.el.style.transform = "";
      put(p, rect);
    } else {
      // Missed the sheet: the piece slides back to its place on the desk.
      g.el.animate?.([{ transform: g.el.style.transform }, { transform: "none" }], { duration: 320, easing: "cubic-bezier(0.2, 0.9, 0.25, 1.05)" });
      g.el.style.transform = "";
      setSay(`${p.label} not added — drop it on the brief.`);
    }
  };
  const click = (e: RMouseEvent<HTMLButtonElement>, p: Piece) => {
    if (e.currentTarget.dataset.swallow) { delete e.currentTarget.dataset.swallow; return; }
    const rect = e.currentTarget.getBoundingClientRect();
    if (isDocked(docked, p)) {
      const chip = root.current?.querySelector<HTMLElement>(`[data-chip="${p.key}"]`);
      take(p, chip?.getBoundingClientRect());
    } else put(p, rect);
  };

  /* ---------- sending ---------- */
  useEffect(() => {
    if (run?.state !== "running") return;
    const t = window.setTimeout(() => setRun((r) => (r ? { ...r, state: "done" } : r)), 2400);
    return () => clearTimeout(t);
  }, [run]);
  const send = () => {
    if (need.length) {
      setSay(`Still needs ${need.join(", ")}.`);
      return;
    }
    const mode = byKey(docked.mode!).value;
    onSend?.({ text: text.trim(), mode, model: model.id, effort, files });
    setRun({ state: "running", label: `${byKey(docked.mode!).label} · ${model.name} · ${EFFORT_LABEL[effort]} · ${files.length} file${files.length === 1 ? "" : "s"}` });
    setSay("Brief sent.");
    setText("");
  };

  const slotKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); }
  };

  const chip = (key: string) => {
    const p = byKey(key);
    return (
      <span key={key} className="cvsc__chip" data-chip={key} {...attrs(p)}>
        <PieceFace p={p} />
        <button type="button" className="cvsc__off" aria-label={`Take ${p.label} off the brief`} onClick={(e) => take(p, (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect())}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 5 6 6m0-6-6 6" /></svg>
        </button>
      </span>
    );
  };

  return (
    <div ref={root} className={`cvsc cvsc--${theme} ${className}`} data-dragging={drag ? "" : undefined}>
      <div className="cvsc__desk">
        {TRAYS.map((t) => (
          <section key={t.kind} className={`cvsc__tray cvsc__tray--${t.area}`} aria-label={t.title}>
            <h3 className="cvsc__traytitle">{t.title}</h3>
            <div className="cvsc__pieces">
              {PIECES.filter((p) => p.kind === t.kind).map((p) => {
                const on = isDocked(docked, p);
                return (
                  <button
                    key={p.key}
                    type="button"
                    className="cvsc__piece"
                    data-piece={p.key}
                    data-in={on || undefined}
                    data-lifted={drag === p.key || undefined}
                    aria-pressed={on}
                    aria-label={`${p.kind === "file" ? FILES.find((f) => f.path === p.value)!.path : p.label} ${p.kind === "file" ? "file" : p.kind}${on ? ", in the brief" : ""}`}
                    {...attrs(p)}
                    onPointerDown={(e) => down(e, p)}
                    onPointerMove={move}
                    onPointerUp={(e) => up(e, p)}
                    onPointerCancel={(e) => up(e, p)}
                    onClick={(e) => click(e, p)}
                  >
                    <PieceFace p={p} />
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* ---------- the sheet ---------- */}
        <div ref={sheet} className="cvsc__sheet" data-over={over || undefined}>
          {run && (
            <p className="cvsc__run" data-s={run.state} aria-live="polite">
              <span className="cvsc__runicon" aria-hidden="true">{run.state === "running" ? <i className="cvsc__spin" /> : <svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" /></svg>}</span>
              {run.state === "running" ? "Running" : "Done"}
              <span>{run.label}</span>
            </p>
          )}
          <p className="cvsc__head">
            <span>Brief</span>
            <span>{drag ? "Drop it here" : need.length ? `Needs ${need.join(", ")}` : "Ready"}</span>
          </p>
          <label htmlFor={`${uid}-ta`} className="cvsc__sr">Task</label>
          <textarea id={`${uid}-ta`} className="cvsc__prompt" rows={3} value={text} placeholder="What should the agent do?" onChange={(e) => setText(e.target.value)} onKeyDown={slotKey} />

          <div className="cvsc__slots">
            {(["mode", "model", "effort"] as const).map((k) => (
              <div key={k} className="cvsc__slot" data-slot={k} data-full={docked[k] ? "" : undefined} data-want={drag && byKey(drag).kind === k ? "" : undefined}>
                {docked[k] ? chip(docked[k]!) : <span className="cvsc__hole">{SLOT_NAME[k]}</span>}
              </div>
            ))}
            <div className="cvsc__slot cvsc__slot--files" data-slot="file" data-full={docked.files.length ? "" : undefined} data-want={drag && byKey(drag).kind === "file" ? "" : undefined}>
              {docked.files.length ? docked.files.map(chip) : <span className="cvsc__hole">Files — none, just the message</span>}
            </div>
          </div>

          <div className="cvsc__foot">
            <span className="cvsc__use">
              {files.length} file{files.length === 1 ? "" : "s"} · {fmt(use.files)} tokens · {Math.round(use.pct * 100)}% of {model.name}
            </span>
            <button type="button" className="cvsc__go" aria-label={need.length ? `Send — still needs ${need.join(", ")}` : "Send the brief"} aria-disabled={need.length ? true : undefined} onClick={send}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3.5M3.75 7.5 8 3.25l4.25 4.25" /></svg>
            </button>
          </div>
        </div>
      </div>
      <p className="cvsc__sr" role="status" aria-live="polite">{say}</p>
    </div>
  );
}
