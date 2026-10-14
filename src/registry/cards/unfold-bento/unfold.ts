export type UnfoldState = { open: string | null; from: string | null };
export type UnfoldAction = { type: "open"; id: string } | { type: "close" } | { type: "step"; ids: string[]; by: 1 | -1 };

/** Which tile is unfolded, and which one to send focus back to when it folds. */
export function unfold(s: UnfoldState, a: UnfoldAction): UnfoldState {
  switch (a.type) {
    case "open": return { open: a.id, from: s.open ? s.from : a.id };
    case "close": return { open: null, from: s.open ?? s.from };
    case "step": {
      if (!s.open || a.ids.length === 0) return s;
      const i = a.ids.indexOf(s.open);
      const next = a.ids[(i + a.by + a.ids.length) % a.ids.length];
      return { open: next, from: s.from };
    }
  }
}

/** Run a DOM update inside a view transition when the browser has them and motion is welcome. */
export function transition(update: () => void) {
  const doc = typeof document !== "undefined" ? (document as Document & { startViewTransition?: (cb: () => void) => unknown }) : null;
  const calm = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc?.startViewTransition || calm) { update(); return; }
  doc.startViewTransition(update);
}
