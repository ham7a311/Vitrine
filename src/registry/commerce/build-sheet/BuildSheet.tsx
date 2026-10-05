"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { blockedBy, choose, fixFor, total, type BuildGroup, type Change, type Rule, type Selection } from "./rules";
import "./build-sheet.css";

export type { BuildGroup, BuildOption, Rule, Selection } from "./rules";
export type BuildSheetProps = {
  product: string;
  /** Part number printed at the top of the sheet. */
  model?: string;
  groups: BuildGroup[];
  rules?: Rule[];
  defaultSelection: Selection;
  basePrice: number;
  currency?: string;
  locale?: string;
  /** Place the order; resolve with a reference, reject to keep the sheet with the error. */
  onSubmit?: (selection: Selection, total: number) => Promise<{ reference: string }>;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

type Proposal = { group: string; option: string; reasons: string[]; changes: Change[]; selection: Selection } | { group: string; option: string; reasons: string[]; impossible: true };

/**
 * Build Sheet
 * A configurator that explains itself. Options that don't fit the current
 * build say why; choosing one anyway offers the cheapest fix as a slip under
 * the group, and the order sheet marks every line that changed.
 */
export function BuildSheet({ product, model, groups, rules = [], defaultSelection, basePrice, currency = "USD", locale, onSubmit, theme = "light", motion = true, className = "" }: BuildSheetProps) {
  const id = useId();
  const [sel, setSel] = useState<Selection>(defaultSelection);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [changed, setChanged] = useState<Set<string>>(() => new Set());
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<"edit" | "sending" | "sent" | "failed">("edit");
  const [result, setResult] = useState("");
  const slip = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const money = useMemo(() => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }), [locale, currency]);
  const signed = (n: number) => (n === 0 ? "Included" : `${n > 0 ? "+" : "−"}${money.format(Math.abs(n))}`);
  const price = total(groups, sel, basePrice);
  const shown = useCountUp(price, motion);
  const label = (g: string, o: string) => groups.find((x) => x.id === g)?.options.find((x) => x.id === o)?.label ?? o;
  const groupLabel = (g: string) => groups.find((x) => x.id === g)?.label ?? g;

  const commit = (next: Selection, touched: string[], say: string) => {
    setSel(next);
    setProposal(null);
    setPhase("edit");
    setChanged(new Set(touched));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setChanged(new Set()), 1600);
    setMessage(`${say} Total ${money.format(total(groups, next, basePrice))}.`);
  };

  const pick = (group: string, option: string) => {
    if (phase === "sending") return;
    const blocked = blockedBy(groups, rules, sel, group, option);
    if (!blocked.length) {
      const g = groups.find((x) => x.id === group)!;
      const on = (sel[group] ?? []).includes(option);
      commit(choose(groups, sel, group, option), [group], `${g.label}: ${g.multiple ? `${label(group, option)} ${on ? "removed" : "added"}` : label(group, option)}.`);
      return;
    }
    const fix = fixFor(groups, rules, sel, group, option);
    setProposal(fix ? { group, option, reasons: fix.reasons, changes: fix.changes, selection: fix.selection } : { group, option, reasons: blocked.map((r) => r.reason), impossible: true });
    setMessage(blocked[0].reason);
    requestAnimationFrame(() => slip.current?.focus());
  };

  const submit = async () => {
    if (!onSubmit || phase === "sending") return;
    setPhase("sending");
    try {
      const { reference } = await onSubmit(sel, price);
      setResult(reference);
      setPhase("sent");
      setMessage(`Order placed. Reference ${reference}.`);
    } catch (e) {
      setResult((e as Error)?.message || "The order couldn't be placed. Your build is unchanged.");
      setPhase("failed");
    }
  };

  // A rule's short note is written from its condition's side; seen from the other side it reads differently.
  const note = (r: Rule, g: string, o: string) => {
    if (r.if.group === g && r.if.option === o) return r.short ?? r.reason;
    const cond = label(r.if.group, r.if.option);
    return r.excludes ? `Not with ${cond}` : `${cond}: ${r.short ?? r.reason}`;
  };

  const describe = (c: Change) => {
    const g = groups.find((x) => x.id === c.group)!;
    if (!g.multiple) return `Switch ${g.label.toLowerCase()} to ${label(c.group, c.to[0])}`;
    const added = c.to.filter((o) => !c.from.includes(o)), removed = c.from.filter((o) => !c.to.includes(o));
    return [added.length && `Add ${added.map((o) => label(c.group, o)).join(", ")}`, removed.length && `Remove ${removed.map((o) => label(c.group, o)).join(", ")}`].filter(Boolean).join(" · ");
  };

  return (
    <section className={`bsheet bsheet--${theme} ${className}`} data-motion={motion ? undefined : "off"} aria-labelledby={`${id}-p`}>
      <div className="bsheet__body">
        <div className="bsheet__config">
          <header className="bsheet__head">
            <h3 id={`${id}-p`} className="bsheet__product">{product}</h3>
            <p className="bsheet__from">From {money.format(basePrice)}</p>
          </header>

          {groups.map((g) => {
            const current = groups.find((x) => x.id === g.id)!.options.filter((o) => (sel[g.id] ?? []).includes(o.id));
            const currentPrice = current.reduce((a, o) => a + o.price, 0);
            return (
              <fieldset key={g.id} className="bsheet__group" data-changed={changed.has(g.id) || undefined}>
                <legend>{g.label}{g.multiple && <span> · choose any</span>}</legend>
                <div className="bsheet__options">
                  {g.options.map((o) => {
                    const on = (sel[g.id] ?? []).includes(o.id);
                    const block = on ? [] : blockedBy(groups, rules, sel, g.id, o.id);
                    const delta = g.multiple ? (on ? 0 : o.price) : o.price - currentPrice;
                    return (
                      <label key={o.id} className="bsheet__opt" data-on={on || undefined} data-blocked={block.length ? true : undefined}>
                        <input
                          type={g.multiple ? "checkbox" : "radio"}
                          name={`${id}-${g.id}`}
                          checked={on}
                          aria-disabled={block.length ? true : undefined}
                          aria-describedby={block.length ? `${id}-b-${g.id}-${o.id}` : undefined}
                          onChange={() => pick(g.id, o.id)}
                        />
                        <span className="bsheet__opt-main">
                          <span className="bsheet__opt-name">{o.label}</span>
                          {o.detail && <span className="bsheet__opt-detail">{o.detail}</span>}
                          {block.length > 0 && <span id={`${id}-b-${g.id}-${o.id}`} className="bsheet__opt-block">{note(block[0], g.id, o.id)}</span>}
                        </span>
                        <span className="bsheet__opt-price">{on ? (g.multiple ? money.format(o.price) : "Selected") : g.multiple ? `+${money.format(o.price)}` : signed(delta)}</span>
                      </label>
                    );
                  })}
                </div>
                {proposal?.group === g.id && (
                  <div ref={slip} className="bsheet__slip" tabIndex={-1} role="group" aria-label="Suggested change">
                    <p className="bsheet__slip-reason">{proposal.reasons.join(" ")}</p>
                    {"impossible" in proposal ? (
                      <>
                        <p className="bsheet__slip-fix">There's no build with {label(proposal.group, proposal.option)} and your other choices.</p>
                        <div className="bsheet__slip-actions"><button type="button" className="bsheet__ghost" onClick={() => setProposal(null)}>OK</button></div>
                      </>
                    ) : (
                      <>
                        <ul className="bsheet__slip-fix">
                          {proposal.changes.map((c) => {
                            const d = total(groups, { ...proposal.selection }, 0) - total(groups, { ...proposal.selection, [c.group]: c.from }, 0);
                            return <li key={c.group}>{describe(c)} <span>{signed(d)}</span></li>;
                          })}
                        </ul>
                        <div className="bsheet__slip-actions">
                          <button type="button" className="bsheet__ghost" onClick={() => { setProposal(null); setMessage("Kept your current build."); }}>Keep current</button>
                          <button type="button" className="bsheet__primary" onClick={() => commit(proposal.selection, [proposal.group, ...proposal.changes.map((c) => c.group)], `${label(proposal.group, proposal.option)} chosen. ${proposal.changes.map(describe).join(". ")}.`)}>
                            {proposal.changes.length === 1 ? "Make both changes" : proposal.changes.length ? `Make all ${proposal.changes.length + 1} changes` : "Choose it"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>

        <aside className="bsheet__sheet" aria-label="Order sheet">
          <div className="bsheet__sheet-head">
            <span>Build sheet</span>
            {model && <span className="bsheet__mono">{model}</span>}
          </div>
          <table className="bsheet__lines">
            <tbody>
              <tr><th scope="row">{product}<span className="bsheet__mono">BASE</span></th><td>{money.format(basePrice)}</td></tr>
              {groups.flatMap((g) => g.options.filter((o) => (sel[g.id] ?? []).includes(o.id)).map((o) => (
                <tr key={`${g.id}-${o.id}`} data-changed={changed.has(g.id) || undefined}>
                  <th scope="row">{groupLabel(g.id)}: {o.label}{o.sku && <span className="bsheet__mono">{o.sku}</span>}</th>
                  <td>{o.price ? money.format(o.price) : "—"}</td>
                </tr>
              )))}
            </tbody>
          </table>
          <p className="bsheet__total"><span>Total</span><strong aria-live="off">{money.format(shown)}</strong></p>
          {onSubmit && (
            <button type="button" className="bsheet__primary bsheet__submit" onClick={submit} disabled={phase === "sending" || phase === "sent"}>
              {phase === "sending" ? "Placing order…" : phase === "sent" ? "Order placed" : "Place order"}
            </button>
          )}
          {phase === "sent" && <p className="bsheet__result" role="status">Reference <span className="bsheet__mono">{result}</span></p>}
          {phase === "failed" && <p className="bsheet__result bsheet__result--bad" role="alert">{result}</p>}
        </aside>
      </div>
      <p className="bsheet__sr" aria-live="polite">{message}</p>
    </section>
  );
}

/** Count a number toward its new value so a price change is seen, not just swapped. */
function useCountUp(value: number, motion: boolean) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (!motion || matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(value); from.current = value; return; }
    const start = performance.now(), a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 420), e = 1 - (1 - k) ** 3;
      const v = Math.round(a + (value - a) * e);
      setShown(v);
      from.current = v;
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, motion]);
  return shown;
}
