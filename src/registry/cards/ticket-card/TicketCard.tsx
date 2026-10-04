"use client";

import { useState, type ReactNode } from "react";
import "./ticket-card.css";

/**
 * Ticket Card
 * An event ticket with a perforated stub. Hover and the stub loosens along its
 * perforation; click and it tears away, leaving a clean edge and a "torn" mark,
 * while the main ticket settles.
 */

type Props = {
  event: string;
  venue: string;
  date: string;
  time: string;
  seat: { label: string; value: string }[];
  code: string;
  stubLabel?: string;
  onTear?: () => void;
  footer?: ReactNode;
};

export function TicketCard({ event, venue, date, time, seat, code, stubLabel = "Admit one", onTear }: Props) {
  const [torn, setTorn] = useState(false);
  return (
    <article className={`tk ${torn ? "tk--torn" : ""}`}>
      <div className="tk__main">
        <p className="tk__kicker">{date} · {time}</p>
        <h3 className="tk__event">{event}</h3>
        <p className="tk__venue">{venue}</p>
        <dl className="tk__seat">
          {seat.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
        <span className="tk__notch tk__notch--t" aria-hidden="true" />
        <span className="tk__notch tk__notch--b" aria-hidden="true" />
      </div>

      <button
        type="button"
        className="tk__stub"
        onClick={() => {
          if (torn) return;
          setTorn(true);
          onTear?.();
        }}
        aria-pressed={torn}
        aria-label={torn ? `${stubLabel} — stub detached` : `${stubLabel} — tear off the stub`}
      >
        <span className="tk__perf" aria-hidden="true" />
        <span className="tk__stub-label">{torn ? "Detached" : stubLabel}</span>
        <span className="tk__bars" aria-hidden="true" />
        <span className="tk__code">{code}</span>
        <span className="tk__hint" aria-hidden="true">{torn ? "✓" : "tear ↗"}</span>
      </button>
    </article>
  );
}
