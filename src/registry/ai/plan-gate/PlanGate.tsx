"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ClaudeLogo } from "./logo";
import { PLAN, RISK_HINT, RISK_LABEL, TASK, gatesFor, live, move, previewText, replan, type Gate, type Outcome, type Preview, type Step } from "./plan";
import "./plan-gate.css";

/**
 * Plan Gate
 * The agent shows its plan before it touches anything. You reorder, strike or re-gate steps; then it
 * runs, and every step you gated stops at a gate that shows the exact command, diff or message. You
 * approve it, edit it, deny it (the agent replans and shows what changed) or take it over yourself.
 */

type Phase = "drafting" | "review" | "running" | "gate" | "failed" | "paused" | "done" | "cancelled";
type GateMode = "view" | "edit" | "deny" | "handed";

export type PlanGateReceipt = { id: string; title: string; by: NonNullable<Outcome["by"]>; note?: string }[];

export type PlanGateProps = {
  task?: string;
  plan?: Step[];
  onComplete?: (receipt: PlanGateReceipt) => void;
  theme?: "dark" | "light";
  className?: string;
};

const I = {
  tick: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>,
  up: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 9.5 3.5-3.5 3.5 3.5" /></svg>,
  down: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" /></svg>,
  x: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 4.5 7 7m0-7-7 7" /></svg>,
  hand: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 8V3.8a1 1 0 0 1 2 0V7.5m0-.5V3a1 1 0 0 1 2 0v4.5m0-3a1 1 0 0 1 2 0v4c0 2.8-1.6 4.5-4 4.5-1.7 0-2.7-.8-3.6-2.2L2.7 8.6a1 1 0 0 1 1.6-1.1L5.5 9" /></svg>,
  play: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" /></svg>,
  pause: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 3.5v9m5-9v9" /></svg>,
  retry: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12.5 8a4.5 4.5 0 1 1-1.4-3.3M12.5 3v2.5H10" /></svg>,
  warn: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5 14 13H2zM8 6.5v3m0 1.8v.2" /></svg>,
};

const BY_LABEL: Record<NonNullable<Outcome["by"]>, string> = {
  auto: "ran on its own",
  approved: "approved by you",
  edited: "edited, then approved",
  you: "done by you",
  skipped: "skipped",
  denied: "denied",
};

const GATE_LABEL: Record<Gate, string> = { auto: "Auto", ask: "Ask", skip: "Skip" };

function PreviewBlock({ p, edited }: { p: Preview; edited?: string }) {
  if (edited != null) return <pre className="plgt__pre" data-edited>{edited}</pre>;
  if (p.kind === "command") return <pre className="plgt__pre"><span aria-hidden="true">$ </span>{p.text}</pre>;
  if (p.kind === "message")
    return (
      <div className="plgt__msg">
        <span>To {p.to}</span>
        <p>{p.text}</p>
      </div>
    );
  return (
    <div className="plgt__diff">
      <span>{p.file}</span>
      <pre>
        {p.lines.map((l, i) => (
          <span key={i} data-op={l.op === "+" ? "add" : l.op === "-" ? "del" : undefined}>
            <i aria-hidden="true">{l.op}</i>
            {l.op === "+" ? <span className="plgt__sr">added: </span> : l.op === "-" ? <span className="plgt__sr">removed: </span> : null}
            {l.text}
            {"\n"}
          </span>
        ))}
      </pre>
    </div>
  );
}

export function PlanGate({ task = TASK, plan = PLAN, onComplete, theme = "dark", className = "" }: PlanGateProps) {
  const uid = useId();
  const [steps, setSteps] = useState<Step[]>(plan);
  const [out, setOut] = useState<Record<string, Outcome>>({});
  const outRef = useRef(out);
  outRef.current = out;
  const [phase, setPhase] = useState<Phase>("drafting");
  const [drafted, setDrafted] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [gateMode, setGateMode] = useState<GateMode>("view");
  const [editText, setEditText] = useState("");
  const [reason, setReason] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [renaming, setRenaming] = useState<string | null>(null);
  const [steer, setSteer] = useState("");
  const [queued, setQueued] = useState<string | null>(null);
  const queuedRef = useRef(queued);
  queuedRef.current = queued;
  const [replanned, setReplanned] = useState<{ title: string; reason: string } | null>(null);
  const [say, setSay] = useState("");
  const gateRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<HTMLButtonElement>(null);

  const patch = (id: string, o: Partial<Outcome>) => setOut((m) => ({ ...m, [id]: { ...m[id], ...o } as Outcome }));

  /* The plan arrives a step at a time. */
  useEffect(() => {
    if (phase !== "drafting") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || drafted >= steps.length) {
      setDrafted(steps.length);
      setPhase("review");
      setSay(`Plan ready: ${steps.length} steps. Review it, then run.`);
      return;
    }
    const t = window.setTimeout(() => setDrafted((d) => d + 1), 240);
    return () => window.clearTimeout(t);
  }, [phase, drafted, steps.length]);

  /* The run: one step at a time, stopping at every gate. */
  useEffect(() => {
    if (phase !== "running") return;
    if (cursor >= steps.length) {
      setPhase("done");
      setSay("Run complete.");
      return;
    }
    const s = steps[cursor];
    const o = outRef.current[s.id];
    if (s.removed || o?.status === "done" || o?.status === "skipped") {
      setCursor((c) => c + 1);
      return;
    }
    if (s.gate === "skip") {
      patch(s.id, { status: "skipped", by: "skipped" });
      setCursor((c) => c + 1);
      return;
    }
    if (s.gate === "ask" && !o?.by) {
      patch(s.id, { status: "waiting" });
      setGateMode("view");
      setPhase("gate");
      setSay(`Waiting for you: ${s.title}.`);
      return;
    }
    const note = queuedRef.current;
    if (note) setQueued(null);
    patch(s.id, { status: "running", ...(note ? { note } : {}) });
    const t = window.setTimeout(() => {
      const attempts = (outRef.current[s.id]?.attempts ?? 0) + 1;
      if (s.flaky && attempts === 1) {
        patch(s.id, { status: "failed", attempts });
        setPhase("failed");
        setSay(`${s.title} failed. Retry or skip it.`);
        return;
      }
      patch(s.id, { status: "done", attempts, by: outRef.current[s.id]?.by ?? "auto" });
      setCursor((c) => c + 1);
    }, 1100);
    return () => window.clearTimeout(t);
  }, [phase, cursor, steps]);

  useEffect(() => {
    if (phase === "gate") gateRef.current?.querySelector<HTMLElement>("[data-first]")?.focus({ preventScroll: true });
  }, [phase, gateMode]);

  useEffect(() => {
    if (phase !== "done") return;
    onComplete?.(
      steps
        .map((s) => ({ s, o: out[s.id] }))
        .filter(({ o }) => o?.by)
        .map(({ s, o }) => ({ id: s.id, title: s.title, by: o!.by!, note: o!.note })),
    );
    // Report once per finished run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const current = steps[cursor];
  const editable = (i: number) => (phase === "review" || phase === "paused") && i >= cursor && !steps[i].removed && out[steps[i].id]?.status !== "done";
  const started = cursor > 0 || Object.keys(out).length > 0;

  const run = () => {
    if (phase !== "review" && phase !== "paused") return;
    setReplanned(null);
    setPhase("running");
    setSay(started ? "Continuing the run." : "Running.");
  };
  const approve = () => {
    if (!current) return;
    if (gateMode === "edit") {
      setEdits((e) => ({ ...e, [current.id]: editText }));
      patch(current.id, { by: "edited" });
      setSay("Edited and approved.");
    } else {
      patch(current.id, { by: "approved" });
      setSay("Approved.");
    }
    setGateMode("view");
    setPhase("running");
  };
  const deny = () => {
    if (!current) return;
    if (!reason.trim()) {
      setSay("Say why, so the agent can plan around it.");
      return;
    }
    patch(current.id, { status: "skipped", by: "denied", note: reason.trim() });
    setSteps((x) => replan(x, current.id));
    setReplanned({ title: current.title, reason: reason.trim() });
    setReason("");
    setGateMode("view");
    setPhase("review");
    setSay("Denied. The agent replanned; review the changes, then continue.");
    window.setTimeout(() => runRef.current?.focus({ preventScroll: true }), 0);
  };
  const takeOver = () => {
    if (!current) return;
    patch(current.id, { status: "handed" });
    setGateMode("handed");
    setSay("It's yours. Do it, then mark it done.");
  };
  const handedDone = () => {
    if (!current) return;
    patch(current.id, { status: "done", by: "you" });
    setGateMode("view");
    setCursor((c) => c + 1);
    setPhase("running");
    setSay("Marked done. Continuing.");
  };
  const retry = () => {
    setPhase("running");
    setSay("Retrying.");
  };
  const skipFailed = () => {
    if (!current) return;
    patch(current.id, { status: "skipped", by: "skipped" });
    setCursor((c) => c + 1);
    setPhase("running");
    setSay("Skipped. Continuing.");
  };
  const cancel = () => {
    setPhase("cancelled");
    setSay("Run cancelled. Nothing after this point ran.");
  };
  const restart = () => {
    setSteps(plan);
    setOut({});
    setEdits({});
    setCursor(0);
    setReplanned(null);
    setQueued(null);
    setDrafted(0);
    setPhase("drafting");
  };

  const setGate = (i: number, g: Gate) => {
    setSteps((x) => x.map((s, j) => (j === i ? { ...s, gate: g } : s)));
    setSay(`${steps[i].title}: ${GATE_LABEL[g]}.`);
  };
  const shift = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (!editable(i) || j < cursor || j >= steps.length || !editable(j)) return;
    setSteps((x) => move(x, i, j));
    setSay(`Moved to step ${j + 1}.`);
    window.setTimeout(() => document.getElementById(`${uid}-row-${steps[i].id}`)?.focus({ preventScroll: true }), 0);
  };
  const rename = (i: number, title: string) => {
    const t = title.trim();
    if (t) setSteps((x) => x.map((s, j) => (j === i ? { ...s, title: t } : s)));
    setRenaming(null);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      if (phase === "review" || phase === "paused") { e.preventDefault(); run(); }
      else if (phase === "gate" && (gateMode === "view" || gateMode === "edit")) { e.preventDefault(); approve(); }
    }
  };

  const counts = Object.values(out).reduce<Record<string, number>>((m, o) => (o.by ? { ...m, [o.by]: (m[o.by] ?? 0) + 1 } : m), {});
  const gated = steps.filter((s) => live(s) && s.gate === "ask").length;
  const doneN = steps.filter((s) => out[s.id]?.status === "done").length;
  const liveN = steps.filter(live).length;

  const STATUS: Record<Phase, string> = {
    drafting: "Drafting the plan",
    review: started ? "Paused for review" : "Waiting for your review",
    running: "Running",
    gate: "Waiting for you",
    failed: "A step failed",
    paused: "Paused",
    done: "Done",
    cancelled: "Cancelled",
  };

  return (
    <div className={`plgt plgt--${theme} ${className}`} data-phase={phase} onKeyDown={onKey}>
      <div className="plgt__card">
        <header className="plgt__head">
          <div className="plgt__task">
            <span className="plgt__label">Task</span>
            <h3 id={`${uid}-task`}>{task}</h3>
          </div>
          <div className="plgt__meta">
            <span className="plgt__model"><ClaudeLogo />Claude Opus 5.5</span>
            <span className="plgt__phase" data-p={phase}>
              <i aria-hidden="true" />
              {STATUS[phase]}
            </span>
          </div>
        </header>

        {replanned && (
          <p className="plgt__replan" role="note">
            <b>Replanned.</b> You denied “{replanned.title}”: <q>{replanned.reason}</q>. Struck steps won’t run; new ones are marked.
          </p>
        )}

        <ol className="plgt__steps" aria-labelledby={`${uid}-task`}>
          {steps.slice(0, phase === "drafting" ? drafted : steps.length).map((s, i) => {
            const o = out[s.id];
            const st = s.removed ? "removed" : o?.status ?? (s.gate === "skip" ? "skip" : "queued");
            const isCur = i === cursor && (phase === "gate" || phase === "failed" || phase === "running");
            const ed = editable(i);
            return (
              <li
                key={s.id}
                id={`${uid}-row-${s.id}`}
                className="plgt__step"
                data-s={st}
                data-risk={s.risk}
                data-added={s.added || undefined}
                data-current={isCur || undefined}
                tabIndex={ed ? 0 : -1}
                aria-label={ed ? `Step ${i + 1}: ${s.title}. Alt and arrow keys to move it.` : undefined}
                onKeyDown={(e) => {
                  if (!ed || e.target !== e.currentTarget || !e.altKey) return;
                  if (e.key === "ArrowUp") { e.preventDefault(); shift(i, -1); }
                  if (e.key === "ArrowDown") { e.preventDefault(); shift(i, 1); }
                }}
              >
                <span className="plgt__num" aria-hidden="true">
                  {o?.status === "done" ? I.tick : o?.status === "running" ? <i className="plgt__spin" /> : i + 1}
                </span>
                <div className="plgt__body">
                  <div className="plgt__row">
                    {renaming === s.id ? (
                      <input
                        className="plgt__rename"
                        defaultValue={s.title}
                        aria-label={`Rename step ${i + 1}`}
                        autoFocus
                        onBlur={(e) => rename(i, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { e.preventDefault(); rename(i, e.currentTarget.value); }
                          if (e.key === "Escape") { e.preventDefault(); setRenaming(null); }
                        }}
                      />
                    ) : ed ? (
                      <button type="button" className="plgt__title" aria-label={`${s.title} — edit wording`} onClick={() => setRenaming(s.id)}>
                        {s.title}
                      </button>
                    ) : (
                      <span className="plgt__title">{s.title}</span>
                    )}
                    {s.added && <span className="plgt__flag">new</span>}
                    {s.removed && <span className="plgt__flag" data-f="removed">removed</span>}
                  </div>
                  <div className="plgt__facts">
                    <code>{s.tool}</code>
                    <span className="plgt__risk" title={RISK_HINT[s.risk]}>
                      <i aria-hidden="true" />
                      {RISK_LABEL[s.risk]}
                    </span>
                    {o?.by && <span className="plgt__by" data-by={o.by}>{BY_LABEL[o.by]}</span>}
                    {o?.status === "failed" && <span className="plgt__by" data-by="failed">failed · attempt {o.attempts}</span>}
                  </div>
                  {o?.note && o.by !== "denied" && <p className="plgt__note">↳ your note: {o.note}</p>}
                  {o?.by === "denied" && o.note && <p className="plgt__note">↳ denied: {o.note}</p>}
                  {edits[s.id] != null && !isCur && <p className="plgt__note">↳ ran your edited version</p>}
                </div>

                {ed ? (
                  <div className="plgt__ctl">
                    <div className="plgt__gates" role="radiogroup" aria-label={`Gate for step ${i + 1}`}>
                      {gatesFor(s.risk).map((g) => (
                        <button key={g} type="button" role="radio" aria-checked={s.gate === g} data-g={g} onClick={() => setGate(i, g)}>
                          {GATE_LABEL[g]}
                        </button>
                      ))}
                    </div>
                    <div className="plgt__order">
                      <button type="button" aria-label={`Move step ${i + 1} up`} disabled={i <= cursor || !editable(i - 1)} onClick={() => shift(i, -1)}>{I.up}</button>
                      <button type="button" aria-label={`Move step ${i + 1} down`} disabled={i >= steps.length - 1 || !editable(i + 1)} onClick={() => shift(i, 1)}>{I.down}</button>
                    </div>
                  </div>
                ) : (
                  !s.removed && <span className="plgt__gatetag" data-g={s.gate}>{GATE_LABEL[s.gate]}</span>
                )}

                {/* ---------- the gate ---------- */}
                {isCur && phase === "gate" && (
                  <div className="plgt__gate" ref={gateRef} role="group" aria-label={`Gate: ${s.title}`}>
                    {gateMode === "edit" ? (
                      <label className="plgt__edit">
                        <span>Edit what it will run</span>
                        <textarea data-first value={editText} rows={Math.min(6, editText.split("\n").length + 1)} onChange={(e) => setEditText(e.target.value)} />
                      </label>
                    ) : (
                      <PreviewBlock p={s.preview} edited={edits[s.id]} />
                    )}
                    {s.risk === "irreversible" && gateMode === "view" && (
                      <p className="plgt__warn">{I.warn}This can’t be undone. It stays gated whatever you choose above.</p>
                    )}
                    {gateMode === "deny" && (
                      <label className="plgt__edit">
                        <span>Why not? The agent replans around your reason.</span>
                        <input data-first value={reason} placeholder="e.g. other services still use the old key until Friday" onChange={(e) => setReason(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); deny(); } if (e.key === "Escape") setGateMode("view"); }} />
                      </label>
                    )}
                    {gateMode === "handed" && <p className="plgt__handed">{I.hand}It’s yours. The agent waits until you mark it done.</p>}

                    <div className="plgt__acts">
                      {gateMode === "view" && (
                        <>
                          <button type="button" className="plgt__btn" data-k="go" data-first onClick={approve}>
                            Approve <kbd aria-hidden="true">⌘↵</kbd>
                          </button>
                          <button type="button" className="plgt__btn" onClick={() => { setEditText(edits[s.id] ?? previewText(s.preview)); setGateMode("edit"); }}>Edit</button>
                          <button type="button" className="plgt__btn" data-k="no" onClick={() => setGateMode("deny")}>Deny</button>
                          <button type="button" className="plgt__btn" onClick={takeOver}>Take over</button>
                        </>
                      )}
                      {gateMode === "edit" && (
                        <>
                          <button type="button" className="plgt__btn" data-k="go" onClick={approve}>Approve edited <kbd aria-hidden="true">⌘↵</kbd></button>
                          <button type="button" className="plgt__btn" onClick={() => setGateMode("view")}>Cancel</button>
                        </>
                      )}
                      {gateMode === "deny" && (
                        <>
                          <button type="button" className="plgt__btn" data-k="no" onClick={deny}>Deny and replan</button>
                          <button type="button" className="plgt__btn" onClick={() => setGateMode("view")}>Back</button>
                        </>
                      )}
                      {gateMode === "handed" && (
                        <button type="button" className="plgt__btn" data-k="go" data-first onClick={handedDone}>Mark done</button>
                      )}
                    </div>
                  </div>
                )}

                {isCur && phase === "failed" && (
                  <div className="plgt__gate" data-fail ref={gateRef} role="group" aria-label={`${s.title} failed`}>
                    <pre className="plgt__pre" data-err>{"✕ payments › refunds › settles partial refund\n  timeout after 8000 ms (flaky: passed 41 of the last 42 runs)"}</pre>
                    <div className="plgt__acts">
                      <button type="button" className="plgt__btn" data-k="go" data-first onClick={retry}>{I.retry}Retry</button>
                      <button type="button" className="plgt__btn" onClick={skipFailed}>Skip step</button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* ---------- footer ---------- */}
        {phase === "done" || phase === "cancelled" ? (
          <section className="plgt__receipt" aria-label="Run receipt">
            <h4>{phase === "done" ? "Receipt" : "Stopped"}</h4>
            <ul>
              {(["auto", "approved", "edited", "you", "skipped", "denied"] as const).filter((k) => counts[k]).map((k) => (
                <li key={k} data-by={k}><b>{counts[k]}</b> {BY_LABEL[k]}</li>
              ))}
              {phase === "cancelled" && <li data-by="skipped"><b>{steps.filter((s) => live(s) && !out[s.id]?.by).length}</b> never ran</li>}
            </ul>
            <button type="button" className="plgt__btn" onClick={restart}>Draft a new plan</button>
          </section>
        ) : (
          <footer className="plgt__foot">
            {phase === "review" || phase === "paused" || phase === "drafting" ? (
              <>
                <p className="plgt__sum">
                  {liveN} steps · {gated} gated
                  <span> · the agent stops at each gated step and shows you exactly what it will do.</span>
                </p>
                <button ref={runRef} type="button" className="plgt__run" disabled={phase === "drafting"} onClick={run}>
                  {I.play}
                  {started ? "Continue" : "Run plan"}
                  <kbd aria-hidden="true">⌘↵</kbd>
                </button>
              </>
            ) : (
              <>
                <form
                  className="plgt__steer"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!steer.trim()) return;
                    setQueued(steer.trim());
                    setSteer("");
                    setSay("Note queued for the next step.");
                  }}
                >
                  <input value={steer} aria-label="Steer the agent: a note for the next step" placeholder={queued ? `Queued: “${queued}”` : "Steer: a note for the next step…"} onChange={(e) => setSteer(e.target.value)} />
                </form>
                <span className="plgt__progress" aria-hidden="true">{doneN}/{liveN}</span>
                <button type="button" className="plgt__icon" aria-label="Pause the run" disabled={phase !== "running"} onClick={() => { setPhase("paused"); setSay("Paused. You can edit what hasn’t run."); }}>{I.pause}</button>
                <button type="button" className="plgt__icon" aria-label="Cancel the run" onClick={cancel}>{I.x}</button>
              </>
            )}
          </footer>
        )}
      </div>
      <p className="plgt__sr" role="status" aria-live="polite">{say}</p>
    </div>
  );
}
