// The life of one destructive action: ask, work, finish, and a short window to take it back.
export type Phase = "idle" | "confirm" | "working" | "done" | "gone";
export type Event = "ask" | "cancel" | "confirm" | "finished" | "undo" | "expire" | "reset";

export function next(phase: Phase, e: Event): Phase {
  switch (e) {
    case "ask": return phase === "idle" ? "confirm" : phase;
    case "cancel": return phase === "confirm" ? "idle" : phase;
    case "confirm": return phase === "confirm" || phase === "idle" ? "working" : phase;
    case "finished": return phase === "working" ? "done" : phase;
    case "undo": return phase === "done" ? "idle" : phase;
    case "expire": return phase === "done" ? "gone" : phase;
    case "reset": return "idle";
  }
}

/** How full a hold-to-confirm button is after holding for `held` ms; it drains at twice the speed. */
export function holdLevel(level: number, dt: number, holding: boolean, duration: number) {
  const step = dt / duration;
  return Math.min(1, Math.max(0, holding ? level + step : level - step * 2));
}

/** Seconds left in a countdown, rounded up, never negative. */
export const secondsLeft = (ms: number) => Math.max(0, Math.ceil(ms / 1000));
