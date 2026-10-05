/**
 * History as a tree. Undo moves to the parent; a change made after undoing
 * starts a new branch instead of throwing the old future away; redo follows
 * whichever child you came back from most recently.
 */
export type HistoryNode<T> = { id: number; parent: number | null; children: number[]; value: T; label: string; at: number; next?: number };
export type History<T> = { nodes: HistoryNode<T>[]; current: number };

export function create<T>(value: T, label = "Start", at = 0): History<T> {
  return { nodes: [{ id: 0, parent: null, children: [], value, label, at }], current: 0 };
}

const patch = <T,>(h: History<T>, id: number, p: Partial<HistoryNode<T>>): HistoryNode<T>[] => h.nodes.map((n) => (n.id === id ? { ...n, ...p } : n));

/** Record a new state. Repeats of the same label within `mergeMs` replace the tip instead of adding a node. */
export function commit<T>(h: History<T>, value: T, label: string, at = 0, mergeMs = 0): History<T> {
  const cur = h.nodes[h.current];
  if (mergeMs && cur.parent !== null && !cur.children.length && cur.label === label && at - cur.at <= mergeMs) {
    return { ...h, nodes: patch(h, cur.id, { value, at }) };
  }
  const id = h.nodes.length;
  const nodes = patch(h, cur.id, { children: [...cur.children, id], next: id });
  nodes.push({ id, parent: cur.id, children: [], value, label, at });
  return { nodes, current: id };
}

export function undo<T>(h: History<T>): History<T> {
  const cur = h.nodes[h.current];
  if (cur.parent === null) return h;
  return { nodes: patch(h, cur.parent, { next: cur.id }), current: cur.parent };
}

export function redo<T>(h: History<T>): History<T> {
  const cur = h.nodes[h.current];
  const to = cur.next ?? cur.children[cur.children.length - 1];
  return to === undefined ? h : { ...h, current: to };
}

export function path<T>(h: History<T>, id: number): number[] {
  const out: number[] = [];
  for (let n: number | null = id; n !== null; n = h.nodes[n].parent) out.unshift(n);
  return out;
}

/** Jump to any state; redo from its ancestors then leads back along this path. */
export function goTo<T>(h: History<T>, id: number): History<T> {
  if (!h.nodes[id]) return h;
  const p = path(h, id);
  let nodes = h.nodes;
  for (let i = 0; i < p.length - 1; i++) nodes = nodes.map((n) => (n.id === p[i] ? { ...n, next: p[i + 1] } : n));
  return { nodes, current: id };
}

/** The way from one node to another through their nearest common ancestor. */
export function route<T>(h: History<T>, from: number, to: number): number[] {
  const a = path(h, from), b = path(h, to);
  let k = 0;
  while (k < a.length && k < b.length && a[k] === b[k]) k++;
  return [...a.slice(k - 1).reverse(), ...b.slice(k)];
}

/** Rows follow creation order; the first child keeps its parent's lane and later children open new lanes. */
export function lanes<T>(h: History<T>): number[] {
  const lane = new Array<number>(h.nodes.length).fill(0);
  let max = 0;
  const walk = (id: number) => {
    h.nodes[id].children.forEach((c, i) => { lane[c] = i === 0 ? lane[id] : ++max; walk(c); });
  };
  walk(0);
  return lane;
}
