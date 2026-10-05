"use client";
import { useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { analyse, fixable, SWAPS } from "./sms";
import "./segment-counter.css";

export type SegmentCounterProps = {
  defaultValue?: string;
  onChange?: (text: string, parts: number) => void;
  label?: string;
  /** Parts you're willing to send; more shows a warning. */
  maxParts?: number;
  /** Cost of one part, shown as a running total when given. */
  pricePerPart?: number;
  currency?: string;
  locale?: string;
  theme?: "light" | "dark";
  className?: string;
};

/**
 * Segment Counter
 * A text-message field that shows how the message will really be billed:
 * where it splits into parts, which characters cost double, and which single
 * character switched the whole message to the 70-character encoding.
 */
export function SegmentCounter({ defaultValue = "", onChange, label = "Message", maxParts = 3, pricePerPart, currency = "USD", locale, theme = "light", className = "" }: SegmentCounterProps) {
  const id = useId();
  const [text, setText] = useState(defaultValue);
  const [scroll, setScroll] = useState(0);
  const area = useRef<HTMLTextAreaElement>(null);
  const a = useMemo(() => analyse(text), [text]);
  const parts = text ? a.segments.length : 0;
  const money = new Intl.NumberFormat(locale, { style: "currency", currency });

  const set = (v: string) => { setText(v); onChange?.(v, v ? analyse(v).segments.length : 0); };
  const allFixable = a.culprits.length > 0 && a.culprits.every((c) => fixable(c.char));

  // The overlay repeats the text: culprits marked, double-cost characters underlined, part breaks drawn.
  const starts = new Set(a.segments.slice(1).map((s) => s.start));
  const bad = new Set(a.culprits.map((c) => c.index)), dbl = new Set(a.doubles.map((c) => c.index));
  const pieces: { t: string; kind?: "bad" | "dbl"; brk?: number }[] = [];
  let i = 0, part = 1;
  for (const c of [...text]) {
    const brk = starts.has(i) ? ++part : undefined;
    pieces.push({ t: c, kind: bad.has(i) ? "bad" : dbl.has(i) ? "dbl" : undefined, brk });
    i += c.length;
  }

  return (
    <div className={`segc segc--${theme} ${className}`} data-ucs={a.encoding === "UCS-2" || undefined} data-over={parts > maxParts || undefined}>
      <label htmlFor={`${id}-t`} className="segc__label">{label}</label>
      <div className="segc__field">
        <div className="segc__overlay" aria-hidden="true" style={{ transform: `translateY(${-scroll}px)` }}>
          {pieces.map((p, k) => (
            <span key={k} className={p.kind ? `segc__ch segc__ch--${p.kind}` : p.brk ? "segc__ch" : undefined} data-break={p.brk}>{p.t}</span>
          ))}
          {"​"}
        </div>
        <textarea
          ref={area}
          id={`${id}-t`}
          className="segc__input"
          rows={5}
          value={text}
          spellCheck
          aria-describedby={`${id}-s ${id}-n`}
          onChange={(e) => set(e.target.value)}
          onScroll={(e) => setScroll(e.currentTarget.scrollTop)}
          placeholder="Type a message…"
        />
      </div>

      <div className="segc__meter" aria-hidden="true">
        {(text ? a.segments : [{ units: 0, start: 0, end: 0 }]).map((s, k) => (
          <span key={k} className="segc__part" style={{ "--fill": s.units / a.perSegment } as CSSProperties} data-last={k === a.segments.length - 1 || undefined}>
            <i />
            <b>Part {k + 1}</b>
            <em>{s.units}/{a.perSegment}</em>
          </span>
        ))}
      </div>

      <p id={`${id}-s`} className="segc__status" aria-live="polite">
        <strong>{parts} {parts === 1 ? "message" : "messages"}</strong>
        <span>{a.encoding} · {a.units} {a.encoding === "GSM-7" ? "characters" : "units"} · {a.remaining} left in this part</span>
        {pricePerPart !== undefined && <span>{money.format(parts * pricePerPart)} per recipient</span>}
      </p>

      <div id={`${id}-n`} className="segc__notes">
        {a.encoding === "UCS-2" && (
          <p className="segc__note segc__note--bad">
            {a.culprits.length === 1 ? "One character" : `${a.culprits.length} characters`} ({a.culprits.slice(0, 4).map((c) => `“${c.char === " " ? "non-breaking space" : c.char}”`).join(", ")}{a.culprits.length > 4 ? "…" : ""}) moved this message to UCS-2, so each part holds 70 characters instead of 160.
            {allFixable && <button type="button" onClick={() => { set([...text].map((c) => SWAPS[c] ?? c).join("")); area.current?.focus(); }}>Use plain quotes and dashes</button>}
          </p>
        )}
        {a.doubles.length > 0 && a.encoding === "GSM-7" && <p className="segc__note">{a.doubles.map((d) => d.char).join(" ")} {a.doubles.length === 1 ? "counts" : "count"} as two characters.</p>}
        {parts > maxParts && <p className="segc__note segc__note--bad">This sends as {parts} messages, more than the {maxParts} you allowed.</p>}
      </div>
    </div>
  );
}
