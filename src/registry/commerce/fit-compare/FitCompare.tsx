"use client";
import { useId, useState } from "react";
import { fits, fmt, ratio, scaleBar, stage, type Unit } from "./scale";
import "./fit-compare.css";

export type FitItem = { id: string; label: string; w: number; h: number; radius?: number };
export type RefShape = "phone" | "card" | "paper" | "laptop" | "hand";
export type FitReference = { id: string; label: string; w: number; h: number; shape: RefShape };
export type FitCompareProps = {
  name: string;
  /** Sizes of the item in millimetres, width × height as drawn. */
  sizes: FitItem[];
  references?: FitReference[];
  /** When the item is a bag, sleeve or box, say whether the reference fits inside. */
  holds?: boolean;
  defaultSize?: string;
  defaultReference?: string;
  defaultUnit?: Unit;
  theme?: "light" | "dark";
  className?: string;
};

/** Everyday objects at their real sizes in millimetres. */
export const REFERENCES: FitReference[] = [
  { id: "card", label: "Bank card", w: 85.6, h: 54, shape: "card" },
  { id: "phone", label: "Phone (6.1″)", w: 71.5, h: 147, shape: "phone" },
  { id: "hand", label: "Adult hand", w: 88, h: 190, shape: "hand" },
  { id: "a4", label: "A4 sheet", w: 210, h: 297, shape: "paper" },
  { id: "laptop", label: "13″ laptop", w: 304, h: 212, shape: "laptop" },
];

function Reference({ r, x, y }: { r: FitReference; x: number; y: number }) {
  const { w, h } = r;
  return (
    <g className="fitc__ref" transform={`translate(${x} ${y})`}>
      {r.shape === "phone" && <><rect width={w} height={h} rx={10} /><rect className="fitc__ref-d" x={3} y={3} width={w - 6} height={h - 6} rx={8} /><rect className="fitc__ref-s" x={w / 2 - 9} y={7} width={18} height={4} rx={2} /></>}
      {r.shape === "card" && <><rect width={w} height={h} rx={3.2} /><rect className="fitc__ref-s" x={8} y={16} width={12} height={9} rx={1.5} /><rect className="fitc__ref-d" x={8} y={h - 12} width={44} height={3} rx={1.5} /></>}
      {r.shape === "paper" && <><path d={`M0 0H${w - 22}L${w} 22V${h}H0Z`} /><path className="fitc__ref-s" d={`M${w - 22} 0V22H${w}`} />{[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} className="fitc__ref-d" x={22} y={40 + k * 14} width={k === 5 ? 90 : w - 44} height={3} rx={1.5} />)}</>}
      {r.shape === "laptop" && <><rect width={w} height={h} rx={9} /><rect className="fitc__ref-d" x={10} y={10} width={w - 20} height={h - 20} rx={3} /><circle className="fitc__ref-s" cx={w / 2} cy={5} r={1.6} /></>}
      {r.shape === "hand" && (
        <g transform={`scale(${w / 88} ${h / 190})`}>
          <rect x={16} y={20} width={16} height={90} rx={8} /><rect x={34} y={4} width={16} height={100} rx={8} />
          <rect x={52} y={12} width={16} height={96} rx={8} /><rect x={70} y={34} width={15} height={80} rx={7.5} />
          <rect x={14} y={84} width={74} height={106} rx={22} />
          <rect x={2} y={88} width={18} height={64} rx={9} transform="rotate(-22 11 150)" />
        </g>
      )}
    </g>
  );
}

/**
 * Fit Compare
 * An item drawn at true scale against something the shopper already knows
 * the size of: a phone, a hand, a sheet of A4. Real units, a scale bar, and
 * a plain answer to "will it fit?".
 */
export function FitCompare({ name, sizes, references = REFERENCES, holds = false, defaultSize, defaultReference = "phone", defaultUnit = "cm", theme = "light", className = "" }: FitCompareProps) {
  const id = useId();
  const [sizeId, setSizeId] = useState(defaultSize ?? sizes[Math.floor(sizes.length / 2)].id);
  const [refId, setRefId] = useState(defaultReference);
  const [unit, setUnit] = useState<Unit>(defaultUnit);
  const [mode, setMode] = useState<"overlay" | "side">("overlay");

  const item = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  const ref = references.find((r) => r.id === refId) ?? references[0];
  const big = Math.max(item.w, item.h, ref.w, ref.h);
  const pad = big * 0.14;
  const st = stage(ref, item, mode, pad);
  const floor = pad + Math.max(item.h, ref.h);
  const rx = pad, ry = floor - ref.h;
  const ix = mode === "overlay" ? pad : pad * 2 + ref.w, iy = floor - item.h;
  const fs = big * 0.045;
  const bar = scaleBar(st.w, unit);
  const fit = holds ? fits(ref, item) : null;

  const summary = `${item.label} ${name} is ${fmt(item.w, unit)} wide and ${fmt(item.h, unit)} tall; the ${ref.label.toLowerCase()} is ${fmt(ref.w, unit)} by ${fmt(ref.h, unit)}.`;
  const answer = fit
    ? fit.fits
      ? `${ref.label} fits inside${fit.rotated ? " turned on its side" : ""}, with ${fmt(fit.spare, unit)} to spare.`
      : `${ref.label} doesn’t fit${fit.rotated ? ", even turned" : ""}: ${fmt(fit.over, unit)} too ${fit.side}.`
    : null;

  return (
    <section className={`fitc fitc--${theme} ${className}`} aria-labelledby={`${id}-t`}>
      <header className="fitc__head">
        <h3 id={`${id}-t`} className="fitc__title">How big is the {name}?</h3>
        <div className="fitc__toggles">
          <div className="fitc__seg" role="group" aria-label="Units">
            {(["cm", "in"] as Unit[]).map((u) => <button key={u} type="button" aria-pressed={unit === u} onClick={() => setUnit(u)}>{u}</button>)}
          </div>
          <div className="fitc__seg" role="group" aria-label="Layout">
            <button type="button" aria-pressed={mode === "overlay"} onClick={() => setMode("overlay")}>Overlay</button>
            <button type="button" aria-pressed={mode === "side"} onClick={() => setMode("side")}>Side by side</button>
          </div>
        </div>
      </header>

      <div className="fitc__body">
        <div className="fitc__stage">
          <svg viewBox={`0 ${-fs * 2.4} ${st.w} ${st.h + fs * 4.8}`} role="img" aria-label={`${summary}${answer ? ` ${answer}` : ""}`}>
            <line className="fitc__floor" x1={0} x2={st.w} y1={floor} y2={floor} />
            <Reference key={ref.id} r={ref} x={rx} y={ry} />
            <rect key={`${item.id}-${mode}`} className="fitc__item" x={ix} y={iy} width={item.w} height={item.h} rx={item.radius ?? 4} />
            {/* Item dimensions: width under the floor, height up the left side, clear of the reference. */}
            <g className="fitc__dim" style={{ fontSize: fs }}>
              <line x1={ix} x2={ix + item.w} y1={floor + fs * 0.9} y2={floor + fs * 0.9} />
              <line x1={ix} x2={ix} y1={floor + fs * 0.5} y2={floor + fs * 1.3} /><line x1={ix + item.w} x2={ix + item.w} y1={floor + fs * 0.5} y2={floor + fs * 1.3} />
              <text x={ix + item.w / 2} y={floor + fs * 2.2} textAnchor="middle">{fmt(item.w, unit)}</text>
              <line x1={ix - fs * 0.8} x2={ix - fs * 0.8} y1={iy} y2={floor} />
              <line x1={ix - fs * 1.2} x2={ix - fs * 0.4} y1={iy} y2={iy} />
              <text x={ix - fs * 1.2} y={iy + item.h / 2} textAnchor="middle" dominantBaseline="middle" transform={`rotate(-90 ${ix - fs * 1.2} ${iy + item.h / 2})`} dy={-fs * 0.2}>{fmt(item.h, unit)}</text>
            </g>
            <g className="fitc__bar" style={{ fontSize: fs * 0.85 }}>
              <rect x={pad * 0.4} y={-fs * 1.6} width={bar.mm} height={fs * 0.28} />
              <text x={pad * 0.4 + bar.mm + fs * 0.4} y={-fs * 1.46} dominantBaseline="middle">{bar.label}</text>
            </g>
          </svg>
          <p className="fitc__legend" aria-hidden="true"><span className="fitc__sw fitc__sw--item" />{name} · {item.label}<span className="fitc__sw fitc__sw--ref" />{ref.label}</p>
        </div>

        <div className="fitc__side">
          <fieldset className="fitc__group">
            <legend>Size</legend>
            <div className="fitc__chips">
              {sizes.map((s) => (
                <label key={s.id} className="fitc__chip">
                  <input type="radio" name={`${id}-size`} checked={s.id === item.id} onChange={() => setSizeId(s.id)} />
                  <span>{s.label}<small>{fmt(s.w, unit)} × {fmt(s.h, unit)}</small></span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="fitc__group">
            <legend>Compare with</legend>
            <div className="fitc__refs">
              {references.map((r) => (
                <label key={r.id} className="fitc__chip">
                  <input type="radio" name={`${id}-ref`} checked={r.id === ref.id} onChange={() => setRefId(r.id)} />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="fitc__read" aria-live="polite">
            {answer && <p className="fitc__answer" data-fits={fit?.fits || undefined}>{answer}</p>}
            <p>{item.label} is {ratio(item.h, ref.h, "tall")} and {ratio(item.w, ref.w, "wide")} as the {ref.label.toLowerCase()}.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
