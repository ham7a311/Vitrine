/* Plan Gate — the plan, its risk rules and the replanning that follows a denial. Pure; no React. */

export type Risk = "read" | "write" | "external" | "irreversible";
export type Gate = "auto" | "ask" | "skip";
export type Status = "queued" | "running" | "waiting" | "done" | "skipped" | "failed" | "handed";

export type Preview =
  | { kind: "command"; text: string }
  | { kind: "diff"; file: string; lines: { op: "-" | "+" | " "; text: string }[] }
  | { kind: "message"; to: string; text: string };

export type Step = {
  id: string;
  title: string;
  tool: string;
  risk: Risk;
  gate: Gate;
  preview: Preview;
  /** The first attempt fails, to show retry. */
  flaky?: boolean;
  /** Set when a replan added this step. */
  added?: boolean;
  /** Set when a replan removed this step; it stays visible, struck through. */
  removed?: boolean;
};

export type Outcome = {
  status: Status;
  /** How the step got through its gate, for the receipt. */
  by?: "auto" | "approved" | "edited" | "you" | "skipped" | "denied";
  note?: string;
  attempts?: number;
};

export const RISK_LABEL: Record<Risk, string> = {
  read: "Read",
  write: "Write",
  external: "External",
  irreversible: "Irreversible",
};

export const RISK_HINT: Record<Risk, string> = {
  read: "Only looks; changes nothing.",
  write: "Changes files in the repository.",
  external: "Talks to a service outside the repository.",
  irreversible: "Can't be undone once it runs.",
};

/** Irreversible steps can never run unattended. */
export const gatesFor = (r: Risk): Gate[] => (r === "irreversible" ? ["ask", "skip"] : ["auto", "ask", "skip"]);

export const defaultGate = (r: Risk): Gate => (r === "read" ? "auto" : "ask");

export const TASK = "Rotate the staging payments key and tell the team";

export const PLAN: Step[] = [
  {
    id: "find",
    title: "Find every service that reads the payments key",
    tool: "search",
    risk: "read",
    gate: "auto",
    preview: { kind: "command", text: 'rg -l "PAY_KEY" services/' },
  },
  {
    id: "create",
    title: "Create a new staging key in the vault",
    tool: "vault.create",
    risk: "external",
    gate: "ask",
    preview: { kind: "command", text: "vault create pay/staging --ttl 90d --label rotation-2026-10" },
  },
  {
    id: "env",
    title: "Point the payments service at the new key",
    tool: "edit",
    risk: "write",
    gate: "ask",
    preview: {
      kind: "diff",
      file: "services/payments/.env.staging",
      lines: [
        { op: " ", text: "PAY_REGION=eu-west" },
        { op: "-", text: "PAY_KEY=sk_stg_••••41c2" },
        { op: "+", text: "PAY_KEY=vault://pay/staging" },
        { op: " ", text: "PAY_TIMEOUT_MS=8000" },
      ],
    },
  },
  {
    id: "test",
    title: "Run the payments test suite",
    tool: "test",
    risk: "read",
    gate: "auto",
    flaky: true,
    preview: { kind: "command", text: "npm test -- services/payments" },
  },
  {
    id: "revoke",
    title: "Revoke the old key",
    tool: "vault.revoke",
    risk: "irreversible",
    gate: "ask",
    preview: { kind: "command", text: "vault revoke pay/staging@41c2 --now" },
  },
  {
    id: "post",
    title: "Tell the team in #deploys",
    tool: "chat.post",
    risk: "external",
    gate: "ask",
    preview: {
      kind: "message",
      to: "#deploys",
      text: "Rotated the staging payments key. Services now read it from the vault; the old key is revoked.",
    },
  },
];

/* What the agent proposes instead when you deny a step. Steps without an entry are just dropped. */
const INSTEAD: Record<string, Step> = {
  revoke: {
    id: "revoke-later",
    title: "Schedule the old key to be revoked in 24 hours",
    tool: "vault.revoke",
    risk: "external",
    gate: "ask",
    added: true,
    preview: { kind: "command", text: "vault revoke pay/staging@41c2 --at +24h" },
  },
  post: {
    id: "post-draft",
    title: "Leave the #deploys note as a draft for you",
    tool: "chat.draft",
    risk: "write",
    gate: "auto",
    added: true,
    preview: { kind: "message", to: "#deploys (draft)", text: "Rotated the staging payments key. Services now read it from the vault." },
  },
  create: {
    id: "create-ask",
    title: "Ask who should create the key, then wait",
    tool: "ask",
    risk: "read",
    gate: "auto",
    added: true,
    preview: { kind: "message", to: "you", text: "Who should create the new staging key?" },
  },
};

/**
 * Replanning after a denial: the denied step stays in place, struck through, with its replacement
 * (if the agent has one) right after it. Later steps that depended on wording are rewritten too.
 */
export function replan(steps: Step[], deniedId: string): Step[] {
  const out: Step[] = [];
  for (const s of steps) {
    if (s.id === deniedId) {
      out.push({ ...s, removed: true });
      const alt = INSTEAD[s.id];
      if (alt && !steps.some((x) => x.id === alt.id)) out.push(alt);
      continue;
    }
    // The team note shouldn't claim the key is revoked if it isn't.
    if (deniedId === "revoke" && s.preview.kind === "message" && !s.removed) {
      out.push({ ...s, preview: { ...s.preview, text: s.preview.text.replace("the old key is revoked", "the old key will be revoked in 24 hours") } });
      continue;
    }
    out.push(s);
  }
  return out;
}

/** Steps that still count: not removed by a replan and not set to skip. */
export const live = (s: Step) => !s.removed && s.gate !== "skip";

export function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = list.slice();
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

export const previewText = (p: Preview) =>
  p.kind === "command" ? p.text : p.kind === "message" ? p.text : p.lines.map((l) => `${l.op} ${l.text}`).join("\n");
