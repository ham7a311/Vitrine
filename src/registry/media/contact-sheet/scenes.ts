/**
 * Demo-only "photographs": small deterministic SVG landscapes (dunes, harbour,
 * mountains, palms) at different times of day, as data URIs, so the contact
 * sheet needs no image files. The same seed always paints the same picture.
 */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const SKIES = [
  ["#f6c58f", "#f29e7d", "#7a5c8e"], // dawn
  ["#bfe3f5", "#e9f4f7", "#f7e6c9"], // noon
  ["#f7b267", "#f4845f", "#4a3b5c"], // dusk
  ["#1d2440", "#38406b", "#7d6f9a"], // night
];
const GROUNDS = [["#d9a066", "#c4824a", "#a8653a"], ["#4f6d7a", "#3a5563", "#26404d"], ["#7d8b6a", "#5f6e51", "#46533c"], ["#c9b28a", "#b39770", "#957a57"]];

export function scene(seed: number) {
  const r = rng(seed * 9973 + 17);
  const sky = SKIES[seed % 4], ground = GROUNDS[Math.floor(seed / 4) % 4];
  const kind = Math.floor(seed / 3) % 4;
  const W = 300, H = 200;
  const ridge = (base: number, amp: number, colour: string) => {
    let d = `M0 ${H} L0 ${base}`;
    for (let x = 0; x <= W; x += 30) d += ` Q${x + 15} ${base - amp * (0.4 + r())} ${x + 30} ${base + (r() - 0.5) * amp}`;
    return `<path d="${d} L${W} ${H} Z" fill="${colour}"/>`;
  };
  const sunY = seed % 4 === 1 ? 40 : 110 - r() * 30;
  let body = "";
  if (kind === 0) body = ridge(140, 40, ground[0]) + ridge(160, 30, ground[1]) + ridge(182, 18, ground[2]);
  else if (kind === 1) {
    body = `<rect y="130" width="${W}" height="70" fill="${ground[1]}"/>` + Array.from({ length: 3 }, (_, i) => { const x = 40 + i * 90 + r() * 30; return `<path d="M${x} 128 l40 0 l-6 9 l-28 0 z" fill="${ground[2]}"/><path d="M${x + 18} 128 l0 -34 l14 30 z" fill="${sky[2]}" opacity=".85"/>`; }).join("") + `<rect y="150" width="${W}" height="2" fill="${sky[1]}" opacity=".4"/><rect y="165" width="${W}" height="1.5" fill="${sky[1]}" opacity=".3"/>`;
  } else if (kind === 2) {
    let d = `M0 ${H} L0 150`;
    for (let x = 0; x <= W; x += 50) d += ` L${x + 25} ${60 + r() * 50} L${x + 50} ${130 + r() * 20}`;
    body = `<path d="${d} L${W} ${H} Z" fill="${ground[1]}"/>` + ridge(170, 20, ground[2]);
  } else {
    body = ridge(165, 12, ground[0]) + Array.from({ length: 4 }, (_, i) => { const x = 30 + i * 70 + r() * 20, h = 70 + r() * 40; return `<path d="M${x} 170 q4 ${-h / 2} ${2 + r() * 6} ${-h}" stroke="${ground[2]}" stroke-width="4" fill="none"/><g fill="${ground[2]}" transform="translate(${x + 4} ${170 - h})">${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse rx="16" ry="4" transform="rotate(${a + r() * 20}) translate(12 0)"/>`).join("")}</g>`; }).join("");
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[2]}"/><stop offset=".6" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[0]}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#s)"/><circle cx="${60 + r() * 180}" cy="${sunY}" r="${12 + r() * 10}" fill="${seed % 4 === 3 ? "#f3efe0" : "#fff3d6"}" opacity=".9"/>${body}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const PLACES = ["Wahiba Sands", "Muttrah harbour", "Jebel Shams", "Nizwa palms"];
const TIMES = ["dawn", "noon", "dusk", "night"];
export const sceneTitle = (seed: number) => `${PLACES[Math.floor(seed / 3) % 4]} at ${TIMES[seed % 4]}`;
