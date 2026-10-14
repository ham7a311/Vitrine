/* What grows, drawn pointing up from its base at (0, 0), in the variant's colours. */
export type Flora = "blossom" | "fern" | "frost";

const petals = (n: number, ry: number, cy: number) =>
  Array.from({ length: n }, (_, k) => `<ellipse cx="0" cy="${cy - ry}" rx="${(ry * 0.68).toFixed(1)}" ry="${ry}" transform="rotate(${(k * 360) / n} 0 ${cy})"/>`).join("");

export function piece(flora: Flora, i: number, j: number): string {
  if (flora === "blossom") {
    if (i % 3 === 0) {
      const s = 1.05 + j * 0.2;
      return `<g transform="scale(${s.toFixed(2)})"><path d="M0 0 Q1 -4 0 -7" fill="none" stroke="var(--be-stem)" stroke-width="1.1"/><g fill="var(--be-a)">${petals(5, 3.6, -10)}</g><circle cx="0" cy="-10" r="1.7" fill="var(--be-c)"/></g>`;
    }
    return `<path d="M0 0C3.6-2.6 3.8-7.2 0-10.5-3.8-7.2-3.6-2.6 0 0Z" fill="var(--be-b)" transform="rotate(${(j * 38).toFixed(0)}) scale(${(0.75 + Math.abs(j) * 0.2).toFixed(2)})"/>`;
  }
  if (flora === "fern") {
    const len = 12 + Math.abs(j) * 5, bend = j * 4;
    const leaflets = Array.from({ length: 4 }, (_, k) => {
      const t = (k + 1) / 5, y = -len * t, x = bend * t * t, l = 4.4 * (1 - t * 0.6);
      return `<path d="M${x.toFixed(1)} ${y.toFixed(1)}l${(-l).toFixed(1)} ${(-l * 0.5).toFixed(1)}M${x.toFixed(1)} ${y.toFixed(1)}l${l.toFixed(1)} ${(-l * 0.5).toFixed(1)}"/>`;
    }).join("");
    return `<g fill="none" stroke="var(--be-b)" stroke-width="1.3" stroke-linecap="round"><path d="M0 0Q${(bend * 0.4).toFixed(1)} ${(-len * 0.6).toFixed(1)} ${bend.toFixed(1)} ${-len}" stroke="var(--be-a)"/>${leaflets}<circle cx="${bend.toFixed(1)}" cy="${-len - 1.6}" r="1.6" stroke="var(--be-a)"/></g>`;
  }
  // frost: six-armed crystals with little side branches; some only a glint
  const size = 4.5 + Math.abs(j) * 3.5;
  if (i % 4 === 3) return `<path class="bedge__glint" d="M0 -9v-6M-3 -12h6" stroke="var(--be-c)" stroke-width="1.2" stroke-linecap="round"/>`;
  const arm = `<path d="M0 0v-${size.toFixed(1)}M0 -${(size * 0.55).toFixed(1)}l-2 -2M0 -${(size * 0.55).toFixed(1)}l2 -2"/>`;
  return `<g transform="translate(0 -${(size + 2).toFixed(1)})" fill="none" stroke="var(--be-a)" stroke-width="1" stroke-linecap="round">${Array.from({ length: 6 }, (_, k) => `<g transform="rotate(${k * 60})">${arm}</g>`).join("")}</g>`;
}
