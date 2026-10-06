/** Split a reply into the pieces it streams in: each word with the space or line break before it. */
export function tokens(text: string): string[] {
  return text.match(/\s*\S+/g) ?? [];
}

/** Lines a textarea needs for its content, clamped to [1, max]. */
export function rowsFor(scrollHeight: number, lineHeight: number, padding: number, max: number) {
  const n = Math.round((scrollHeight - padding) / lineHeight);
  return Math.max(1, Math.min(max, n));
}

