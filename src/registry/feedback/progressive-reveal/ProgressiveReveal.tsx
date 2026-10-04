"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./progressive-reveal.css";

/**
 * Progressive Reveal
 * Loading that shows the final layout in order of importance, like a drawing
 * inked in stages: the structure is there at once, then primary content
 * resolves, then secondary, then details. Placeholders are typographically
 * true — the size of the words they stand for — so nothing shifts when they
 * resolve. Only the tier you're waiting on breathes; there is no shimmer.
 */

/** 0 = structure only · 1 primary · 2 secondary · 3 details · 4 complete */
export type Tier = 1 | 2 | 3;

type Ctx = { stage: number; armed: boolean; failed: Tier[]; onRetry?: (tier: Tier) => void };
const RevealContext = createContext<Ctx>({ stage: 4, armed: false, failed: [] });

type ProviderProps = {
  stage: number;
  children: ReactNode;
  /** Tiers whose data failed to load. */
  failed?: Tier[];
  onRetry?: (tier: Tier) => void;
  /** Placeholders stay invisible for this long, so fast loads never flash. */
  threshold?: number;
  className?: string;
  theme?: "paper" | "night";
  label?: string;
};

export function RevealProvider({ stage, children, failed = [], onRetry, threshold = 180, className = "", theme = "paper", label = "Content" }: ProviderProps) {
  const [armed, setArmed] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (stage >= 4) return;
    if (!started.current) started.current = true;
    const t = window.setTimeout(() => setArmed(true), threshold);
    return () => window.clearTimeout(t);
  }, [stage >= 4, threshold]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (stage === 0) setArmed(false);
  }, [stage]);

  return (
    <RevealContext.Provider value={{ stage, armed, failed, onRetry }}>
      <div className={`progressive-reveal progressive-reveal--${theme} ${className}`} data-armed={armed || undefined} aria-busy={stage < 4 || undefined} aria-label={label}>
        {children}
        <span className="progressive-reveal__sr" role="status">
          {stage >= 4 ? (failed.length ? "Loaded, with some details unavailable." : "Loaded.") : ""}
        </span>
      </div>
    </RevealContext.Provider>
  );
}

function useTier(tier: Tier) {
  const { stage, armed, failed, onRetry } = useContext(RevealContext);
  const isFailed = failed.includes(tier) && stage >= tier;
  return { ready: stage >= tier && !isFailed, waiting: stage + 1 === tier || (stage < tier && tier === 1), armed, isFailed, retry: () => onRetry?.(tier) };
}

type Common = { tier: Tier; order?: number; className?: string };

/** Any content that belongs to a tier. Provide a placeholder of the same shape. */
export function Reveal({ tier, order = 0, className = "", children, placeholder, fallback }: Common & { children: ReactNode; placeholder: ReactNode; fallback?: ReactNode }) {
  const { ready, waiting, armed, isFailed, retry } = useTier(tier);
  if (ready)
    return (
      <span className={`progressive-reveal__in ${className}`} style={{ "--pr-i": order } as CSSProperties}>
        {children}
      </span>
    );
  if (isFailed)
    return (
      fallback ?? (
        <span className="progressive-reveal__fail">
          Couldn&rsquo;t load this.{" "}
          <button type="button" onClick={retry}>
            Retry
          </button>
        </span>
      )
    );
  return (
    <span className={`progressive-reveal__ph-wrap ${className}`} data-waiting={waiting || undefined} data-armed={armed || undefined} aria-hidden="true">
      {placeholder}
    </span>
  );
}

/** A word-shaped placeholder: the real font size, `chars` wide, x-height tall. */
function Text({ tier, chars, order, className, children }: Common & { chars: number; children: ReactNode }) {
  return (
    <Reveal tier={tier} order={order} className={className} placeholder={<span className="progressive-reveal__text" style={{ width: `${chars}ch` }} />}>
      {children}
    </Reveal>
  );
}

/** Paragraph placeholder: n lines, the last one short. */
function Lines({ tier, lines, order, className, children }: Common & { lines: number; children: ReactNode }) {
  return (
    <Reveal
      tier={tier}
      order={order}
      className={className}
      placeholder={
        <span className="progressive-reveal__lines">
          {Array.from({ length: lines }, (_, i) => (
            <span key={i} className="progressive-reveal__text" style={{ width: i === lines - 1 ? "58%" : `${92 + ((i * 7) % 8)}%` }} />
          ))}
        </span>
      }
    >
      {children}
    </Reveal>
  );
}

/** A block placeholder at the exact size of the thing it stands for. */
function Block({ tier, w, h, radius = 8, order, className, children, fallback }: Common & { w: string | number; h: string | number; radius?: number; children: ReactNode; fallback?: ReactNode }) {
  return (
    <Reveal tier={tier} order={order} className={className} fallback={fallback} placeholder={<span className="progressive-reveal__block" style={{ width: w, height: h, borderRadius: radius }} />}>
      {children}
    </Reveal>
  );
}

Reveal.Text = Text;
Reveal.Lines = Lines;
Reveal.Block = Block;

/**
 * Drive the stages from a schedule of arrival times (ms) for tiers 1–3.
 * A tier listed in `fail` resolves as failed instead.
 */
export function useTierSchedule(schedule: [number, number, number] | null, fail: Tier[] = [], run = 0) {
  const [stage, setStage] = useState(schedule ? 0 : 4);
  const [failed, setFailed] = useState<Tier[]>([]);
  useEffect(() => {
    if (!schedule) return;
    setStage(0);
    setFailed([]);
    const timers = schedule.map((ms, i) =>
      window.setTimeout(() => {
        setStage(i + 2 > 3 ? 4 : i + 1);
        if (fail.includes((i + 1) as Tier)) setFailed((f) => [...f, (i + 1) as Tier]);
      }, ms),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [run]); // eslint-disable-line react-hooks/exhaustive-deps
  return { stage, failed, setFailed, setStage };
}
