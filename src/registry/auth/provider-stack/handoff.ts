import type { ProviderId } from "./providers";

export type Handoff =
  | { phase: "pick"; error?: { provider: ProviderId; text: string } }
  | { phase: "waiting"; provider: ProviderId }
  | { phase: "done"; provider: ProviderId; who?: string };

export type HandoffEvent =
  | { type: "start"; provider: ProviderId }
  | { type: "cancel" }
  | { type: "fail"; text: string }
  | { type: "succeed"; who?: string };

/** The provider handoff: pick → waiting → done, or back to pick with a reason. */
export function handoff(s: Handoff, e: HandoffEvent): Handoff {
  switch (e.type) {
    case "start": return s.phase === "waiting" ? s : { phase: "waiting", provider: e.provider };
    case "cancel": return s.phase === "waiting" ? { phase: "pick" } : s;
    case "fail": return s.phase === "waiting" ? { phase: "pick", error: { provider: s.provider, text: e.text } } : s;
    case "succeed": return s.phase === "waiting" ? { phase: "done", provider: s.provider, who: e.who } : s;
  }
}
