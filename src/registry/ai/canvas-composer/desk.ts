/* The briefing desk's rules: which pieces exist, which slot each fits, and what docking one does. */
import { EFFORT_LABEL, FILES, MODELS, MODES, fileName } from "./brief";

export type Kind = "mode" | "model" | "effort" | "file";
export type Piece = { key: string; kind: Kind; value: string; label: string };

export const PIECES: Piece[] = [
  ...MODES.map((m) => ({ key: `mode:${m.id}`, kind: "mode" as const, value: m.id, label: m.name })),
  ...MODELS.map((m) => ({ key: `model:${m.id}`, kind: "model" as const, value: m.id, label: m.name })),
  ...EFFORT_LABEL.map((l, i) => ({ key: `effort:${i}`, kind: "effort" as const, value: String(i), label: l })),
  ...FILES.map((f) => ({ key: `file:${f.path}`, kind: "file" as const, value: f.path, label: fileName(f.path) })),
];

export const byKey = (k: string) => PIECES.find((p) => p.key === k)!;

/** What's in the brief: one mode, one model, one effort, any number of files. */
export type Docked = { mode: string | null; model: string | null; effort: string | null; files: string[] };

export const empty: Docked = { mode: null, model: null, effort: null, files: [] };

export function isDocked(d: Docked, p: Piece) {
  return p.kind === "file" ? d.files.includes(p.key) : d[p.kind] === p.key;
}

/** Dock a piece. A single-slot kind swaps out whatever was there; returns the piece it displaced. */
export function dock(d: Docked, p: Piece): { next: Docked; displaced: string | null } {
  if (p.kind === "file") return { next: d.files.includes(p.key) ? d : { ...d, files: [...d.files, p.key] }, displaced: null };
  return { next: { ...d, [p.kind]: p.key }, displaced: d[p.kind] && d[p.kind] !== p.key ? d[p.kind] : null };
}

export function undock(d: Docked, p: Piece): Docked {
  return p.kind === "file" ? { ...d, files: d.files.filter((k) => k !== p.key) } : { ...d, [p.kind]: null };
}

/** What still stops the brief from running. */
export function missing(d: Docked, text: string): string[] {
  const out: string[] = [];
  if (!text.trim()) out.push("a task");
  if (!d.mode) out.push("a mode");
  if (!d.model) out.push("a model");
  return out;
}

/** Is a point inside a box (with some slack, so a near miss still lands)? */
export const within = (x: number, y: number, r: DOMRect, slack = 24) => x >= r.left - slack && x <= r.right + slack && y >= r.top - slack && y <= r.bottom + slack;
