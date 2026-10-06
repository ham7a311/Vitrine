/* Generative website mockups for the helix cards: every "photo" is painted from gradients and shapes. */

export type Scene = "dunes" | "sea" | "city" | "leaf" | "orbit" | "figure" | "court" | "peaks";
export type Layout = "hero" | "split" | "editorial" | "dark" | "product";
export type Project = {
  title: string;
  kind: string;
  href: string;
  /** The big line printed on the mock site. */
  headline: string;
  layout: Layout;
  scene: Scene;
  bg: string;
  ink: string;
  accent: string;
  serif?: boolean;
};

export const CELL = { w: 512, h: 330, cols: 4, size: 2048 };

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function lin(c: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, stops: [number, string][]) {
  const g = c.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([o, s]) => g.addColorStop(o, s));
  return g;
}

/** Paint a scene into the rectangle as if it were a photograph. */
function scene(c: CanvasRenderingContext2D, s: Scene, x: number, y: number, w: number, h: number, seed: number) {
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  const R = (k: number) => { const v = Math.sin(seed * 91.7 + k * 12.9) * 43758.5; return v - Math.floor(v); };
  if (s === "dunes" || s === "sea" || s === "peaks") {
    const sky = s === "sea" ? [[0, "#f6c9a4"], [0.55, "#f4a77c"], [1, "#7fa8c9"]] : s === "peaks" ? [[0, "#9cc3e6"], [1, "#e8f1f7"]] : [[0, "#f3d6b5"], [1, "#e9b48a"]];
    c.fillStyle = lin(c, 0, y, 0, y + h, sky as [number, string][]); c.fillRect(x, y, w, h);
    c.fillStyle = s === "peaks" ? "rgba(255,255,255,0.8)" : "rgba(255,240,220,0.9)";
    c.beginPath(); c.arc(x + w * (0.3 + R(1) * 0.4), y + h * 0.38, h * 0.09, 0, 7); c.fill();
    const layers = s === "sea" ? ["#4f7ea6", "#365f86", "#23466a"] : s === "peaks" ? ["#7b93ad", "#566f8a", "#2f4660"] : ["#d79a6a", "#c07c4e", "#9b5c36"];
    layers.forEach((col, k) => {
      c.fillStyle = col; c.beginPath();
      const base = y + h * (0.55 + k * 0.14);
      c.moveTo(x, y + h);
      for (let i = 0; i <= 24; i++) {
        const px = x + (w * i) / 24;
        const amp = s === "peaks" ? h * (0.22 - k * 0.05) * Math.abs(Math.sin(i * 0.9 + R(k) * 6)) : s === "sea" ? h * 0.012 : h * 0.07;
        c.lineTo(px, base - amp * (s === "peaks" ? 1 : Math.sin(i * 0.5 + k + R(k) * 6)));
      }
      c.lineTo(x + w, y + h); c.closePath(); c.fill();
    });
  } else if (s === "city") {
    c.fillStyle = lin(c, 0, y, 0, y + h, [[0, "#1d2a44"], [0.6, "#c86b4a"], [1, "#f2b57c"]]); c.fillRect(x, y, w, h);
    for (let i = 0; i < 18; i++) {
      const bw = w / 18, bh = h * (0.25 + R(i) * 0.5);
      c.fillStyle = i % 3 ? "#1a2233" : "#232d42"; c.fillRect(x + i * bw, y + h - bh, bw - 1, bh);
      c.fillStyle = "rgba(255,210,140,0.55)";
      for (let j = 0; j < bh / 10; j++) if (R(i * 31 + j) > 0.6) c.fillRect(x + i * bw + 3, y + h - bh + 6 + j * 10, 3, 3);
    }
  } else if (s === "leaf") {
    c.fillStyle = lin(c, x, y, x + w, y + h, [[0, "#dfe9d2"], [1, "#a9c39a"]]); c.fillRect(x, y, w, h);
    for (let i = 0; i < 9; i++) {
      c.fillStyle = ["#4f7a4a", "#6d9a5f", "#355a35"][i % 3];
      c.save(); c.translate(x + w * R(i), y + h * R(i + 9)); c.rotate(R(i + 3) * 6);
      c.beginPath(); c.ellipse(0, 0, h * 0.26, h * 0.09, 0, 0, 7); c.fill(); c.restore();
    }
  } else if (s === "orbit") {
    c.fillStyle = "#05070d"; c.fillRect(x, y, w, h);
    const cx = x + w * 0.62, cy = y + h * 0.55, r = h * 0.32;
    const g = c.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.1, cx, cy, r);
    g.addColorStop(0, "#f4a259"); g.addColorStop(0.6, "#b34a2a"); g.addColorStop(1, "#2a0e0a");
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.fill();
    c.strokeStyle = "rgba(255,200,150,0.55)"; c.lineWidth = 3; c.beginPath(); c.ellipse(cx, cy, r * 1.7, r * 0.35, -0.25, 0, 7); c.stroke();
    for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(255,255,255,${R(i) * 0.8})`; c.fillRect(x + R(i + 1) * w, y + R(i + 2) * h, 1.5, 1.5); }
  } else if (s === "figure") {
    c.fillStyle = lin(c, x, y, x, y + h, [[0, "#c9b8a6"], [1, "#8d7b6b"]]); c.fillRect(x, y, w, h);
    const cx = x + w * 0.5;
    c.fillStyle = "#3b2f28"; c.beginPath(); c.ellipse(cx, y + h * 1.05, w * 0.32, h * 0.5, 0, 0, 7); c.fill();
    c.fillStyle = "#b9876a"; c.beginPath(); c.ellipse(cx, y + h * 0.42, h * 0.15, h * 0.19, 0, 0, 7); c.fill();
    c.fillStyle = "#2b211c"; c.beginPath(); c.ellipse(cx, y + h * 0.31, h * 0.17, h * 0.12, 0, Math.PI, 0); c.fill();
  } else {
    c.fillStyle = lin(c, x, y, x, y + h, [[0, "#9ec3e8"], [0.55, "#e8f0f6"], [0.56, "#6f9a5b"], [1, "#4c7340"]]); c.fillRect(x, y, w, h);
    c.fillStyle = "#f1ece2"; c.fillRect(x + w * 0.22, y + h * 0.36, w * 0.56, h * 0.22);
    c.fillStyle = "#7a5d48"; c.beginPath(); c.moveTo(x + w * 0.18, y + h * 0.38); c.lineTo(x + w * 0.5, y + h * 0.22); c.lineTo(x + w * 0.82, y + h * 0.38); c.fill();
    c.fillStyle = "#3b4d60"; for (let i = 0; i < 7; i++) c.fillRect(x + w * (0.26 + i * 0.075), y + h * 0.42, w * 0.03, h * 0.1);
    c.fillStyle = "#2f5329"; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(x + w * (0.05 + i * 0.18), y + h * 0.56, h * 0.08, 0, 7); c.fill(); }
  }
  c.restore();
}

function bars(c: CanvasRenderingContext2D, x: number, y: number, widths: number[], color: string, gap = 10, hgt = 5) {
  c.fillStyle = color;
  widths.forEach((w, i) => { rr(c, x, y + i * gap, w, hgt, hgt / 2); c.fill(); });
}

/** Draw one mock site into the atlas cell. */
export function paint(c: CanvasRenderingContext2D, p: Project, cx: number, cy: number, seed: number) {
  const { w: W, h: H } = CELL;
  const pad = 22;
  c.save(); c.translate(cx, cy);
  c.fillStyle = p.bg; c.fillRect(0, 0, W, H);
  const head = (size: number) => `${p.serif ? "500" : "600"} ${size}px ${p.serif ? "Georgia, 'Times New Roman', serif" : "'Helvetica Neue', Arial, sans-serif"}`;
  const wrap = (text: string, x: number, y: number, max: number, size: number, color: string, lh = 1.04) => {
    c.font = head(size); c.fillStyle = color; c.textBaseline = "top";
    const words = text.split(" "); let line = "", yy = y;
    for (const word of words) { const t = line ? `${line} ${word}` : word; if (c.measureText(t).width > max && line) { c.fillText(line, x, yy); line = word; yy += size * lh; } else line = t; }
    c.fillText(line, x, yy);
    return yy + size * lh;
  };
  const nav = (ink: string, onDark = false) => {
    c.font = "700 11px 'Helvetica Neue', Arial, sans-serif"; c.fillStyle = ink; c.textBaseline = "middle";
    c.fillText(p.title, pad, 20);
    c.fillStyle = onDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)";
    [0, 1, 2, 3].forEach((i) => { rr(c, W * 0.36 + i * 46, 18, 34, 4, 2); c.fill(); });
    c.fillStyle = p.accent; rr(c, W - pad - 64, 11, 64, 18, 9); c.fill();
  };

  if (p.layout === "hero") {
    scene(c, p.scene, 0, 0, W, H, seed);
    c.fillStyle = lin(c, 0, H * 0.35, 0, H, [[0, "rgba(0,0,0,0)"], [1, "rgba(0,0,0,0.55)"]]); c.fillRect(0, 0, W, H);
    nav("#ffffff", true);
    const end = wrap(p.headline, pad, H * 0.5, W * 0.62, 38, "#ffffff");
    bars(c, pad, end + 8, [180, 140], "rgba(255,255,255,0.7)", 10, 4);
    c.fillStyle = "#ffffff"; rr(c, pad, end + 34, 92, 24, 12); c.fill();
  } else if (p.layout === "split") {
    nav(p.ink);
    const end = wrap(p.headline, pad, 70, W * 0.42, 34, p.ink);
    bars(c, pad, end + 10, [170, 150, 120], "rgba(0,0,0,0.28)", 11, 5);
    c.fillStyle = p.accent; rr(c, pad, end + 52, 96, 26, 13); c.fill();
    c.strokeStyle = p.ink; c.lineWidth = 1.2; rr(c, pad + 106, end + 52, 84, 26, 13); c.stroke();
    c.save(); rr(c, W * 0.5, 50, W * 0.5 - pad, H - 72, 14); c.clip(); scene(c, p.scene, W * 0.5, 50, W * 0.5 - pad, H - 72, seed); c.restore();
  } else if (p.layout === "editorial") {
    nav(p.ink);
    wrap(p.headline, pad, 52, W - pad * 2, 46, p.ink, 0.98);
    c.save(); rr(c, pad, H * 0.5, W - pad * 2, H * 0.5 - pad, 10); c.clip(); scene(c, p.scene, pad, H * 0.5, W - pad * 2, H * 0.5 - pad, seed); c.restore();
  } else if (p.layout === "dark") {
    c.fillStyle = "#07080b"; c.fillRect(0, 0, W, H);
    const g = c.createRadialGradient(W * 0.5, H * 0.1, 10, W * 0.5, H * 0.1, W * 0.6);
    g.addColorStop(0, p.accent); g.addColorStop(1, "rgba(0,0,0,0)"); c.globalAlpha = 0.45; c.fillStyle = g; c.fillRect(0, 0, W, H); c.globalAlpha = 1;
    nav("#ffffff", true);
    c.textAlign = "center"; wrap(p.headline, W / 2, 74, W * 0.8, 40, "#ffffff"); c.textAlign = "left";
    [0, 1, 2].forEach((i) => { c.save(); rr(c, pad + i * ((W - pad * 2 + 14) / 3), H * 0.58, (W - pad * 2 - 28) / 3, H * 0.36, 10); c.clip(); scene(c, (["orbit", "city", "figure"] as Scene[])[(i + seed) % 3], pad + i * ((W - pad * 2 + 14) / 3), H * 0.58, (W - pad * 2 - 28) / 3, H * 0.36, seed + i); c.restore(); });
  } else {
    nav(p.ink);
    c.fillStyle = p.accent; c.globalAlpha = 0.16; c.beginPath(); c.arc(W * 0.72, H * 0.56, H * 0.36, 0, 7); c.fill(); c.globalAlpha = 1;
    c.save(); c.beginPath(); c.arc(W * 0.72, H * 0.56, H * 0.28, 0, 7); c.clip(); scene(c, p.scene, W * 0.72 - H * 0.28, H * 0.28, H * 0.56, H * 0.56, seed); c.restore();
    const end = wrap(p.headline, pad, 80, W * 0.46, 34, p.ink);
    bars(c, pad, end + 10, [150, 120], "rgba(0,0,0,0.3)", 11, 5);
    c.fillStyle = p.ink; rr(c, pad, end + 40, 104, 26, 13); c.fill();
  }
  c.restore();
}

/** All projects painted into one square power-of-two atlas. */
export function atlas(projects: Project[]) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = CELL.size;
  const c = cv.getContext("2d")!;
  projects.forEach((p, i) => paint(c, p, (i % CELL.cols) * CELL.w, Math.floor(i / CELL.cols) * CELL.h, i + 1));
  return cv;
}

/** One project as its own image, for the no-WebGL grid. */
export function single(p: Project, seed: number) {
  const cv = document.createElement("canvas");
  cv.width = CELL.w; cv.height = CELL.h;
  paint(cv.getContext("2d")!, p, 0, 0, seed);
  return cv.toDataURL("image/png");
}
