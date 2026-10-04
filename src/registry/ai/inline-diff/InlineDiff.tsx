"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./inline-diff.css";

/**
 * Inline Diff
 * An AI edit proposed inside the code, not in a side panel. Added lines type
 * in under the lines they replace; Accept (⌘↵) folds the removed lines away
 * and lets the additions lose their tint; Reject (⌘⌫) folds the additions
 * away and un-strikes the originals. The code always ends up looking like code.
 */

type Line = { t: string; kind?: "ctx" | "del" | "add" };
type Phase = "writing" | "review" | "accepted" | "rejected";

type Props = { file?: string; instruction?: string; lines?: Line[]; className?: string };

const DEFAULT: Line[] = [
  { t: "export function price(plan: Plan, cycle: Cycle) {" },
  { t: "  const base = PLANS[plan].monthly;" },
  { t: "  if (cycle === \"yearly\") return base * 12 * 0.8;", kind: "del" },
  { t: "  if (cycle === \"yearly\") {", kind: "add" },
  { t: "    const discount = PLANS[plan].yearlyDiscount ?? 0.2;", kind: "add" },
  { t: "    return Math.round(base * 12 * (1 - discount));", kind: "add" },
  { t: "  }", kind: "add" },
  { t: "  return base;" },
  { t: "}" },
];

/** Tiny highlighter: keywords, strings, numbers. Enough to read as code. */
function paint(src: string) {
  const out: (string | { c: string; t: string })[] = [];
  const re = /("[^"]*")|\b(export|function|const|return|if|let)\b|\b(\d+(?:\.\d+)?)\b|(\?\?|===|=>)/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    out.push({ c: m[1] ? "s" : m[2] ? "k" : m[3] ? "n" : "o", t: m[0] });
    last = m.index + m[0].length;
  }
  out.push(src.slice(last));
  return out.map((p, i) => (typeof p === "string" ? <span key={i}>{p}</span> : <span key={i} className={`inline-diff__${p.c}`}>{p.t}</span>));
}

export function InlineDiff({ file = "pricing.ts", instruction = "Make the yearly discount configurable per plan", lines = DEFAULT, className = "" }: Props) {
  const [phase, setPhase] = useState<Phase>("writing");
  const [typed, setTyped] = useState(0);
  const [run, setRun] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const adds = lines.filter((l) => l.kind === "add").length;
  const dels = lines.filter((l) => l.kind === "del").length;

  useEffect(() => {
    setPhase("writing");
    setTyped(0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setTyped(adds); setPhase("review"); return; }
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= adds) { clearInterval(id); setTimeout(() => setPhase("review"), 250); }
    }, 420);
    return () => clearInterval(id);
  }, [run, adds]);

  const onKey = (e: KeyboardEvent) => {
    if (phase !== "review" || !(e.metaKey || e.ctrlKey)) return;
    if (e.key === "Enter") { e.preventDefault(); setPhase("accepted"); }
    if (e.key === "Backspace") { e.preventDefault(); setPhase("rejected"); }
  };

  let addIndex = 0;
  let num = 0;
  return (
    <div ref={panel} className={`inline-diff ${className}`} data-phase={phase} tabIndex={0} onKeyDown={onKey} aria-label={`${file} with a proposed edit`}>
      <div className="inline-diff__tabs">
        <span className="inline-diff__tab">
          <i aria-hidden="true">TS</i>
          {file}
          {phase === "review" && <b aria-hidden="true" />}
        </span>
      </div>

      <div className="inline-diff__ask">
        <span className="inline-diff__spark" aria-hidden="true">✦</span>
        <span>{instruction}</span>
        <span className="inline-diff__stat">
          <em>+{adds}</em> <s>−{dels}</s>
        </span>
      </div>

      <pre className="inline-diff__code">
        {lines.map((l, i) => {
          const kind = l.kind ?? "ctx";
          if (kind === "add") addIndex += 1;
          const shown = kind !== "add" || addIndex <= typed;
          const gone = (kind === "del" && phase === "accepted") || (kind === "add" && phase === "rejected");
          if (!gone) num += 1;
          return (
            <div
              key={i}
              className={`inline-diff__row inline-diff__row--${kind}`}
              data-shown={shown || undefined}
              data-gone={gone || undefined}
              style={{ "--k": addIndex } as CSSProperties}
            >
              <div className="inline-diff__line">
                <span className="inline-diff__num">{gone ? "" : num}</span>
                <span className="inline-diff__sign" aria-hidden="true">{kind === "add" ? "+" : kind === "del" ? "−" : ""}</span>
                <code>{paint(l.t)}</code>
              </div>
            </div>
          );
        })}
      </pre>

      <div className="inline-diff__bar" aria-live="polite">
        {phase === "writing" && <span className="inline-diff__writing"><i />Writing edit…</span>}
        {phase === "review" && (
          <>
            <button type="button" className="inline-diff__btn inline-diff__btn--reject" onClick={() => setPhase("rejected")}>
              Reject <kbd>⌘⌫</kbd>
            </button>
            <button type="button" className="inline-diff__btn inline-diff__btn--accept" onClick={() => setPhase("accepted")}>
              Accept <kbd>⌘↵</kbd>
            </button>
          </>
        )}
        {(phase === "accepted" || phase === "rejected") && (
          <>
            <span className="inline-diff__done">{phase === "accepted" ? "Edit applied" : "Edit discarded"}</span>
            <button type="button" className="inline-diff__btn" onClick={() => setRun((r) => r + 1)}>Propose again</button>
          </>
        )}
      </div>
    </div>
  );
}
