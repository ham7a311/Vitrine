"use client";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import { MakerLogo, type Maker } from "./logos";
import "./model-roster.css";

/**
 * Model Roster
 * The settings list that decides which models show up in the picker. Each row is the maker's mark, the
 * model's name and a switch; the search field filters by name or maker and, when nothing matches, offers
 * to add what you typed. The switch says on and off with a glyph as well as a colour, can be dragged
 * like a physical one, and refuses to turn off the last model that's still on.
 */

export type RosterModel = { id: string; name: string; maker: Maker; on: boolean };

export type ModelRosterProps = {
  models: RosterModel[];
  /** Shown after "View All Models". */
  more?: RosterModel[];
  onChange?: (id: string, on: boolean) => void;
  onRefresh?: () => Promise<void> | void;
  theme?: "dark" | "light";
  className?: string;
};

const MAKER_NAME: Record<Maker, string> = { openai: "OpenAI", claude: "Claude", xai: "xAI", cursor: "Cursor", custom: "Custom" };

/* ---------------- the switch ---------------- */
const TRAVEL = 14; // px the knob moves between off and on

function Switch({ on, label, onToggle, refuse }: { on: boolean; label: string; onToggle: (to: boolean) => void; refuse: boolean }) {
  const [drag, setDrag] = useState<number | null>(null); // knob offset while dragging, 0..TRAVEL
  const [press, setPress] = useState(false);
  const [nope, setNope] = useState(false);
  const start = useRef<{ x: number; from: number; moved: boolean } | null>(null);
  const swallow = useRef(false);

  const flip = (to: boolean) => {
    if (to === on) return;
    if (!to && refuse) {
      setNope(true);
      window.setTimeout(() => setNope(false), 420);
      return;
    }
    onToggle(to);
  };
  const down = (e: RPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, from: on ? TRAVEL : 0, moved: false };
    setPress(true);
  };
  const move = (e: RPointerEvent<HTMLButtonElement>) => {
    const s = start.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 3) s.moved = true;
    if (s.moved) setDrag(Math.max(0, Math.min(TRAVEL, s.from + dx)));
  };
  const up = () => {
    const s = start.current;
    start.current = null;
    setPress(false);
    if (s?.moved && drag !== null) {
      // A drag decides by where the knob was let go, and the click that follows is ignored.
      swallow.current = true;
      flip(drag > TRAVEL / 2);
    }
    setDrag(null);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className="mrst__switch"
      data-press={press || undefined}
      data-drag={drag !== null || undefined}
      data-nope={nope || undefined}
      style={drag !== null ? { ["--x" as string]: `${drag}px` } : undefined}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onClick={(e) => {
        e.stopPropagation();
        if (swallow.current) { swallow.current = false; return; }
        flip(!on);
      }}
    >
      <span className="mrst__track" aria-hidden="true">
        <svg className="mrst__on" viewBox="0 0 10 10"><path d="M2.2 5.2 4.1 7l3.7-4" /></svg>
        <svg className="mrst__off" viewBox="0 0 10 10"><circle cx="5" cy="5" r="2.6" /></svg>
        <span className="mrst__knob" />
      </span>
    </button>
  );
}

/* ---------------- the roster ---------------- */
function Mark({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function ModelRoster({ models: initial, more = [], onChange, onRefresh, theme = "dark", className = "" }: ModelRosterProps) {
  const uid = useId();
  const [models, setModels] = useState<RosterModel[]>(() => [...initial, ...more]);
  const [all, setAll] = useState(false);
  const [query, setQuery] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [fresh, setFresh] = useState<string | null>(null);
  const [say, setSay] = useState("");
  const list = useRef<HTMLUListElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const extra = useMemo(() => new Set(more.map((m) => m.id)), [more]);

  const q = query.trim();
  const ql = q.toLowerCase();
  const shown = useMemo(() => {
    if (ql) return models.filter((m) => m.name.toLowerCase().includes(ql) || MAKER_NAME[m.maker].toLowerCase().includes(ql));
    return all ? models : models.filter((m) => !extra.has(m.id));
  }, [models, ql, all, extra]);
  const exact = models.find((m) => m.name.toLowerCase() === ql);
  const onCount = models.filter((m) => m.on).length;
  // Searching for a maker ("claude") is a filter, not a model to add.
  const makerSearch = !!ql && [...Object.values(MAKER_NAME), "anthropic"].some((n) => n.toLowerCase().startsWith(ql));
  const canAdd = !!q && !exact && !makerSearch;

  useEffect(() => {
    if (!fresh) return;
    const t = window.setTimeout(() => setFresh(null), 1600);
    return () => clearTimeout(t);
  }, [fresh]);

  const toggle = (m: RosterModel, to: boolean) => {
    setModels((xs) => xs.map((x) => (x.id === m.id ? { ...x, on: to } : x)));
    setSay(`${m.name} ${to ? "on — it will appear in the model picker" : "off"}.`);
    onChange?.(m.id, to);
  };
  const add = () => {
    if (!canAdd) return;
    const id = `custom-${q.toLowerCase().replace(/[^\w]+/g, "-")}`;
    const m: RosterModel = { id, name: q, maker: "custom", on: true };
    setModels((xs) => [m, ...xs]);
    setQuery("");
    setFresh(id);
    setSay(`Added ${q} and switched it on.`);
    requestAnimationFrame(() => list.current?.querySelector<HTMLElement>(`[data-id="${id}"] [role="switch"]`)?.focus());
  };
  const refresh = async () => {
    if (spinning) return;
    setSpinning(true);
    const t0 = performance.now();
    try {
      await onRefresh?.();
      setSay("Model list is up to date.");
    } catch {
      setSay("Couldn't refresh the model list. Try again in a moment.");
    } finally {
      // Let the turn finish so the button doesn't stutter on a fast answer.
      window.setTimeout(() => setSpinning(false), Math.max(0, 700 - (performance.now() - t0)));
    }
  };

  const fieldKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (exact) list.current?.querySelector<HTMLElement>(`[data-id="${exact.id}"] [role="switch"]`)?.focus();
      else if (q && shown.length === 0) add();
      else if (shown[0]) list.current?.querySelector<HTMLElement>('[role="switch"]')?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      list.current?.querySelector<HTMLElement>('[role="switch"], .mrst__addrow')?.focus();
    } else if (e.key === "Escape" && query) {
      e.preventDefault();
      setQuery("");
    }
  };
  const listKey = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") return;
    const items = [...(list.current?.querySelectorAll<HTMLElement>('[role="switch"], .mrst__addrow') ?? [])];
    const k = items.indexOf(document.activeElement as HTMLElement);
    if (k < 0) return;
    e.preventDefault();
    if (e.key === "ArrowUp" && k === 0) return field.current?.focus();
    const to = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : Math.max(0, Math.min(items.length - 1, k + (e.key === "ArrowDown" ? 1 : -1)));
    items[to]?.focus();
  };

  return (
    <section className={`mrst mrst--${theme} ${className}`} aria-labelledby={`${uid}-h`}>
      <h2 id={`${uid}-h`} className="mrst__sr">Models</h2>
      <div className="mrst__head">
        <label className="mrst__field">
          <span className="mrst__sr">Add or search model</span>
          <input
            ref={field}
            type="search"
            value={query}
            placeholder="Add or search model"
            autoComplete="off"
            spellCheck={false}
            aria-controls={`${uid}-list`}
            aria-describedby={`${uid}-hint`}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={fieldKey}
          />
        </label>
        <button type="button" className="mrst__refresh" data-spin={spinning || undefined} aria-label="Refresh model list" aria-busy={spinning || undefined} onClick={refresh}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.25 8a5.25 5.25 0 1 1-1.54-3.71" /><path d="M13.25 2.75v3h-3" /></svg>
        </button>
      </div>
      <p id={`${uid}-hint`} className="mrst__sr">Type to filter by model or maker. Press Enter to add a model that isn't listed.</p>

      <ul ref={list} id={`${uid}-list`} className="mrst__list" onKeyDown={listKey}>
        {shown.map((m) => {
          const last = m.on && onCount === 1;
          return (
            <li key={m.id} data-id={m.id} className="mrst__row" data-on={m.on || undefined} data-fresh={fresh === m.id || undefined} onClick={() => list.current?.querySelector<HTMLButtonElement>(`[data-id="${m.id}"] [role="switch"]`)?.click()}>
              <span className="mrst__mark" title={MAKER_NAME[m.maker]}>
                <MakerLogo maker={m.maker} name={m.name} />
              </span>
              <span className="mrst__name" id={`${uid}-${m.id}`}>
                <Mark text={m.name} q={q} />
                {ql && !m.name.toLowerCase().includes(ql) && <span className="mrst__by">{MAKER_NAME[m.maker]}</span>}
              </span>
              <Switch on={m.on} label={`${m.name}${last ? " (the last model on can't be turned off)" : ""}`} refuse={last} onToggle={(to) => toggle(m, to)} />
            </li>
          );
        })}
        {canAdd && (
          <li className="mrst__row mrst__row--add">
            <button type="button" className="mrst__addrow" onClick={add}>
              <span className="mrst__mark"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" /></svg></span>
              <span className="mrst__name">
                Add <b>{q}</b>
                <span className="mrst__by">custom model</span>
              </span>
              {shown.length === 0 && <kbd aria-hidden="true">↵</kbd>}
            </button>
          </li>
        )}
      </ul>

      {!q && more.length > 0 && (
        <button type="button" className="mrst__all" aria-expanded={all} aria-controls={`${uid}-list`} onClick={() => setAll((a) => !a)}>
          {all ? "Show Fewer Models" : "View All Models"}
        </button>
      )}
      <p className="mrst__sr" role="status" aria-live="polite">{say}</p>
    </section>
  );
}
