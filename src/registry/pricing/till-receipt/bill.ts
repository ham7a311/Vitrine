/** Pricing maths in whole pence, so totals never drift. */

export type Plan = { id: string; name: string; blurb: string; seat: number; included: number };
export type Addon = { id: string; name: string; price: number; perSeat?: boolean };
export type Choice = { plan: string; seats: number; addons: string[]; annual: boolean };
export type Line = { id: string; label: string; detail?: string; amount: number };

/** The receipt for a choice: one line per charge, a subtotal, the annual saving and the monthly total. */
export function bill(c: Choice, plans: Plan[], addons: Addon[], annualOff = 0.2) {
  const plan = plans.find((p) => p.id === c.plan) ?? plans[0];
  const seats = Math.max(plan.included, c.seats);
  const lines: Line[] = [{ id: "plan", label: `${plan.name} plan`, detail: `${seats} × ${money(plan.seat)}`, amount: plan.seat * seats }];
  for (const a of addons) if (c.addons.includes(a.id)) lines.push({ id: a.id, label: a.name, detail: a.perSeat ? `${seats} × ${money(a.price)}` : undefined, amount: a.perSeat ? a.price * seats : a.price });
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const discount = c.annual ? Math.round(subtotal * annualOff) : 0;
  const total = subtotal - discount;
  return { lines, seats, subtotal, discount, total, yearly: c.annual ? total * 12 : null };
}

/** £1,234.50 from pence. */
export function money(p: number) {
  const s = (Math.abs(p) / 100).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${p < 0 ? "−" : ""}£${s}`;
}
