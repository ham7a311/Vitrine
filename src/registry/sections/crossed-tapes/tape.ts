/** Endless tapes: wrapping an offset into one repeat, and how scrolling speeds them up. */

/** Offset folded into [0, span). */
export const wrap = (offset: number, span: number) => (span > 0 ? ((offset % span) + span) % span : 0);

/** Pixels per second for a tape: its base pace, boosted by how fast the page is scrolling (up to 5×). */
export const pace = (base: number, scrollSpeed: number) => base * (1 + Math.min(4, Math.abs(scrollSpeed) / 500));

/** Ease a measured scroll speed (px/s) towards zero when the page stops. */
export const settle = (speed: number, dt: number, half = 0.25) => speed * Math.pow(0.5, dt / half);
