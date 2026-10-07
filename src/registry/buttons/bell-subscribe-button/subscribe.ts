export type SubscribeState = { on: boolean; label: string; announce: string };

/** What the button says and announces for a given state. */
export function state(on: boolean, labels: { off: string; on: string } = { off: "Subscribe", on: "Subscribed" }): SubscribeState {
  return on
    ? { on, label: labels.on, announce: `${labels.on}. You'll get a note when something new is out.` }
    : { on, label: labels.off, announce: "Unsubscribed." };
}

/** The resting drop and the pressed drop, in em, so the face can travel exactly into its shadow. */
export const DROP = { x: 0.3, y: 0.4 } as const;
