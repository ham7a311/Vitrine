"use client";
import { useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { move, normalize, type Channel } from "./allocate";
import "./allocation-faders.css";

export type { Channel } from "./allocate";
export type AllocationFadersProps = {
  channels: Channel[];
  /** What every channel adds up to: 100 for percentages, or an amount. */
  total?: number;
  /** Smallest change a fader makes, in the same unit as `total`. */
  step?: number;
  format?: "percent" | "currency";
  currency?: string;
  locale?: string;
  /** Channel ids that start locked. */
  locked?: string[];
  title?: string;
  onChange?: (channels: Channel[]) => void;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const TICKS = [100, 75, 50, 25, 0];

/**
 * Allocation Faders
 * A console of faders that always adds up to the total. Push one and the
 * unlocked faders make room in proportion; a lock pin holds a fader still.
 */
export function AllocationFaders({ channels: initial, total = 100, step = 1, format = "percent", currency = "USD", locale, locked: initialLocked = [], title = "Allocation", onChange, theme = "light", motion = true, className = "" }: AllocationFadersProps) {
  const id = useId();
  const [channels, setChannels] = useState(() => normalize(initial, total, step));
  const [locked, setLocked] = useState(() => new Set(initialLocked));
  const [active, setActive] = useState<string | null>(null);
  // Values when the current gesture began. Each change is measured from here, so a run of
  // small steps is shared in proportion instead of always landing on the largest channel.
  const base = useRef<Channel[] | null>(null);
  const begin = () => { if (!base.current) base.current = channels; };
  const end = () => { base.current = null; setActive(null); };

  const money = useMemo(() => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }), [locale, currency]);
  const show = (v: number) => (format === "currency" ? money.format(v) : `${Math.round(v)}%`);
  const pct = (v: number) => Math.round((v / total) * 1000) / 10;

  const lockedSum = channels.reduce((a, c) => a + (locked.has(c.id) ? c.value : 0), 0);
  const unlocked = channels.filter((c) => !locked.has(c.id));

  const set = (cid: string, v: number) => {
    const from = base.current ?? channels;
    const next = move(from, cid, v, locked, total, step);
    if (next === from) return;
    setChannels(next);
    onChange?.(next);
  };
  const toggleLock = (cid: string) => setLocked((s) => { const n = new Set(s); if (n.has(cid)) n.delete(cid); else n.add(cid); return n; });

  return (
    <section className={`afad afad--${theme} ${className}`} data-motion={motion ? undefined : "off"} aria-labelledby={`${id}-t`}>
      <div className="afad__body">
        <header className="afad__head">
          <h3 id={`${id}-t`} className="afad__title">{title}</h3>
          <p className="afad__rule">Always adds up to {show(total)}</p>
        </header>

        <div className="afad__desk">
          <ul className="afad__strips">
            {channels.map((c, i) => {
              const isLocked = locked.has(c.id);
              // A fader can move only if some other unlocked fader can absorb the change.
              const stuck = !isLocked && unlocked.length < 2;
              const share = c.value / total;
              return (
                <li key={c.id} className="afad__strip" data-locked={isLocked || undefined} data-active={active === c.id || undefined} style={{ "--p": share, "--c": `var(--afad-c${(i % 6) + 1})` } as CSSProperties}>
                  <output className="afad__readout" htmlFor={`${id}-${c.id}`}>
                    <span className="afad__value">{show(c.value)}</span>
                    {format === "currency" && <span className="afad__pct">{pct(c.value)}%</span>}
                  </output>
                  <div className="afad__fader">
                    <span className="afad__scale" aria-hidden="true">{TICKS.map((t) => <span key={t}>{t}</span>)}</span>
                    <span className="afad__slot" aria-hidden="true"><span className="afad__fill" /></span>
                    <span className="afad__cap" aria-hidden="true" />
                    <input
                      id={`${id}-${c.id}`}
                      className="afad__input"
                      type="range"
                      min={0}
                      max={total}
                      step={step}
                      value={c.value}
                      disabled={isLocked || stuck}
                      aria-label={c.label}
                      aria-valuetext={`${c.label} ${show(c.value)}${format === "currency" ? `, ${pct(c.value)} percent` : ""}${isLocked ? ", locked" : ""}`}
                      aria-describedby={stuck ? `${id}-stuck` : undefined}
                      onChange={(e) => set(c.id, Number(e.target.value))}
                      onFocus={begin}
                      onPointerDown={() => { begin(); setActive(c.id); }}
                      onPointerUp={end}
                      onPointerCancel={end}
                      onBlur={end}
                    />
                  </div>
                  <button type="button" className="afad__pin" aria-pressed={isLocked} onClick={() => toggleLock(c.id)}>
                    <span className="afad__pin-head" aria-hidden="true" />
                    <span className="afad__sr">{isLocked ? `Unlock ${c.label}` : `Lock ${c.label}`}</span>
                    <span aria-hidden="true">{isLocked ? "Locked" : "Lock"}</span>
                  </button>
                  <span className="afad__tape"><span className="afad__chip" aria-hidden="true" />{c.label}</span>
                </li>
              );
            })}
          </ul>

          <aside className="afad__master" aria-label="Totals">
            <p className="afad__master-label">Master</p>
            <div className="afad__bar" aria-hidden="true">
              {channels.map((c, i) => <span key={c.id} data-locked={locked.has(c.id) || undefined} style={{ flexGrow: c.value, "--c": `var(--afad-c${(i % 6) + 1})` } as CSSProperties} />)}
            </div>
            <dl className="afad__sums">
              <div><dt>Total</dt><dd>{show(total)}</dd></div>
              <div><dt>Locked</dt><dd>{show(lockedSum)}</dd></div>
              <div><dt>Free to move</dt><dd>{show(total - lockedSum)}</dd></div>
            </dl>
            <p id={`${id}-stuck`} className="afad__hint">{unlocked.length < 2 ? "Unlock a second fader to move this one." : "Locked faders hold still while the rest make room."}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
