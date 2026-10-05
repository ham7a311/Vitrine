/**
 * Configuration rules with explanations. A rule says "if this option is
 * chosen, that group must be one of these" (requires) or "must not include
 * that option" (excludes). For a choice that breaks a rule, `fixFor` finds
 * the cheapest change elsewhere that makes it valid, never undoing the choice.
 */
export type BuildOption = { id: string; label: string; price: number; sku?: string; detail?: string };
export type BuildGroup = { id: string; label: string; options: BuildOption[]; multiple?: boolean };
export type Selection = Record<string, string[]>;
export type Rule = {
  if: { group: string; option: string };
  requires?: { group: string; options: string[] };
  excludes?: { group: string; option: string }[];
  /** Full sentence shown when the rule blocks a choice. */
  reason: string;
  /** A few words shown on the blocked option itself, e.g. "Needs 16 GB+". */
  short?: string;
};
export type Change = { group: string; from: string[]; to: string[] };

const has = (sel: Selection, g: string, o: string) => (sel[g] ?? []).includes(o);

export function broken(rules: Rule[], sel: Selection) {
  return rules.filter((r) => has(sel, r.if.group, r.if.option) && (
    (r.requires && !r.requires.options.some((o) => has(sel, r.requires!.group, o))) ||
    (r.excludes?.some((x) => has(sel, x.group, x.option)) ?? false)
  ));
}

export function choose(groups: BuildGroup[], sel: Selection, group: string, option: string): Selection {
  const g = groups.find((x) => x.id === group)!;
  const cur = sel[group] ?? [];
  return { ...sel, [group]: g.multiple ? (cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option]) : [option] };
}

export function total(groups: BuildGroup[], sel: Selection, base = 0) {
  return groups.reduce((sum, g) => sum + g.options.filter((o) => has(sel, g.id, o.id)).reduce((a, o) => a + o.price, 0), base);
}

/** The rules a choice would break, compared with the selection as it is. */
export function blockedBy(groups: BuildGroup[], rules: Rule[], sel: Selection, group: string, option: string) {
  const before = new Set(broken(rules, sel));
  return broken(rules, choose(groups, sel, group, option)).filter((r) => !before.has(r));
}

/**
 * Apply the choice, then repair each broken rule by changing the side the person
 * didn't just choose, picking the cheapest option that satisfies it.
 */
export function fixFor(groups: BuildGroup[], rules: Rule[], sel: Selection, group: string, option: string): { selection: Selection; changes: Change[]; reasons: string[] } | null {
  let next = choose(groups, sel, group, option);
  const reasons: string[] = [];
  const byId = new Map(groups.map((g) => [g.id, g]));
  const cheapest = (g: BuildGroup, ok: (o: BuildOption) => boolean) => [...g.options].filter(ok).sort((a, b) => a.price - b.price)[0];
  for (let round = 0; round < 5; round++) {
    const bad = broken(rules, next);
    if (!bad.length) break;
    for (const r of bad) {
      if (!broken(rules, next).includes(r)) continue;
      reasons.push(r.reason);
      const chosenIsCondition = r.if.group === group && r.if.option === option;
      if (chosenIsCondition && r.requires) {
        const g = byId.get(r.requires.group)!;
        const pick = cheapest(g, (o) => r.requires!.options.includes(o.id));
        if (!pick || (g.id === group && !g.multiple)) return null;
        next = { ...next, [g.id]: g.multiple ? [...(next[g.id] ?? []), pick.id] : [pick.id] };
      } else if (chosenIsCondition && r.excludes) {
        for (const x of r.excludes.filter((x) => has(next, x.group, x.option))) {
          const g = byId.get(x.group)!;
          if (g.id === group) return null;
          if (g.multiple) next = { ...next, [g.id]: next[g.id].filter((o) => o !== x.option) };
          else { const pick = cheapest(g, (o) => o.id !== x.option); if (!pick) return null; next = { ...next, [g.id]: [pick.id] }; }
        }
      } else {
        // The choice is the required/excluded side: change the condition instead.
        const g = byId.get(r.if.group)!;
        if (g.id === group) return null;
        if (g.multiple) next = { ...next, [g.id]: next[g.id].filter((o) => o !== r.if.option) };
        else { const pick = cheapest(g, (o) => o.id !== r.if.option); if (!pick) return null; next = { ...next, [g.id]: [pick.id] }; }
      }
    }
  }
  if (broken(rules, next).length) return null;
  const chosen = choose(groups, sel, group, option);
  const changes = groups.filter((g) => (next[g.id] ?? []).join() !== (chosen[g.id] ?? []).join()).map((g) => ({ group: g.id, from: chosen[g.id] ?? [], to: next[g.id] ?? [] }));
  return { selection: next, changes, reasons: [...new Set(reasons)] };
}
