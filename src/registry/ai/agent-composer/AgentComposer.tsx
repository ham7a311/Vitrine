"use client";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import { MakerLogo, ModeIcon } from "./logos";
import { EFFORTS, EFFORT_HINT, EFFORT_LABEL, MODELS, MODES, TREE, byPath, flat, fmt, lanes, usage, type ModeId, type ModelId, type Node as Entry } from "./scope";
import "./agent-composer.css";

/**
 * Agent Composer
 * The prompt is the surface; everything else lives on one quiet row beneath it. The mode pill says how
 * the agent will work (and takes that mode's colour), the model shows whose model it is, the effort bars
 * say how hard it will think, and the ring says how full the context is. One round button does the rest.
 */

export type AgentBrief = { text: string; mode: ModeId; model: ModelId; effort: (typeof EFFORTS)[number]; files: string[] };

export type AgentComposerProps = {
  defaultMode?: ModeId;
  defaultModel?: ModelId;
  defaultEffort?: number;
  defaultFiles?: string[];
  placeholder?: string;
  onSend?: (brief: AgentBrief) => void;
  theme?: "dark" | "light";
  className?: string;
};

type Menu = null | "context" | "mode" | "model" | "usage";
type Run = { state: "running" | "done" | "stopped"; brief: AgentBrief; step: number; steps: string[] };
type Speech = { start(): void; stop(): void; abort(): void; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null; interimResults: boolean; continuous: boolean };

const LINE = 24, MIN_ROWS = 3, MAX_ROWS = 12;

function stepsFor(b: AgentBrief): string[] {
  const n = b.files.length, files = n === 1 ? "1 file" : `${n} files`, k = lanes(b.text);
  switch (b.mode) {
    case "ask": return [n ? `Reading ${files}` : "Reading the question", "Writing the answer", "Answered"];
    case "plan": return [n ? `Reading ${files}` : "Surveying the repo", "Ordering the steps", "Plan ready · 5 steps to review"];
    case "debug": return ["Reproducing the failure", "Adding logging around the export", "Narrowed to one cause"];
    case "multitask": return [`Starting ${k} tasks`, `${k} tasks running side by side`, `${k} tasks ready for review`];
    default: return [n ? `Reading ${files}` : "Reading the repo", "Editing exporter/retry.ts", "Running the tests", "2 files changed · tests pass"];
  }
}

const I = {
  chev: <svg viewBox="0 0 16 16" aria-hidden="true" className="agcm__chev"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" /></svg>,
  x: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 5 6 6m0-6-6 6" /></svg>,
  tick: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>,
  clip: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m13.2 7.6-5 5a3.2 3.2 0 0 1-4.6-4.5l5.3-5.3a2.1 2.1 0 0 1 3 3L6.6 11a1.05 1.05 0 0 1-1.5-1.5l4.6-4.6" /></svg>,
  up: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3.5M3.75 7.5 8 3.25l4.25 4.25" /></svg>,
  stop: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4.25" y="4.25" width="7.5" height="7.5" rx="1.5" className="agcm__solid" /></svg>,
  mic: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5.75" y="1.75" width="4.5" height="8" rx="2.25" /><path d="M3.5 7.75a4.5 4.5 0 0 0 9 0M8 12.25V14.5" /></svg>,
  search: <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.25" /><path d="m10.2 10.2 3.3 3.3" /></svg>,
  folder: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4.5a1 1 0 0 1 1-1h3.2l1.5 1.5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1Z" /></svg>,
  caret: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>,
};

/** A short file-type badge reads faster than a generic file icon: TS, MD, SQL, LOG. */
function Kind({ path, dir }: { path: string; dir: boolean }) {
  if (dir) return <span className="agcm__kind" data-k="dir">{I.folder}</span>;
  const ext = path.split(".").pop()!.toLowerCase();
  const label = ext === "ts" || ext === "tsx" ? "TS" : ext.slice(0, 3).toUpperCase();
  return <span className="agcm__kind" data-k={ext}>{label}</span>;
}

export function AgentComposer({ defaultMode = "agent", defaultModel = "opus", defaultEffort = 2, defaultFiles = [], placeholder = "Describe a task — @ to add files", onSend, theme = "dark", className = "" }: AgentComposerProps) {
  const id = useId();
  const [mode, setMode] = useState<ModeId>(defaultMode);
  const [model, setModel] = useState<ModelId>(defaultModel);
  const [effort, setEffort] = useState(defaultEffort);
  const [files, setFiles] = useState<string[]>(defaultFiles);
  const [text, setText] = useState("");
  const [menu, setMenu] = useState<Menu>(null);
  const [query, setQuery] = useState("");
  const [at, setAt] = useState<number | null>(null);
  const [open, setOpen] = useState<Set<string>>(() => new Set(["exporter"]));
  const [active, setActive] = useState(0);
  const [run, setRun] = useState<Run | null>(null);
  const [listening, setListening] = useState(false);
  const [say, setSay] = useState("");
  const [below, setBelow] = useState(false);
  const [anchor, setAnchor] = useState<{ bottom?: number; top?: number } | null>(null);
  const [hint, setHint] = useState<ModeId | null>(null); // the mode row under the pointer or focus

  const card = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const mirror = useRef<HTMLDivElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const btn = { context: useRef<HTMLButtonElement>(null), mode: useRef<HTMLButtonElement>(null), model: useRef<HTMLButtonElement>(null), usage: useRef<HTMLButtonElement>(null) };
  const token = useRef(0);
  const speech = useRef<Speech | null>(null);

  const M = MODES.find((m) => m.id === mode)!;
  const Mo = MODELS.find((m) => m.id === model)!;
  const use = useMemo(() => usage(files, effort, Mo), [files, effort, Mo]);
  const pct = Math.round(use.pct * 100);
  const level = use.pct > 0.85 ? "full" : use.pct > 0.65 ? "warn" : "ok";
  const empty = !text.trim();
  const busy = run?.state === "running";
  const count = lanes(text);
  const action = busy ? "stop" : listening ? "listening" : empty ? "mic" : "send";

  /* ---------- context list: a tree, or flat matches while searching ---------- */
  const q = (at !== null ? text.slice(at + 1, area.current?.selectionStart ?? text.length) : query).trim().toLowerCase();
  const rows = useMemo(() => {
    if (q) return flat().filter((n) => n.path.toLowerCase().includes(q)).map((n) => ({ n, depth: 0 }));
    const out: { n: Entry; depth: number }[] = [];
    for (const n of TREE) {
      out.push({ n, depth: 0 });
      if (n.children && open.has(n.path)) for (const c of n.children) out.push({ n: c, depth: 1 });
    }
    return out;
  }, [q, open]);
  const picked = (p: string) => files.includes(p) || files.some((f) => p.startsWith(f + "/"));
  useEffect(() => setActive(0), [q]);

  /* ---------- the textarea grows with its text; the lane mirror follows its scroll ---------- */
  useLayoutEffect(() => {
    const t = area.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = `${Math.min(Math.max(t.scrollHeight, LINE * MIN_ROWS + 12), LINE * MAX_ROWS + 12)}px`;
    if (mirror.current) mirror.current.style.transform = `translateY(${-t.scrollTop}px)`;
  }, [text, mode]);

  /* ---------- menus: outside click, placement, focus ---------- */
  useEffect(() => {
    if (!menu) return;
    const down = (e: PointerEvent) => {
      const t = e.target as Node;
      if (pop.current?.contains(t) || Object.values(btn).some((b) => b.current?.contains(t))) return;
      if (at !== null && area.current?.contains(t)) return;
      setMenu(null);
      setAt(null);
    };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  });
  useLayoutEffect(() => {
    if (!menu) { setBelow(false); setAnchor(null); return; }
    const box = card.current?.getBoundingClientRect();
    const h = pop.current?.offsetHeight ?? 0;
    if (!box) return;
    /* Mode and model menus open right at their button, not above the whole card. */
    const trig = menu === "mode" || menu === "model" ? btn[menu].current?.getBoundingClientRect() : null;
    if (trig) {
      const flip = trig.top - 6 - h < 8 && window.innerHeight - trig.bottom > trig.top - h;
      setBelow(flip);
      setAnchor(flip ? { top: trig.bottom - box.top + 6 } : { bottom: box.bottom - trig.top + 6 });
      return;
    }
    setAnchor(null);
    setBelow(box.top - 6 - h < 8 && window.innerHeight - box.bottom > box.top - h);
  }, [menu]);
  useEffect(() => {
    if (!menu || at !== null) return;
    requestAnimationFrame(() => {
      if (menu === "context") return search.current?.focus();
      const items = [...(pop.current?.querySelectorAll<HTMLElement>("[role^='menuitem'], button") ?? [])];
      (items.find((i) => i.getAttribute("aria-checked") === "true") ?? items[0])?.focus();
    });
  }, [menu, at]);

  /* ---------- the simulated run ---------- */
  useEffect(() => {
    if (run?.state !== "running") return;
    const t0 = token.current;
    const t = setTimeout(() => {
      if (t0 !== token.current) return;
      setRun((r) => (!r || r.state !== "running" ? r : r.step + 1 >= r.steps.length - 1 ? { ...r, step: r.steps.length - 1, state: "done" } : { ...r, step: r.step + 1 }));
    }, run.step === 0 ? 900 : 1300);
    return () => clearTimeout(t);
  }, [run]);
  useEffect(() => () => { token.current += 1; speech.current?.abort(); }, []);
  const done = run?.state === "done" ? run.steps[run.steps.length - 1] : null;
  useEffect(() => {
    if (done) {
      setSay(`Done. ${done}.`);
      requestAnimationFrame(() => area.current?.focus());
    }
  }, [done]);

  const close = (back?: Exclude<Menu, null>) => {
    setMenu(null);
    setQuery("");
    if (at !== null) { setAt(null); area.current?.focus(); }
    else (back ? btn[back].current : area.current)?.focus();
  };
  const toggle = (m: Exclude<Menu, null>) => {
    setAt(null);
    setHint(null);
    setQuery("");
    setMenu((cur) => (cur === m ? null : m));
  };
  const chooseMode = (m: ModeId) => {
    setMode(m);
    const x = MODES.find((y) => y.id === m)!;
    setSay(`${x.name} mode. ${x.does}`);
  };
  const setLevel = (n: number) => {
    const v = Math.max(0, Math.min(EFFORTS.length - 1, n));
    if (v !== effort) { setEffort(v); setSay(`Effort ${EFFORT_LABEL[v]}. ${EFFORT_HINT[v]}`); }
  };
  const togglePath = (p: string) => {
    setSay(files.includes(p) ? `Removed ${p}` : `Added ${p}`);
    setFiles((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur.filter((x) => !x.startsWith(p + "/")), p]));
  };
  const remove = (p: string) => {
    setFiles((cur) => cur.filter((x) => x !== p));
    setSay(`Removed ${p}. The agent can no longer see it.`);
    area.current?.focus();
  };
  const pickAt = (n: Entry) => {
    if (at === null) return;
    const end = area.current?.selectionStart ?? text.length;
    const word = n.name.split("/").pop()! + (n.children ? "/" : "");
    const caret = at + word.length + 1;
    setText(text.slice(0, at) + word + " " + text.slice(end).replace(/^ /, ""));
    if (!picked(n.path)) togglePath(n.path);
    setAt(null);
    setMenu(null);
    requestAnimationFrame(() => area.current?.setSelectionRange(caret, caret));
  };

  const listKey = (e: KeyboardEvent) => {
    const r = rows[active];
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a + (e.key === "ArrowDown" ? 1 : rows.length - 1)) % Math.max(1, rows.length));
      return true;
    }
    if (e.key === "ArrowRight" && r?.n.children && !q) { e.preventDefault(); setOpen((s) => new Set(s).add(r.n.path)); return true; }
    if (e.key === "ArrowLeft" && !q && r) {
      e.preventDefault();
      const parent = r.depth ? rows.findIndex((x) => x.n.path === r.n.path.split("/")[0]) : -1;
      if (r.n.children && open.has(r.n.path)) setOpen((s) => { const n = new Set(s); n.delete(r.n.path); return n; });
      else if (parent >= 0) setActive(parent);
      return true;
    }
    if (e.key === "Escape") { e.preventDefault(); close("context"); return true; }
    if (at !== null && (e.key === "Enter" || e.key === "Tab") && r) { e.preventDefault(); pickAt(r.n); return true; }
    if (at === null && e.key === " " && r && (e.target as HTMLElement).tagName !== "INPUT") { e.preventDefault(); togglePath(r.n.path); return true; }
    if (at === null && e.key === "Enter" && r) { e.preventDefault(); togglePath(r.n.path); return true; }
    return false;
  };
  const menuKey = (e: KeyboardEvent<HTMLDivElement>, back: Exclude<Menu, null>) => {
    const items = [...(pop.current?.querySelectorAll<HTMLElement>("[role^='menuitem']") ?? [])];
    const k = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); items[(k + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length]?.focus(); }
    else if (e.key === "Home" || e.key === "End") { e.preventDefault(); items[e.key === "Home" ? 0 : items.length - 1]?.focus(); }
    else if (e.key === "Escape") { e.preventDefault(); close(back); }
    else if (e.key === "Tab") setMenu(null);
  };

  /* ---------- voice: Web Speech where it exists, an honest message where it doesn't ---------- */
  const listen = () => {
    if (listening) { speech.current?.stop(); return; }
    const W = window as unknown as { SpeechRecognition?: new () => Speech; webkitSpeechRecognition?: new () => Speech };
    const Ctor = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (!Ctor) { setSay("Voice input isn't available in this browser."); area.current?.focus(); return; }
    const rec = new Ctor();
    const base = text;
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e) => setText((base ? base + " " : "") + Array.from(e.results).map((r) => r[0].transcript).join(""));
    rec.onend = () => { setListening(false); speech.current = null; area.current?.focus(); };
    rec.onerror = () => setSay("Couldn't hear that. Check the microphone permission.");
    speech.current = rec;
    setListening(true);
    setSay("Listening.");
    rec.start();
  };

  /* ---------- the round button: dictate → send → stop ---------- */
  const go = () => {
    if (busy) {
      token.current += 1;
      setRun((r) => (r ? { ...r, state: "stopped" } : r));
      setSay("Stopped. Nothing further will change.");
      return;
    }
    if (listening || empty) return listen();
    const brief: AgentBrief = { text: text.trim(), mode, model, effort: EFFORTS[effort], files };
    token.current += 1;
    setMenu(null);
    setRun({ state: "running", brief, step: 0, steps: stepsFor(brief) });
    setText("");
    setSay(`Sent to ${Mo.name} in ${M.name} mode, ${EFFORT_LABEL[effort]} effort.`);
    onSend?.(brief);
  };

  const onAreaKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (at !== null && menu === "context" && listKey(e)) return;
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      chooseMode(MODES[(MODES.findIndex((m) => m.id === mode) + 1) % MODES.length].id);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!empty && !busy) go();
    }
  };
  const onAreaInput = (v: string, caret: number) => {
    setText(v);
    const m = /(^|\s)@([\w./-]*)$/.exec(v.slice(0, caret));
    if (m) { setAt(caret - m[2].length - 1); setMenu("context"); }
    else if (at !== null) { setAt(null); setMenu(null); }
  };

  /* ---------- effort: drag across the bars, click the label to step, arrows on the keyboard ---------- */
  const scrub = (e: RPointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setLevel(Math.floor(((e.clientX - r.left) / r.width) * EFFORTS.length));
  };
  const effortKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const to = e.key === "ArrowRight" || e.key === "ArrowUp" ? effort + 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? effort - 1 : e.key === "Home" ? 0 : e.key === "End" ? EFFORTS.length - 1 : e.key === " " || e.key === "Enter" ? (effort + 1) % EFFORTS.length : null;
    if (to !== null) { e.preventDefault(); setLevel(to); }
  };

  const activeRow = rows[active];
  const optId = (p: string) => `${id}-o-${p.replace(/[^\w]/g, "_")}`;
  const largest = [...files].sort((a, b) => (byPath(b)?.tokens ?? 0) - (byPath(a)?.tokens ?? 0))[0];
  const R = run ? MODES.find((m) => m.id === run.brief.mode)! : null;

  return (
    <div className={`agcm agcm--${theme} ${className}`} data-mode={mode} data-model={model === "opus" ? "claude" : model} data-effort={effort} data-level={level}>
      <div ref={card} className="agcm__card">
        {/* ---------- the last run, as one line ---------- */}
        {run && R && (
          <div className="agcm__run" data-s={run.state} data-m={run.brief.mode} aria-live="polite">
            <span className="agcm__runicon" aria-hidden="true">
              {run.state === "running" ? <i className="agcm__spin" /> : run.state === "done" ? I.tick : I.stop}
            </span>
            <span className="agcm__runmode"><ModeIcon id={run.brief.mode} />{R.name}</span>
            <span className="agcm__runstep">{run.state === "stopped" ? `Stopped — ${run.steps[run.step].toLowerCase()}` : run.steps[run.step]}</span>
            <span className="agcm__runbrief" title={run.brief.text}>{run.brief.text}</span>
          </div>
        )}

        {/* ---------- what it can see ---------- */}
        {files.length > 0 && (
          <ul className="agcm__chips" aria-label="Context the agent can see">
            {files.map((p) => {
              const n = byPath(p)!;
              const name = p.slice(p.lastIndexOf("/") + 1) + (n.children ? "/" : "");
              return (
                <li key={p} className="agcm__chip" title={`${p} · ${fmt(n.tokens)} tokens`}>
                  <Kind path={p} dir={!!n.children} />
                  <span className="agcm__cname">{name}</span>
                  <button type="button" className="agcm__rm" aria-label={`Remove ${p}`} onClick={() => remove(p)}>{I.x}</button>
                </li>
              );
            })}
          </ul>
        )}

        {/* ---------- the prompt ---------- */}
        <div className="agcm__field" data-lanes={mode === "multitask" && count > 0 ? "" : undefined}>
          <div className="agcm__mirror" aria-hidden="true">
            <div ref={mirror}>
              {(text || " ").split("\n").map((l, i) => (
                <div key={i} className="agcm__line" data-on={l.trim() ? "" : undefined}>{l || " "}</div>
              ))}
            </div>
          </div>
          <label htmlFor={`${id}-ta`} className="agcm__sr">Message, {M.name} mode</label>
          <textarea
            ref={area}
            id={`${id}-ta`}
            value={text}
            rows={MIN_ROWS}
            placeholder={mode === "multitask" ? "One task per line — they run side by side" : placeholder}
            disabled={busy}
            spellCheck
            aria-keyshortcuts="Shift+Tab"
            aria-controls={at !== null ? `${id}-list` : undefined}
            aria-activedescendant={at !== null && menu === "context" && activeRow ? optId(activeRow.n.path) : undefined}
            aria-autocomplete="list"
            onChange={(e) => onAreaInput(e.target.value, e.target.selectionStart)}
            onKeyDown={onAreaKey}
            onScroll={(e) => mirror.current && (mirror.current.style.transform = `translateY(${-e.currentTarget.scrollTop}px)`)}
          />
        </div>

        {/* ---------- one quiet row ---------- */}
        <div className="agcm__foot">
          <div className="agcm__left">
            <button ref={btn.mode} type="button" className="agcm__mode" aria-haspopup="menu" aria-expanded={menu === "mode"} aria-controls={`${id}-pop`} aria-label={`Mode: ${M.name}`} onClick={() => toggle("mode")}>
              <ModeIcon id={mode} />
              <span>{M.name}</span>
              {I.chev}
            </button>
            <button ref={btn.model} type="button" className="agcm__model" aria-haspopup="menu" aria-expanded={menu === "model"} aria-controls={`${id}-pop`} aria-label={`Model: ${Mo.name}`} onClick={() => toggle("model")}>
              <MakerLogo maker={Mo.maker} />
              <span className="agcm__mname">{Mo.name}</span>
              {I.chev}
            </button>
            <div
              className="agcm__effort"
              role="slider"
              tabIndex={0}
              aria-label="Effort"
              aria-valuemin={0}
              aria-valuemax={EFFORTS.length - 1}
              aria-valuenow={effort}
              aria-valuetext={`${EFFORT_LABEL[effort]}: ${EFFORT_HINT[effort]}`}
              title={EFFORT_HINT[effort]}
              onKeyDown={effortKey}
            >
              <span
                className="agcm__bars"
                aria-hidden="true"
                onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); scrub(e); }}
                onPointerMove={(e) => e.buttons && scrub(e)}
              >
                {EFFORTS.map((_, i) => (
                  <i key={i} data-on={i <= effort || undefined} style={{ ["--h" as string]: `${4 + i * 2.5}px` }} />
                ))}
              </span>
              <span className="agcm__elabel" aria-hidden="true" onClick={() => setLevel((effort + 1) % EFFORTS.length)}>
                {EFFORT_LABEL[effort]}
              </span>
            </div>
          </div>

          <div className="agcm__right">
            <button ref={btn.usage} type="button" className="agcm__icon agcm__usage" aria-haspopup="dialog" aria-expanded={menu === "usage"} aria-controls={`${id}-pop`} aria-label={`Context ${pct}% full. Show what's using it`} title={`${pct}% of context used`} onClick={() => toggle("usage")}>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="agcm__ring">
                <circle cx="10" cy="10" r="7" pathLength={100} />
                <circle cx="10" cy="10" r="7" pathLength={100} style={{ strokeDasharray: `${Math.max(1, pct)} 100` }} />
              </svg>
            </button>
            <button ref={btn.context} type="button" className="agcm__icon" aria-haspopup="dialog" aria-expanded={menu === "context" && at === null} aria-controls={`${id}-pop`} aria-label="Add files to context" title="Add files (or type @)" onClick={() => toggle("context")}>
              {I.clip}
            </button>
            <button
              type="button"
              className="agcm__go"
              data-a={action}
              aria-label={action === "stop" ? "Stop" : action === "listening" ? "Stop listening" : action === "mic" ? "Dictate" : mode === "multitask" && count > 1 ? `Start ${count} tasks` : `Send in ${M.name} mode`}
              onClick={go}
            >
              {action === "stop" ? I.stop : action === "send" ? I.up : I.mic}
            </button>
          </div>
        </div>

        {/* ---------- popovers ---------- */}
        {menu && (
          <div
            ref={pop}
            id={`${id}-pop`}
            className={`agcm__pop agcm__pop--${menu}`}
            data-below={below || undefined}
            style={{
              ...(menu === "model" && btn.model.current ? { ["--x" as string]: `${btn.model.current.offsetLeft}px` } : null),
              ...(anchor && (menu === "mode" || menu === "model") ? (anchor.top != null ? { top: anchor.top, bottom: "auto" } : { bottom: anchor.bottom }) : null),
            }}
            role={menu === "mode" || menu === "model" ? "menu" : "dialog"}
            aria-label={menu === "mode" ? "Mode" : menu === "model" ? "Model" : menu === "usage" ? "Context usage" : "Add files"}
            onKeyDown={menu === "mode" || menu === "model" ? (e) => menuKey(e, menu) : menu === "usage" ? (e) => e.key === "Escape" && close("usage") : undefined}
          >
            {menu === "mode" &&
              MODES.map((m) => (
                <button key={m.id} type="button" role="menuitemradio" aria-checked={m.id === mode} aria-description={`${m.does} ${m.can}.`} tabIndex={-1} className="agcm__item" data-m={m.id} onFocus={() => setHint(m.id)} onPointerEnter={() => setHint(m.id)} onClick={() => { chooseMode(m.id); close("mode"); }}>
                  <ModeIcon id={m.id} />
                  <span className="agcm__iname">{m.name}</span>
                  <span className="agcm__check" aria-hidden="true">{m.id === mode && I.tick}</span>
                </button>
              ))}
            {menu === "mode" && (() => {
              const h = MODES.find((x) => x.id === (hint ?? mode))!;
              return (
                <p className="agcm__pophint" aria-hidden="true" data-m={h.id}>
                  <span>{h.does}</span>
                  <span className="agcm__can">{h.can}</span>
                </p>
              );
            })()}

            {menu === "model" &&
              MODELS.map((m) => (
                <button key={m.id} type="button" role="menuitemradio" aria-checked={m.id === model} tabIndex={-1} className="agcm__item agcm__item--model" data-mo={m.id === "opus" ? "claude" : m.id} onClick={() => { setModel(m.id); setSay(`Model: ${m.name}`); close("model"); }}>
                  <MakerLogo maker={m.maker} />
                  <span className="agcm__iname">{m.name}</span>
                  <span className="agcm__iwin" title={`${m.makerName} · ${fmt(m.window)} context`}>{fmt(m.window)}</span>
                  <span className="agcm__check" aria-hidden="true">{m.id === model && I.tick}</span>
                </button>
              ))}

            {menu === "usage" && (
              <div className="agcm__use">
                <p className="agcm__usehead"><strong>{pct}%</strong> of {fmt(use.window)} used<span>{fmt(use.used)} tokens</span></p>
                <div className="agcm__bar" aria-hidden="true">
                  {use.parts.map((p) => <span key={p.id} data-p={p.id} style={{ width: `${(p.tokens / use.window) * 100}%` }} />)}
                </div>
                <ul className="agcm__legend">
                  {use.parts.map((p) => (
                    <li key={p.id} data-p={p.id}><i aria-hidden="true" />{p.label}<span>{fmt(p.tokens)}</span></li>
                  ))}
                </ul>
                {files.length > 0 && (
                  <button type="button" className="agcm__ghost" onClick={() => { remove(largest); setMenu(null); }}>
                    Remove {largest.split("/").pop()}<span>−{fmt(byPath(largest)?.tokens ?? 0)}</span>
                  </button>
                )}
              </div>
            )}

            {menu === "context" && (
              <div className="agcm__ctx" onKeyDown={at === null ? (e) => listKey(e) : undefined}>
                {at === null && (
                  <div className="agcm__search">
                    {I.search}
                    <input ref={search} type="text" role="combobox" aria-expanded="true" aria-controls={`${id}-list`} aria-activedescendant={activeRow ? optId(activeRow.n.path) : undefined} aria-label="Search files" placeholder="Search files" value={query} onChange={(e) => setQuery(e.target.value)} />
                  </div>
                )}
                <ul id={`${id}-list`} role="listbox" aria-multiselectable="true" aria-label="Files and folders" className="agcm__list">
                  {rows.length === 0 && <li className="agcm__nomatch">No file matches “{q}”</li>}
                  {rows.map(({ n, depth }, i) => {
                    const on = picked(n.path);
                    const dir = !!n.children;
                    return (
                      <li
                        key={n.path}
                        id={optId(n.path)}
                        role="option"
                        aria-selected={on}
                        data-active={i === active || undefined}
                        data-depth={depth}
                        className="agcm__row"
                        onPointerDown={(e) => e.preventDefault()}
                        onPointerEnter={() => setActive(i)}
                        onClick={() => (at !== null ? pickAt(n) : togglePath(n.path))}
                      >
                        {dir && !q ? (
                          <span className="agcm__twist" data-open={open.has(n.path) || undefined} aria-hidden="true" onClick={(e) => { e.stopPropagation(); setOpen((s) => { const x = new Set(s); if (x.has(n.path)) x.delete(n.path); else x.add(n.path); return x; }); }}>{I.caret}</span>
                        ) : (
                          <span className="agcm__twist" aria-hidden="true" />
                        )}
                        <Kind path={n.path} dir={dir} />
                        <span className="agcm__rname">{q ? n.path : n.name}{dir && "/"}</span>
                        <span className="agcm__tok">{fmt(n.tokens)}</span>
                        <span className="agcm__check" aria-hidden="true">{on && I.tick}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="agcm__sr" role="status" aria-live="polite">{say}</p>
    </div>
  );
}
