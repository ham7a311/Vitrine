/** The part of the stage on screen, in the stage's own (unscaled) pixels. */
export type Box = { x: number; y: number; w: number; h: number };

export type Shot = {
  box: Box;
  /** The page's background and text colour as they were, before the switch. */
  colours: { bg: string; text: string };
  /** How many elements the page has: heavy pages get fewer copies. */
  nodes: number;
  /** A layer over the visible box showing the page as it was ("old") or, after the switch, as it now is ("new"). */
  layer: (which?: "old" | "new") => HTMLElement;
  /** An empty layer over the visible box, for drawing (crack lines, a flap). */
  sheet: () => HTMLElement;
  clear: () => void;
};

/** A detached, inert copy of a page: no ids, canvases and form values carried over from `from`. */
function freeze(src: HTMLElement, from: HTMLElement = src) {
  const copy = src.cloneNode(true) as HTMLElement;
  copy.removeAttribute("id");
  copy.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  copy.setAttribute("aria-hidden", "true");
  copy.inert = true;
  const fromCanvas = from.querySelectorAll("canvas"), toCanvas = copy.querySelectorAll("canvas");
  toCanvas.forEach((c, i) => {
    const o = fromCanvas[i];
    if (!o) return;
    c.width = o.width; c.height = o.height;
    try { c.getContext("2d")?.drawImage(o, 0, 0); } catch { /* a tainted canvas stays blank */ }
  });
  const fromField = from.querySelectorAll("input, textarea, select"), toField = copy.querySelectorAll("input, textarea, select");
  toField.forEach((f, i) => {
    const o = fromField[i] as HTMLInputElement | undefined;
    if (!o) return;
    (f as HTMLInputElement).value = o.value;
    if ("checked" in o) (f as HTMLInputElement).checked = o.checked;
  });
  copy.querySelectorAll("video, audio").forEach((m) => (m as HTMLMediaElement).pause?.());
  return copy;
}

const opaque = (c: string) => c !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(c);

/**
 * The page's own colours: the first opaque background found going into the page (a wrapper often has none, the
 * site's root has it), then out through its ancestors, with that element's text colour.
 */
function surface(page: HTMLElement) {
  for (let el: Element | null = page; el; el = el.firstElementChild) {
    const cs = getComputedStyle(el);
    if (opaque(cs.backgroundColor)) return { bg: cs.backgroundColor, text: cs.color };
    if (el.children.length !== 1 && el !== page) break;
  }
  for (let el: Element | null = page.parentElement; el; el = el.parentElement) {
    const cs = getComputedStyle(el);
    if (opaque(cs.backgroundColor)) return { bg: cs.backgroundColor, text: getComputedStyle(page).color };
  }
  return { bg: "#ffffff", text: getComputedStyle(page).color };
}

/**
 * Captures the page before a theme switch. Layers are positioned inside `host`, which sits over the stage, so
 * they share any transform the stage has (a scaled preview) and never leave it.
 */
export function snapshot(stage: HTMLElement, page: HTMLElement, host: HTMLElement): Shot {
  const r = stage.getBoundingClientRect(), k = r.width / (stage.offsetWidth || 1) || 1;
  const x = Math.max(0, -r.left / k), y = Math.max(0, -r.top / k);
  const w = Math.max(0, Math.min(stage.offsetWidth, (innerWidth - r.left) / k) - x);
  const h = Math.max(0, Math.min(stage.offsetHeight, (innerHeight - r.top) / k) - y);
  const box = { x, y, w, h };
  // Scroll positions inside the page, so a copy lines up with what was on screen.
  const all = page.getElementsByTagName("*"), scrolled: [number, number, number][] = [];
  for (let i = 0; i < all.length; i++) { const el = all[i]; if (el.scrollTop || el.scrollLeft) scrolled.push([i, el.scrollTop, el.scrollLeft]); }
  const own: [number, number] = [page.scrollTop, page.scrollLeft];
  const old = freeze(page);
  const colours = surface(page);
  const made: HTMLElement[] = [];
  let first = true;

  const frame = () => {
    const el = document.createElement("div");
    el.className = "tsw-layer";
    el.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    host.appendChild(el);
    made.push(el);
    return el;
  };
  const place = (copy: HTMLElement, el: HTMLElement) => {
    copy.style.cssText += `;position:absolute;margin:0;left:${page.offsetLeft - x}px;top:${page.offsetTop - y}px;width:${page.offsetWidth}px;height:${page.offsetHeight}px`;
    el.appendChild(copy);
    copy.scrollTop = own[0]; copy.scrollLeft = own[1];
    const els = copy.getElementsByTagName("*");
    for (const [i, top, left] of scrolled) { const e = els[i]; if (e) { e.scrollTop = top; e.scrollLeft = left; } }
  };

  return {
    box,
    colours,
    nodes: all.length,
    layer(which = "old") {
      const el = frame();
      // The first old layer uses the capture itself; later ones copy it (the live page has already switched).
      const copy = which === "new" ? freeze(page) : first ? old : freeze(old, old);
      if (which === "old") first = false;
      place(copy, el);
      return el;
    },
    sheet: frame,
    clear() { for (const el of made) el.remove(); made.length = 0; },
  };
}
