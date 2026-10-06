// Upload helpers: checking a file, describing its size, and a believable simulated transfer.

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  const units = ["KB", "MB", "GB"];
  let v = n / 1024, i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v < 10 ? v.toFixed(1) : Math.round(v)} ${units[i]}`;
}

/** Why a file can't be taken, or null when it can. `accept` uses the same syntax as the input attribute. */
export function reject(file: { name: string; type: string; size: number }, accept: string | undefined, maxBytes: number | undefined): string | null {
  if (maxBytes != null && file.size > maxBytes) return `That file is ${formatBytes(file.size)}; the limit is ${formatBytes(maxBytes)}.`;
  if (!accept) return null;
  const rules = accept.split(",").map((r) => r.trim().toLowerCase()).filter(Boolean);
  const name = file.name.toLowerCase(), type = file.type.toLowerCase();
  const ok = rules.some((r) => (r.startsWith(".") ? name.endsWith(r) : r.endsWith("/*") ? type.startsWith(r.slice(0, -1)) : type === r));
  return ok ? null : "That kind of file isn't accepted here.";
}

/** Shorten a long file name in the middle, keeping its extension. */
export function middle(name: string, max = 24) {
  if (name.length <= max) return name;
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 && name.length - dot <= 6 ? name.slice(dot) : "";
  const keep = max - ext.length - 1;
  const head = Math.ceil(keep * 0.6), tail = keep - head;
  return `${name.slice(0, head)}…${name.slice(name.length - ext.length - tail)}`;
}

/** Simulated transfer progress (0–1) at time t (ms), for a file of `size` bytes: uneven, like a real network, and always finishing. */
export function simulated(t: number, size: number) {
  const total = Math.min(4200, 1100 + (size / (1024 * 1024)) * 260);
  const x = Math.min(1, Math.max(0, t / total));
  const wobble = 0.035 * Math.sin(x * 17) * (1 - x);
  return Math.min(1, Math.max(0, 1 - Math.pow(1 - x, 2.2) + wobble * x));
}
export const simulatedDuration = (size: number) => Math.min(4200, 1100 + (size / (1024 * 1024)) * 260);
