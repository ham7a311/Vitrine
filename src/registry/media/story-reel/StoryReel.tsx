"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { bars, next, person, prev, tick, type Pos } from "./reel";
import { Scene, type SceneKind } from "./scenes";
import "./story-reel.css";

export type Story = { id: string; kind: SceneKind; caption: string; quote?: string; ago: string };
export type StoryPerson = { name: string; colors: [string, string]; stories: Story[] };

export type StoryReelProps = {
  people: StoryPerson[];
  /** Seconds each story shows for. */
  duration?: number;
  theme?: "paper" | "night";
  className?: string;
};

const initials = (n: string) => n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

/**
 * Story Reel
 * Stories the way phones show them: bars across the top fill as each one plays, tapping the right
 * side moves on and the left goes back, holding pauses, and a swipe jumps to the next person. The
 * frames are illustrated scenes — dawn hills, a city at night, the sea, a quote — not photos.
 */
export function StoryReel({ people, duration = 5, theme = "night", className = "" }: StoryReelProps) {
  const uid = useId();
  const counts = people.map((p) => p.stories.length);
  const [pos, setPos] = useState<Pos>({ p: 0, s: 0, t: 0 });
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const [seen, setSeen] = useState<Set<number>>(() => new Set());
  const press = useRef<{ x: number; t: number; timer: number } | null>(null);
  const live = useRef(pos);
  live.current = pos;
  const stopped = held || paused;

  useEffect(() => {
    if (stopped) return;
    let raf = 0, last = 0;
    const loop = (ms: number) => {
      const dt = last ? Math.min(0.1, (ms - last) / 1000) : 0; last = ms;
      const p = live.current, n = tick(p, dt, counts, duration);
      if (n.p !== p.p) { setSeen((s) => new Set(s).add(p.p)); setDir(1); }
      live.current = n;
      setPos(n);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopped, duration, people]);

  const go = (to: Pos, d: 1 | -1) => { if (to.p !== live.current.p) { setDir(d); setSeen((s) => new Set(s).add(live.current.p)); } setPos(to); };
  const forward = () => go(next(live.current, counts), 1);
  const back = () => go(prev(live.current, counts), -1);
  const keys = (e: KeyboardEvent) => {
    const map: Record<string, () => void> = {
      ArrowRight: forward, ArrowLeft: back,
      ArrowDown: () => go(person(live.current.p + 1, counts), 1), ArrowUp: () => go(person(live.current.p - 1, counts), -1),
      " ": () => setPaused((v) => !v),
    };
    if (map[e.key]) { e.preventDefault(); map[e.key](); }
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    const timer = window.setTimeout(() => setHeld(true), 180);
    press.current = { x: e.clientX, t: performance.now(), timer };
  };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    const pr = press.current;
    press.current = null;
    if (!pr) return;
    window.clearTimeout(pr.timer);
    const dx = e.clientX - pr.x, long = performance.now() - pr.t > 180;
    setHeld(false);
    if (Math.abs(dx) > 60) { go(person(live.current.p + (dx < 0 ? 1 : -1), counts), dx < 0 ? 1 : -1); return; }
    if (long) return;
    const r = e.currentTarget.getBoundingClientRect();
    if (e.clientX - r.left < r.width / 3) back(); else forward();
  };

  const who = people[pos.p], story = who.stories[pos.s];
  return (
    <section className={`sreel sreel--${theme} ${className}`} aria-labelledby={`${uid}-t`}>
      <h3 id={`${uid}-t`} className="sreel__sr">Stories</h3>
      <div className="sreel__frame" tabIndex={0} role="group" aria-roledescription="story viewer"
        aria-label={`${who.name}, story ${pos.s + 1} of ${who.stories.length}: ${story.caption}. Arrow keys move, Space pauses.`}
        onKeyDown={keys} onPointerDown={down} onPointerUp={up} onPointerCancel={() => { press.current = null; setHeld(false); }}
        data-paused={stopped ? "" : undefined}>
        <div key={`${pos.p}`} className="sreel__person" data-dir={dir}>
          <div key={story.id} className="sreel__shot" style={{ ["--dur" as string]: `${duration}s` } as CSSProperties}>
            <Scene kind={story.kind} a={who.colors[0]} b={who.colors[1]} text={story.quote} />
          </div>
          <div className="sreel__shade" />
          <div className="sreel__bars" aria-hidden="true">
            {bars(pos, who.stories.length).map((f, i) => <i key={i}><b style={{ transform: `scaleX(${f})` }} /></i>)}
          </div>
          <div className="sreel__who">
            <span className="sreel__avatar" style={{ background: `linear-gradient(135deg, ${who.colors[0]}, ${who.colors[1]})` } as CSSProperties} aria-hidden="true">{initials(who.name)}</span>
            <b>{who.name}</b><span>{story.ago}</span>
            {stopped && <span className="sreel__pause" aria-hidden="true">Paused</span>}
          </div>
          <p className="sreel__caption">{story.caption}</p>
        </div>
      </div>
      <div className="sreel__controls">
        <button type="button" onClick={back} aria-label="Previous story"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" /></svg></button>
        <button type="button" onClick={() => setPaused((v) => !v)} aria-pressed={paused}>{paused ? "Play" : "Pause"}</button>
        <button type="button" onClick={forward} aria-label="Next story"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" /></svg></button>
      </div>
      <ul className="sreel__people" aria-label="People">
        {people.map((pp, i) => (
          <li key={pp.name}>
            <button type="button" aria-current={i === pos.p ? "true" : undefined} data-seen={seen.has(i) && i !== pos.p ? "" : undefined} onClick={() => go(person(i, counts), i >= pos.p ? 1 : -1)}
              aria-label={`${pp.name}, ${pp.stories.length} stories${seen.has(i) ? ", seen" : ""}`}>
              <span className="sreel__ring" style={{ ["--a" as string]: pp.colors[0], ["--b" as string]: pp.colors[1] } as CSSProperties}><span className="sreel__avatar" style={{ background: `linear-gradient(135deg, ${pp.colors[0]}, ${pp.colors[1]})` } as CSSProperties}>{initials(pp.name)}</span></span>
              <span className="sreel__name">{pp.name.split(" ")[0]}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="sreel__sr" aria-live="polite">{`${who.name}: ${story.caption}`}</p>
    </section>
  );
}

export default StoryReel;
