"use client";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { mergeField, words, type FieldKind, type FieldMerge, type Hunk, type Value } from "./merge";
import "./conflict-resolver.css";

export type { FieldKind, Value } from "./merge";
export type ConflictField = { key: string; label: string; kind: FieldKind };
export type ConflictResolverProps = {
  fields: ConflictField[];
  base: Record<string, Value>;
  mine: Record<string, Value>;
  theirs: Record<string, Value>;
  /** Names for the two sides as they read mid-sentence, e.g. "your offline copy" and "Layla's edit". */
  mineLabel?: string;
  theirsLabel?: string;
  /** Save the merged record; reject to keep everything as chosen and show why. */
  onResolve: (merged: Record<string, Value>) => Promise<void>;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

type Choice = { pick: "mine" | "theirs" | "both" | "edit"; text?: string };
type Spot = { field: string; hunk: number | null };
const spotKey = (s: Spot) => `${s.field}:${s.hunk ?? "-"}`;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Conflict Resolver
 * Merge two edits of one record against the version they both started from.
 * Changes only one side made are taken for you and labelled; where both sides
 * changed the same thing, you choose, with each side's change marked against
 * the original.
 */
export function ConflictResolver({ fields, base, mine, theirs, mineLabel = "yours", theirsLabel = "theirs", onResolve, theme = "light", motion = true, className = "" }: ConflictResolverProps) {
  const id = useId();
  const merges = useMemo(() => Object.fromEntries(fields.map((f) => [f.key, mergeField(f.kind, base[f.key], mine[f.key], theirs[f.key])])), [fields, base, mine, theirs]);
  const spots = useMemo<Spot[]>(() => fields.flatMap((f): Spot[] => {
    const m = merges[f.key];
    if (m.status !== "conflict") return [];
    return m.hunks ? m.hunks.flatMap((h, i) => (h.type === "conflict" ? [{ field: f.key, hunk: i }] : [])) : [{ field: f.key, hunk: null }];
  }), [fields, merges]);
  const [choices, setChoices] = useState<Record<string, Choice>>({});
  const [phase, setPhase] = useState<"edit" | "saving" | "saved" | "failed">("edit");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const cards = useRef(new Map<string, HTMLElement>());

  const left = spots.filter((s) => !choices[spotKey(s)]).length;
  const choose = (s: Spot, c: Choice) => {
    setChoices((all) => ({ ...all, [spotKey(s)]: c }));
    if (phase !== "saving") setPhase("edit");
    const label = fields.find((f) => f.key === s.field)?.label;
    if (c.pick !== "edit") {
      const remaining = spots.filter((x) => spotKey(x) !== spotKey(s) && !choices[spotKey(x)]).length;
      setMessage(`${label}: ${c.pick === "mine" ? `kept ${mineLabel}` : c.pick === "theirs" ? `took ${theirsLabel}` : "kept both"}. ${remaining ? `${remaining} left.` : "All conflicts resolved."}`);
    }
  };

  const pickLines = (h: Extract<Hunk, { type: "conflict" }>, c?: Choice) => (!c ? h.mine : c.pick === "mine" ? h.mine : c.pick === "theirs" ? h.theirs : c.pick === "both" ? [...h.mine, ...h.theirs] : (c.text ?? "").split("\n"));
  const merged = useMemo(() => Object.fromEntries(fields.map((f) => {
    const m = merges[f.key];
    if (m.status !== "conflict") return [f.key, m.value];
    if (m.hunks) return [f.key, m.hunks.flatMap((h, i) => (h.type === "ok" ? h.lines : pickLines(h, choices[spotKey({ field: f.key, hunk: i })]))).join("\n")];
    const c = choices[spotKey({ field: f.key, hunk: null })];
    return [f.key, !c || c.pick === "mine" ? m.mine : c.pick === "theirs" ? m.theirs : c.pick === "edit" ? c.text ?? "" : m.mine];
  })), [fields, merges, choices]);

  const save = async () => {
    if (left || phase === "saving") return;
    setPhase("saving"); setError("");
    try { await onResolve(merged); setPhase("saved"); setMessage("Merged version saved."); }
    catch (e) { setError((e as Error)?.message || "The merged version couldn't be saved. Your choices are kept."); setPhase("failed"); }
  };

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if ((e.target as Element).closest("textarea, input")) return;
    const keys = spots.map(spotKey);
    const here = (e.target as HTMLElement).closest<HTMLElement>("[data-spot]")?.dataset.spot;
    const i = here ? keys.indexOf(here) : -1;
    if (e.key === "j" || e.key === "k") {
      e.preventDefault();
      const n = keys[Math.max(0, Math.min(keys.length - 1, i + (e.key === "j" ? 1 : -1)))] ?? keys[0];
      cards.current.get(n)?.focus();
    } else if ((e.key === "m" || e.key === "t") && i >= 0) {
      e.preventDefault();
      choose(spots[i], { pick: e.key === "m" ? "mine" : "theirs" });
    }
  };

  const show = (v: Value) => (Array.isArray(v) ? v.join(", ") : v);
  const status = (m: FieldMerge) => ({ unchanged: "Unchanged", same: "Same change on both sides", mine: `Auto: ${mineLabel}`, theirs: `Auto: ${theirsLabel}`, merged: "Auto: both changes combined", conflict: "Conflict" })[m.status];

  const card = (s: Spot, label: string, b: string, mm: string, tt: string, allowBoth: boolean) => {
    const k = spotKey(s), c = choices[k];
    return (
      <div key={k} ref={(el) => { if (el) cards.current.set(k, el); else cards.current.delete(k); }} className="cres__card" data-spot={k} data-done={c ? true : undefined} tabIndex={-1} role="group" aria-label={`Conflict: ${label}`}>
        <div className="cres__sides">
          <div className="cres__side cres__side--base"><span className="cres__side-label">Original</span><p>{b || <em>empty</em>}</p></div>
          {([["mine", cap(mineLabel), mm], ["theirs", cap(theirsLabel), tt]] as const).map(([side, name, text]) => (
            <div key={side} className="cres__side" data-side={side} data-picked={c?.pick === side || (c?.pick === "both" ? true : undefined) || undefined}>
              <span className="cres__side-label">{name}</span>
              {/* Each side reads as its own text, with what it added marked; the Original pane shows what was there. */}
              <p>{words(b, text).filter((w) => w.type !== "del").map((w, i) => (w.type === "same" ? <span key={i}>{w.text}</span> : <ins key={i}>{w.text}</ins>))}</p>
            </div>
          ))}
        </div>
        <div className="cres__choices" role="radiogroup" aria-label={`Resolve ${label}`}>
          {([["mine", `Keep ${mineLabel}`, "m"], ["theirs", `Take ${theirsLabel}`, "t"], ...(allowBoth ? [["both", "Keep both", ""]] : []), ["edit", "Edit", ""]] as [Choice["pick"], string, string][]).map(([pick, text, key]) => (
            <button key={pick} type="button" role="radio" aria-checked={c?.pick === pick} aria-keyshortcuts={key || undefined}
              onClick={() => choose(s, pick === "edit" ? { pick, text: c?.text ?? mm } : { pick })}>
              {text}{key && <kbd aria-hidden="true">{key.toUpperCase()}</kbd>}
            </button>
          ))}
        </div>
        {c?.pick === "edit" && (
          <textarea className="cres__edit" aria-label={`Your version of ${label}`} value={c.text ?? ""} rows={Math.min(6, (c.text ?? "").split("\n").length + 1)} onChange={(e) => choose(s, { pick: "edit", text: e.target.value })} autoFocus />
        )}
      </div>
    );
  };

  return (
    <section className={`cres cres--${theme} ${className}`} data-motion={motion ? undefined : "off"} aria-labelledby={`${id}-h`} onKeyDown={onKey}>
      <header className="cres__head">
        <h3 id={`${id}-h`}>{left ? `${left} ${left === 1 ? "conflict" : "conflicts"} left` : spots.length ? "Every conflict resolved" : "No conflicts"}</h3>
        <p>{fields.filter((f) => ["mine", "theirs", "merged", "same"].includes(merges[f.key].status)).length} changes merged automatically · <kbd>J</kbd><kbd>K</kbd> move · <kbd>M</kbd> keep {mineLabel} · <kbd>T</kbd> take {theirsLabel}</p>
        <div className="cres__meter" aria-hidden="true"><span style={{ width: `${spots.length ? ((spots.length - left) / spots.length) * 100 : 100}%` }} /></div>
      </header>

      <ol className="cres__fields">
        {fields.map((f) => {
          const m = merges[f.key];
          return (
            <li key={f.key} className="cres__field" data-status={m.status}>
              <div className="cres__field-head"><span className="cres__name">{f.label}</span><span className="cres__badge">{status(m)}</span></div>
              {m.status !== "conflict" ? (
                <p className="cres__value">{show(m.value) || <em>empty</em>}</p>
              ) : m.hunks ? (
                m.hunks.map((h, i) => h.type === "ok"
                  ? <p key={i} className="cres__context">{h.lines.join("\n")}</p>
                  : card({ field: f.key, hunk: i }, `${f.label}, lines ${i + 1}`, h.base.join("\n"), h.mine.join("\n"), h.theirs.join("\n"), true))
              ) : card({ field: f.key, hunk: null }, f.label, show(m.base), show(m.mine), show(m.theirs), false)}
            </li>
          );
        })}
      </ol>

      <footer className="cres__foot">
        {phase === "saved" ? <p className="cres__ok" role="status">Saved. Both edits are now one version.</p> : phase === "failed" ? <p className="cres__bad" role="alert">{error}</p> : <p className="cres__wait">{left ? "Resolve every conflict to save." : "Ready to save the merged version."}</p>}
        <button type="button" className="cres__save" onClick={save} disabled={!!left || phase === "saving" || phase === "saved"}>{phase === "saving" ? "Saving…" : phase === "saved" ? "Saved" : "Save merged version"}</button>
      </footer>
      <p className="cres__sr" aria-live="polite">{message}</p>
    </section>
  );
}
