"use client";
import { useId, useState, type CSSProperties } from "react";
import "./spend-controls.css";

export type SpendPeriod = "transaction" | "day" | "month" | "total";
export type SpendRule = { limit: number; period: SpendPeriod; categories: string[] };
export type SpendControlsProps = {
  cardName: string;
  last4: string;
  defaultValue: SpendRule;
  categories: string[];
  /** Spend so far in each period, minor units. */
  spent: Partial<Record<SpendPeriod, number>>;
  onSave: (rule: SpendRule) => Promise<void>;
  presets?: number[];
  currency?: string;
  locale?: string;
  theme?: "dark" | "light";
  className?: string;
};

const PERIODS: { id: SpendPeriod; label: string; phrase: string; next: string }[] = [
  { id: "transaction", label: "Per purchase", phrase: "per purchase", next: "" },
  { id: "day", label: "Daily", phrase: "per day", next: "tomorrow" },
  { id: "month", label: "Monthly", phrase: "per month", next: "next month" },
  { id: "total", label: "Total", phrase: "in total", next: "" },
];

function list(items: string[], locale?: string) {
  try { return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(items); }
  catch { return items.join(", "); }
}

/**
 * Spend Controls
 * A card's limit written as a sentence you can check: amount, period and
 * the kinds of merchant it can pay, with a meter that shows how much of the
 * new limit is already gone before you save it.
 */
export function SpendControls({ cardName, last4, defaultValue, categories, spent, onSave, presets = [50_000, 200_000, 500_000], currency = "USD", locale, theme = "dark", className = "" }: SpendControlsProps) {
  const id = useId();
  const [saved, setSaved] = useState(defaultValue);
  const [rule, setRule] = useState(defaultValue);
  const [draft, setDraft] = useState(() => new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(defaultValue.limit / 100));
  const [phase, setPhase] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const money = new Intl.NumberFormat(locale, { style: "currency", currency });
  const digits = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const symbol = new Intl.NumberFormat(locale, { style: "currency", currency, currencyDisplay: "narrowSymbol" }).formatToParts(0).find((p) => p.type === "currency")?.value ?? currency;

  const period = PERIODS.find((p) => p.id === rule.period)!;
  const used = spent[rule.period] ?? 0;
  const valid = Number.isFinite(rule.limit) && rule.limit > 0;
  const over = valid && rule.period !== "transaction" && used > rule.limit;
  const dirty = rule.limit !== saved.limit || rule.period !== saved.period || rule.categories.join() !== saved.categories.join();
  const share = valid ? Math.min(1, used / rule.limit) : 0;

  const change = (patch: Partial<SpendRule>) => { setRule((r) => ({ ...r, ...patch })); if (phase !== "saving") setPhase("idle"); };
  const typed = (text: string) => {
    setDraft(text);
    const n = Number(text.replace(/[^\d.]/g, ""));
    change({ limit: Number.isFinite(n) ? Math.round(n * 100) : NaN });
  };
  const toggle = (c: string) => change({ categories: rule.categories.includes(c) ? rule.categories.filter((x) => x !== c) : [...rule.categories, c] });
  const save = async () => {
    if (!valid || !dirty || phase === "saving") return;
    setPhase("saving");
    try { await onSave(rule); setSaved(rule); setPhase("saved"); }
    catch { setPhase("error"); }
  };

  const where = rule.categories.length ? `on ${list(rule.categories, locale)}` : "at any merchant";
  const sentence = valid ? `${cardName} can spend up to ${money.format(rule.limit / 100)} ${period.phrase} ${where}.` : "Enter a limit above zero.";

  return (
    <section className={`spend spend--${theme} ${className}`} aria-labelledby={`${id}-title`}>
      <header className="spend__head">
        <h3 id={`${id}-title`} className="spend__title">Spend controls</h3>
        <p className="spend__card">{cardName} · •••• {last4}</p>
      </header>

      <div className="spend__field">
        <label htmlFor={`${id}-amount`} className="spend__label">Limit</label>
        <div className="spend__amount" data-invalid={!valid || undefined}>
          <span aria-hidden="true">{symbol}</span>
          <input id={`${id}-amount`} inputMode="decimal" value={draft} aria-invalid={!valid || undefined} aria-describedby={`${id}-sentence`}
            onChange={(e) => typed(e.target.value)} onBlur={() => valid && setDraft(digits.format(rule.limit / 100))} onFocus={(e) => e.target.select()} />
        </div>
        <div className="spend__presets">
          {presets.map((p) => <button key={p} type="button" aria-pressed={rule.limit === p} onClick={() => { setDraft(digits.format(p / 100)); change({ limit: p }); }}>{money.format(p / 100).replace(/\.00$/, "")}</button>)}
        </div>
      </div>

      <fieldset className="spend__field">
        <legend className="spend__label">Resets</legend>
        <div className="spend__segments">
          {PERIODS.map((p) => (
            <label key={p.id} data-checked={rule.period === p.id || undefined}>
              <input type="radio" name={`${id}-period`} value={p.id} checked={rule.period === p.id} onChange={() => change({ period: p.id })} />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="spend__field">
        <legend className="spend__label">Merchants</legend>
        <div className="spend__chips">
          <button type="button" aria-pressed={!rule.categories.length} onClick={() => change({ categories: [] })}>Any merchant</button>
          {categories.map((c) => <button key={c} type="button" aria-pressed={rule.categories.includes(c)} onClick={() => toggle(c)}>{c}</button>)}
        </div>
      </fieldset>

      <div className="spend__summary">
        <p id={`${id}-sentence`} className="spend__sentence" aria-live="polite">{sentence}</p>
        {rule.period !== "transaction" && valid && (
          <>
            <div className="spend__meter" aria-hidden="true" style={{ "--share": share } as CSSProperties} data-over={over || undefined}><span /></div>
            <p className="spend__used" data-over={over || undefined}>
              {over
                ? `${money.format(used / 100)} is already spent ${period.phrase === "in total" ? "on this card" : `this ${rule.period}`}, so purchases will be declined${period.next ? ` until ${period.next}` : ""}.`
                : `${money.format(used / 100)} spent ${rule.period === "total" ? "so far" : `this ${rule.period}`} · ${money.format((rule.limit - used) / 100)} left`}
            </p>
          </>
        )}
      </div>

      <footer className="spend__foot">
        <p className="spend__status" role="status">{phase === "saved" ? "Saved. The new limit applies to the next purchase." : phase === "error" ? "The limit couldn't be saved. Nothing changed; try again." : dirty ? "Unsaved changes" : ""}</p>
        <div className="spend__actions">
          {dirty && phase !== "saving" && <button type="button" className="spend__ghost" onClick={() => { setRule(saved); setDraft(digits.format(saved.limit / 100)); setPhase("idle"); }}>Discard</button>}
          <button type="button" className="spend__save" disabled={!valid || !dirty || phase === "saving"} onClick={save}>{phase === "saving" ? "Saving…" : "Save limit"}</button>
        </div>
      </footer>
    </section>
  );
}
