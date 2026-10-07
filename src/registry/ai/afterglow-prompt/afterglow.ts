/** Move through a list of `count` items by `delta`, wrapping at both ends. */
export function step(index: number, delta: number, count: number): number {
  if (count <= 0) return -1;
  return (((index + delta) % count) + count) % count;
}

/** Height for an auto-growing textarea, held between a minimum and a maximum number of lines. */
export function fitHeight(scrollHeight: number, lineHeight: number, minLines = 2, maxLines = 7): number {
  return Math.min(maxLines * lineHeight, Math.max(minLines * lineHeight, scrollHeight));
}

/** A link is worth attaching when it parses as http(s); bare domains get https:// added. */
export function normaliseLink(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname.includes(".")) return null;
    return u.href;
  } catch {
    return null;
  }
}
