/** Size of the notch: a small capsule at rest, a panel when open, never wider than the space it sits in. */
export function notchSize(open: boolean, available: number, rest = { width: 300, height: 44 }, panel = 600) {
  const width = open ? Math.min(panel, Math.max(rest.width, available - 24)) : Math.min(rest.width, Math.max(160, available * 0.4));
  return { width: Math.round(width), height: open ? null : rest.height };
}

/** Next focus index for arrow keys in the open panel (links then the button), wrapping. */
export function cycle(index: number, count: number, key: string) {
  if (key === "ArrowDown") return (index + 1) % count;
  if (key === "ArrowUp") return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return index;
}
