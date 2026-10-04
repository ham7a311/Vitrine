"use client";

import { useId, useState } from "react";
import "./meander-timeline.css";

/**
 * Meander Timeline
 * Collapsible event cards strung along a hand-drawn wavy rail. Each card has a
 * glowing node on the rail; one card opens at a time with a grid-rows reveal.
 */

export type TimelineEntry = {
  id: string;
  day: string;
  month: string;
  year?: string;
  title: string;
  tag?: string;
  description: string;
  meta?: { label: string; value: string }[];
};

function Tag({ children, className = "" }: { children: string; className?: string }) {
  return <span className={`mt-tag ${className}`}>{children}</span>;
}

function Row({ entry, open, onToggle, uid }: { entry: TimelineEntry; open: boolean; onToggle: () => void; uid: string }) {
  const panelId = `${uid}-${entry.id}`;
  return (
    <div className="mt-item">
      <span className="mt-node" aria-hidden="true" />
      <button type="button" className="mt-row" onClick={onToggle} aria-expanded={open} aria-controls={panelId}>
        <span className="mt-date">
          <span className="mt-date__day">{entry.day}</span>
          <span className="mt-date__month">
            {entry.month}
            {entry.year && <span className="mt-date__year"> {entry.year}</span>}
          </span>
        </span>
        <span className="mt-title">{entry.title}</span>
        {entry.tag && <Tag className="mt-tag--row">{entry.tag}</Tag>}
        <svg className={`mt-chevron${open ? " is-open" : ""}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div id={panelId} className="mt-panel" data-open={open ? "true" : "false"} role="region" aria-label={entry.title}>
        <div className="mt-panel__inner">
          <div className="mt-detail">
            {entry.tag && <Tag className="mt-tag--panel">{entry.tag}</Tag>}
            <p className="mt-detail__text">{entry.description}</p>
            {entry.meta?.length ? (
              <dl className="mt-meta">
                {entry.meta.map((m) => (
                  <div key={m.label}>
                    <dt>{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MeanderTimeline({ entries, expandFirst = false }: { entries: TimelineEntry[]; expandFirst?: boolean }) {
  const uid = useId();
  const [openId, setOpenId] = useState<string | null>(expandFirst && entries[0] ? entries[0].id : null);
  if (!entries.length) return null;

  return (
    <div className="mt-shell">
    <div className="mt">
      <svg className="mt-rail" viewBox="0 0 12 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M6 0 C 3.6 14, 8.6 28, 6 42 C 3.2 56, 8.8 70, 6 84 C 4.4 92, 7.4 96, 6 100" />
      </svg>
      {entries.map((entry) => (
        <Row
          key={entry.id}
          uid={uid}
          entry={entry}
          open={openId === entry.id}
          onToggle={() => setOpenId((cur) => (cur === entry.id ? null : entry.id))}
        />
      ))}
    </div>
    </div>
  );
}
