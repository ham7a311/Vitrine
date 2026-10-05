/** Adds business days to a calendar date (YYYY-MM-DD), skipping the given weekend days (0 = Sunday). */
export function addBusinessDays(isoDate: string, days: number, weekend: number[] = [0, 6]): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  // Same-day methods still land on the next business day if today is a weekend day.
  while (weekend.includes(d.getUTCDay())) d.setUTCDate(d.getUTCDate() + 1);
  let left = days;
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (!weekend.includes(d.getUTCDay())) left--;
  }
  return d.toISOString().slice(0, 10);
}
