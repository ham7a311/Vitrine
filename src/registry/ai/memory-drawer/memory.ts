/** What the assistant remembers: a small reducer for editing, pinning, forgetting and undoing. */

export type Memory = { id: string; topic: string; text: string; source: string; pinned?: boolean; fresh?: boolean };
export type MemoryState = { items: Memory[]; enabled: boolean; gone: { item: Memory; index: number } | null };

export type MemoryAction =
  | { type: "edit"; id: string; text: string }
  | { type: "pin"; id: string }
  | { type: "forget"; id: string }
  | { type: "undo" }
  | { type: "toggle" };

export function memories(state: MemoryState, a: MemoryAction): MemoryState {
  switch (a.type) {
    case "edit": {
      const text = a.text.trim();
      if (!text) return state;
      return { ...state, items: state.items.map((m) => (m.id === a.id ? { ...m, text } : m)) };
    }
    case "pin": return { ...state, items: state.items.map((m) => (m.id === a.id ? { ...m, pinned: !m.pinned } : m)) };
    case "forget": {
      const index = state.items.findIndex((m) => m.id === a.id);
      if (index < 0) return state;
      return { ...state, items: state.items.filter((m) => m.id !== a.id), gone: { item: state.items[index], index } };
    }
    case "undo": {
      if (!state.gone) return state;
      const items = [...state.items];
      items.splice(Math.min(state.gone.index, items.length), 0, state.gone.item);
      return { ...state, items, gone: null };
    }
    case "toggle": return { ...state, enabled: !state.enabled };
  }
}

/** Memories for one topic (or all), pinned first, otherwise in their own order (nothing moves under the pointer). */
export function shown(items: Memory[], topic: string) {
  return items
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => topic === "all" || m.topic === topic)
    .sort((a, b) => Number(!!b.m.pinned) - Number(!!a.m.pinned) || a.i - b.i)
    .map(({ m }) => m);
}
