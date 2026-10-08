"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { EFFORT_HINT, EFFORT_LABEL, FILES, MODELS, MODES, fileName, fmt, usage, type ModeId, type ModelId } from "./brief";
import { MakerLogo, ModeIcon } from "./logos";
import "./stacked-brief.css";

/**
 * Stacked Brief
 * You build the brief a line at a time — task, mode, model, context, effort — each row opening in place
 * and closing to its answer as you move on. With every line answered you review the whole stack, then
 * fold it: the ladder compresses into one line you can send, or open again.
 */

type Step = "task" | "mode" | "model" | "context" | "effort";
const STEPS: Step[] = ["task", "mode", "model", "context", "effort"];
const NAME: Record<Step, string> = { task: "Task", mode: "Mode", model: "Model", context: "Context", effort: "Effort" };

export type StackedBriefValue = { text: string; mode: ModeId; model: ModelId; effort: number; files: string[] };

export type StackedBriefProps = {
  onSend?: (brief: StackedBriefValue) => void;
  theme?: "dark" | "light";
  className?: string;
};

const I = {
  tick: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>,
  up: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3.5M3.75 7.5 8 3.25l4.25 4.25" /></svg>,
  fold: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 3.5 3.5 3.5 3.5-3.5M4.5 12.5 8 9l3.5 3.5" /></svg>,
  unfold: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6 3.5-3.5L11.5 6M4.5 10l3.5 3.5 3.5-3.5" /></svg>,
};

export function StackedBrief({ onSend, theme = "dark", className = "" }: StackedBriefProps) {
  const uid = useId();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<ModeId | null>(null);
  const [model, setModel] = useState<ModelId | null>(null);
  const [files, setFiles] = useState<string[] | null>(null);
  const [effort, setEffort] = useState<number | null>(null);
  const [taskDone, setTaskDone] = useState(false);
  const [open, setOpen] = useState<Step | null>("task");
  const [folded, setFolded] = useState(false);
  const [height, setHeight] = useState<number | null>(null);
  const [run, setRun] = useState<{ state: "running" | "done"; label: string } | null>(null);
  const [say, setSay] = useState("");
  const inner = useRef<HTMLDivElement>(null);
  const heads = useRef<Partial<Record<Step, HTMLButtonElement | null>>>({});
  const area = useRef<HTMLTextAreaElement>(null);

  const done: Record<Step, boolean> = { task: taskDone && !!text.trim(), mode: !!mode, model: !!model, context: files !== null, effort: effort !== null };
  const complete = STEPS.every((s) => done[s]);
  const M = mode ? MODES.find((m) => m.id === mode)! : null;
  const Mo = model ? MODELS.find((m) => m.id === model)! : null;
  const use = Mo ? usage(files ?? [], effort ?? 1, Mo) : null;
  const firstOpen = STEPS.find((s) => !done[s]) ?? null;

  /* The whole card's height follows its content, so folding and unfolding glide. */
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (open === "task") requestAnimationFrame(() => area.current?.focus());
  }, [open]);

  useEffect(() => {
    if (run?.state !== "running") return;
    const t = window.setTimeout(() => setRun((r) => (r ? { ...r, state: "done" } : r)), 2400);
    return () => clearTimeout(t);
  }, [run]);

  /** Answer a row and move to the next one that still needs an answer. */
  const next = (from: Step, words: string) => {
    setSay(words);
    const after = STEPS.slice(STEPS.indexOf(from) + 1).find((s) => !doneAfter(s, from));
    setOpen(after ?? null);
    if (!after) setSay(`${words} Every line is set — review the brief, then fold it.`);
    requestAnimationFrame(() => after && heads.current[after]?.focus());
  };
  // `done` hasn't re-rendered yet for the row just answered; treat it as done.
  const doneAfter = (s: Step, just: Step) => (s === just ? true : done[s]);

  const fold = () => {
    setFolded(true);
    setOpen(null);
    setSay("Brief folded. Send it, or open it again.");
  };
  const unfold = () => {
    setFolded(false);
    setSay("Brief opened.");
  };
  const send = () => {
    if (!complete || !M || !Mo || effort === null || files === null) return;
    onSend?.({ text: text.trim(), mode: M.id, model: Mo.id, effort, files });
    setRun({ state: "running", label: `${M.name} · ${Mo.name} · ${EFFORT_LABEL[effort]}` });
    setSay("Brief sent.");
    // A fresh stack for the next brief; the choices stay as sensible defaults, the task starts empty.
    setText("");
    setTaskDone(false);
    setFolded(false);
    setOpen("task");
  };

  const summary = (s: Step) => {
    if (s === "task") return text.trim() || null;
    if (s === "mode") return M && <><ModeIcon id={M.id} />{M.name}</>;
    if (s === "model") return Mo && <><MakerLogo maker={Mo.maker} />{Mo.name}</>;
    if (s === "context") return files === null ? null : files.length ? `${files.length} file${files.length === 1 ? "" : "s"} · ${fmt(use?.files ?? 0)} tokens` : "Message only";
    return effort === null ? null : <><span className="stbf__bars" aria-hidden="true">{EFFORT_LABEL.map((_, i) => <i key={i} data-on={i <= effort || undefined} style={{ ["--h" as string]: `${3 + i * 2}px` }} />)}</span>{EFFORT_LABEL[effort]}</>;
  };

  return (
    <div className={`stbf stbf--${theme} ${className}`} data-mode={mode ?? undefined} data-maker={Mo?.maker} data-effort={effort ?? undefined} data-folded={folded || undefined}>
      <div className="stbf__card" style={{ height: height ?? undefined }}>
        <div ref={inner} className="stbf__inner">
          {run && (
            <p className="stbf__run" data-s={run.state} aria-live="polite">
              <span className="stbf__runicon" aria-hidden="true">{run.state === "running" ? <i className="stbf__spin" /> : I.tick}</span>
              {run.state === "running" ? "Running" : "Done"} <span>{run.label}</span>
            </p>
          )}

          {folded ? (
            /* ---------- folded: one line ---------- */
            <div className="stbf__folded">
              <div className="stbf__line" aria-label="Brief">
                <span className="stbf__ltask">{text.trim()}</span>
                <span className="stbf__lbits">
                  <span className="stbf__lmode">{M && <ModeIcon id={M.id} />}{M?.name}</span>
                  <span className="stbf__lmodel">{Mo && <MakerLogo maker={Mo.maker} />}{Mo?.short}</span>
                  <span>{files?.length ? `${files.length} file${files.length === 1 ? "" : "s"}` : "no files"}</span>
                  <span className="stbf__leff">{effort !== null && EFFORT_LABEL[effort]}</span>
                </span>
              </div>
              <button type="button" className="stbf__ghost" onClick={unfold} aria-label="Open the brief again">{I.unfold}</button>
              <button type="button" className="stbf__go" onClick={send} aria-label="Send the brief">{I.up}</button>
            </div>
          ) : (
            /* ---------- the ladder ---------- */
            <>
              <header className="stbf__head">
                <h3 className="stbf__title">Brief</h3>
                <span>{STEPS.filter((s) => done[s]).length} of 5</span>
              </header>
              <ol className="stbf__steps">
                {STEPS.map((s, i) => {
                  const isOpen = open === s;
                  const sum = summary(s);
                  return (
                    <li key={s} className="stbf__step" data-step={s} data-open={isOpen || undefined} data-done={done[s] || undefined} data-next={!isOpen && firstOpen === s && !done[s] ? "" : undefined}>
                      <span className="stbf__dot" aria-hidden="true">{done[s] && !isOpen ? I.tick : String(i + 1).padStart(2, "0")}</span>
                      <button
                        ref={(el) => { heads.current[s] = el; }}
                        type="button"
                        className="stbf__shead"
                        aria-expanded={isOpen}
                        aria-controls={`${uid}-${s}`}
                        onClick={() => setOpen(isOpen ? null : s)}
                      >
                        <span className="stbf__sname">{NAME[s]}</span>
                        {!isOpen && <span className="stbf__sval">{sum ?? <em>{firstOpen === s ? "Next" : "Not set"}</em>}</span>}
                      </button>

                      {isOpen && (
                        <div id={`${uid}-${s}`} className="stbf__body">
                          {s === "task" && (
                            <div className="stbf__task">
                              <label htmlFor={`${uid}-ta`} className="stbf__sr">Task</label>
                              <textarea
                                ref={area}
                                id={`${uid}-ta`}
                                rows={3}
                                value={text}
                                placeholder="Refactor the checkout flow so payment errors are retried once"
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && text.trim()) { e.preventDefault(); setTaskDone(true); next("task", "Task set."); }
                                }}
                              />
                              <button type="button" className="stbf__next" disabled={!text.trim()} onClick={() => { setTaskDone(true); next("task", "Task set."); }}>Next <kbd>↵</kbd></button>
                            </div>
                          )}
                          {s === "mode" && (
                            <div className="stbf__tiles" role="radiogroup" aria-label="Mode">
                              {MODES.map((m) => (
                                <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} className="stbf__tile" data-m={m.id} onClick={() => { setMode(m.id); next("mode", `${m.name} mode.`); }}>
                                  <ModeIcon id={m.id} />
                                  <span className="stbf__tname">{m.name}</span>
                                  <span className="stbf__tdoes">{m.does}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          {s === "model" && (
                            <div className="stbf__tiles stbf__tiles--3" role="radiogroup" aria-label="Model">
                              {MODELS.map((m) => (
                                <button key={m.id} type="button" role="radio" aria-checked={model === m.id} className="stbf__tile" data-maker={m.maker} onClick={() => { setModel(m.id); next("model", `${m.name}.`); }}>
                                  <MakerLogo maker={m.maker} />
                                  <span className="stbf__tname">{m.name}</span>
                                  <span className="stbf__tdoes">{fmt(m.window)} context</span>
                                </button>
                              ))}
                            </div>
                          )}
                          {s === "context" && (
                            <div className="stbf__ctx">
                              <ul className="stbf__files">
                                {FILES.map((f) => {
                                  const on = (files ?? []).includes(f.path);
                                  return (
                                    <li key={f.path}>
                                      <button type="button" role="checkbox" aria-checked={on} className="stbf__file" onClick={() => setFiles((x) => { const cur = x ?? []; return on ? cur.filter((p) => p !== f.path) : [...cur, f.path]; })}>
                                        <b className="stbf__box" aria-hidden="true">{on && I.tick}</b>
                                        <span>{f.path}</span>
                                        <small>{fmt(f.tokens)}</small>
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                              <button type="button" className="stbf__next" onClick={() => { const f = files ?? []; setFiles(f); next("context", f.length ? `${f.length} file${f.length === 1 ? "" : "s"}: ${f.map(fileName).join(", ")}.` : "Message only."); }}>
                                {(files ?? []).length ? `Use ${(files ?? []).length} file${(files ?? []).length === 1 ? "" : "s"}` : "No files — just the message"}
                              </button>
                            </div>
                          )}
                          {s === "effort" && (
                            <div className="stbf__effort" role="radiogroup" aria-label="Effort">
                              {EFFORT_LABEL.map((l, j) => (
                                <button key={l} type="button" role="radio" aria-checked={effort === j} data-e={j} aria-description={EFFORT_HINT[j]} onClick={() => { setEffort(j); next("effort", `${l} effort.`); }}>
                                  <i style={{ ["--h" as string]: `${8 + j * 5}px` }} aria-hidden="true" />
                                  <span>{l}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
              <footer className="stbf__foot" data-ready={complete || undefined}>
                <span>{complete ? `Ready · ${use ? `${Math.round(use.pct * 100)}% of ${Mo?.short}` : ""}` : `Answer ${5 - STEPS.filter((s) => done[s]).length} more`}</span>
                <button type="button" className="stbf__fold" disabled={!complete} onClick={fold}>
                  {I.fold}
                  Fold brief
                </button>
              </footer>
            </>
          )}
        </div>
      </div>
      <p className="stbf__sr" role="status" aria-live="polite">{say}</p>
    </div>
  );
}
