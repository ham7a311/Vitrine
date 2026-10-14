/** Why a handle can't be used, or null when its shape is fine. */
export function handleProblem(h: string): string | null {
  if (h.length < 3) return "At least 3 characters.";
  if (h.length > 20) return "20 characters at most.";
  if (!/^[a-z0-9_]+$/.test(h)) return "Only lowercase letters, numbers and underscores.";
  if (/^_|_$/.test(h)) return "Can't start or end with an underscore.";
  if (/__/.test(h)) return "No double underscores.";
  return null;
}

/** What the person typed, tidied the way we'd store it: no @, lowercase, spaces to underscores. */
export const tidy = (raw: string) => raw.replace(/^@+/, "").trim().toLowerCase().replace(/\s+/g, "_");

/** Up to `max` valid handles built from a name, skipping any in `avoid`. */
export function suggest(name: string, avoid: string[] = [], seed = 7, max = 3) {
  const parts = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  if (!parts.length) return [];
  const [first, ...rest] = parts, last = rest[rest.length - 1] ?? "";
  const pool = [
    last && `${first}_${last}`, last && `${first}${last}`, last && `${first}_${last[0]}`,
    `${first}_builds`, last && `${first[0]}${last}`, `${first}${(seed * 37) % 90 + 10}`, `hey_${first}`,
  ].filter((x): x is string => !!x);
  const out: string[] = [];
  for (const h of pool) if (!handleProblem(h) && !avoid.includes(h) && !out.includes(h)) { out.push(h); if (out.length === max) break; }
  return out;
}

/** Initials for an avatar: first letters of the first and last words. */
export const initials = (name: string) => {
  const w = name.trim().split(/\s+/).filter(Boolean);
  return ((w[0]?.[0] ?? "?") + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase();
};
