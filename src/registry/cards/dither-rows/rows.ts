/** Next row for a key in a vertical list; wraps, with Home and End. */
export function next(index: number, count: number, key: string) {
  if (key === "ArrowDown") return (index + 1) % count;
  if (key === "ArrowUp") return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return index;
}
