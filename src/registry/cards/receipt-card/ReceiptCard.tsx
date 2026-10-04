"use client";

import { useId, useState, type CSSProperties } from "react";
import "./receipt-card.css";

/**
 * Receipt Card
 * A pricing card with a printer slot. Hover (or open it) and an itemised
 * receipt feeds out of the slot line by line, with a printer's stutter, a
 * total and a barcode — everything the plan includes, printed on the spot.
 */

export type ReceiptLine = { item: string; value: string };

type Props = {
  plan: string;
  price: string;
  cadence: string;
  blurb: string;
  lines: ReceiptLine[];
  total: { label: string; value: string };
  cta: { label: string; href: string };
  /** Receipt reference printed at the top of the slip. */
  reference?: string;
  className?: string;
};

export function ReceiptCard({ plan, price, cadence, blurb, lines, total, cta, reference = "Nº 000417", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const slipId = useId();
  const rows = lines.length + 4; // header, lines, divider, total, barcode

  return (
    <article className={`rcpt ${open ? "rcpt--open" : ""} ${className}`} style={{ "--rows": rows } as CSSProperties} onMouseLeave={() => setOpen(false)}>
      <div className="rcpt__body">
        <p className="rcpt__plan">{plan}</p>
        <p className="rcpt__price">
          <span className="rcpt__amount">{price}</span>
          <span className="rcpt__cadence">{cadence}</span>
        </p>
        <p className="rcpt__blurb">{blurb}</p>
        <a className="rcpt__cta" href={cta.href}>
          {cta.label}
        </a>
        <button type="button" className="rcpt__toggle" aria-expanded={open} aria-controls={slipId} onClick={() => setOpen((o) => !o)} onMouseEnter={() => setOpen(true)} onFocus={() => setOpen(true)}>
          {open ? "Hide what’s included" : "Print what’s included"}
          <span aria-hidden="true" className="rcpt__toggle-icon">↧</span>
        </button>
        <div className="rcpt__slot" aria-hidden="true" />
      </div>

      <div className="rcpt__feed">
        <div id={slipId} className="rcpt__slip" role="region" aria-label={`${plan} — included`}>
          <p className="rcpt__line rcpt__line--head" style={{ "--n": 0 } as CSSProperties}>
            <span>{plan.toUpperCase()}</span>
            <span>{reference}</span>
          </p>
          <ul className="rcpt__items">
            {lines.map((l, i) => (
              <li key={l.item} className="rcpt__line" style={{ "--n": i + 1 } as CSSProperties}>
                <span className="rcpt__item">{l.item}</span>
                <span className="rcpt__leader" aria-hidden="true" />
                <span>{l.value}</span>
              </li>
            ))}
          </ul>
          <p className="rcpt__line rcpt__line--rule" style={{ "--n": lines.length + 1 } as CSSProperties} aria-hidden="true" />
          <p className="rcpt__line rcpt__line--total" style={{ "--n": lines.length + 2 } as CSSProperties}>
            <span>{total.label}</span>
            <span>{total.value}</span>
          </p>
          <p className="rcpt__line rcpt__barcode" style={{ "--n": lines.length + 3 } as CSSProperties} aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
