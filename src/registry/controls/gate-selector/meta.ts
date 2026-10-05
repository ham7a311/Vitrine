import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "gate-selector",
  name: "Gate Selector",
  category: "controls",
  description: "A status control cut like a gear-shift gate: from the current state, the slots you can't reach are closed by red stop plates, so the shape of the gate shows the workflow's rules. The knob travels the cut, waits at the slot's mouth while the move saves, and comes back if it fails.",
  tags: ["status", "workflow", "state machine", "select", "publishing", "physical"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["GateSelector.tsx", "gate-selector.css", "gate.ts"],
  dependencies: [],
  prompt:
    "Build a status selector for a workflow with rules (Draft → In review → Approved → Published, with Changes and Archived), drawn as the gate of a manual gear shift. The point: the allowed moves are not a hidden validation rule, they are the shape of the cut.\n\nThe plate: one SVG, an 18px-radius machined plate in flat warm grey with a 2px darker edge, a soft drop shadow and a slotted screw in each corner. Cut into it is an H-pattern: one horizontal rail and, per state, a vertical slot above or below it (three columns, 140 units apart, slots 82 units deep). The cut is a 36-unit dark stroke with round caps over a 40-unit lighter lip, so it reads as a channel. The state names are engraved past the end of each slot: 11px uppercase expanded Archivo, letter-spaced, dark with a 1px light highlight below.\n\nThe knob is a 34-unit dark ball with a thin lighter ring, resting at the end of the current state's slot. For every slot the current state can't move to, a red painted stop plate (42×10 with two screw dots) is fastened across the slot's mouth just past the rail, so the knob physically can't enter. Allowed slots are open. The current state's label turns accent blue with a short underline, blocked labels sit at half opacity, and a line under the plate reads 'From In review you can go to Approved, Changes, Draft.'\n\nMoving: drag the knob (it is projected onto the nearest point of the cut, stopping at the mouth of a closed slot) and release more than halfway into an open slot to choose it; release anywhere else and it travels back. Or click a label. A blocked choice makes the knob run to that stop plate and back, and the note turns red: 'Published: only approved work can be published.' An allowed choice makes the knob run to the slot's mouth and wait there with a dashed spinning ring while onChange saves; on success it seats in the slot and the stop plates rearrange for the new state; on failure it returns home and the note shows the error.",
  interaction:
    "Pointer drag along the cut, or click/tap a state name. The knob always travels the cut, out to the rail, along it, then into the slot, at a constant speed. onChange(next, prev) may return a promise; while it is pending, other moves are ignored. Keyboard: the state names form a radio group with one tab stop; arrows and Home/End move focus, Enter or Space attempts the move.",
  animation:
    "Knob travel is a Web Animations path through the rail corners, 140ms plus about 1ms per unit, eased cubic-bezier(.2,.8,.2,1); a blocked attempt goes to the stop plate and straight back. The pending ring spins once every 900ms. With reduced motion or motion={false} the knob jumps and the ring holds still.",
  a11y:
    "The SVG is decorative; the state names are real buttons with role='radio' in a labelled radiogroup, aria-checked on the current state and aria-disabled on blocked ones, each described by why it's blocked. The note under the plate is a polite live region that announces allowed moves, blocked reasons, progress, success and errors.",
  responsive: "The plate scales with its container from its fixed viewBox aspect ratio; engraved labels shrink down to 9px on narrow screens, and the component caps its own width at 34rem.",
  touchFallback: "Tap a state name; the knob makes the same trip. The knob itself has a 52-unit touch target for dragging.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --gsel-accent #1f4ea8; --gsel-cut #232220; --gsel-cut-lip #8e8a82; --gsel-danger #a6311f; --gsel-edge #a9a59c; --gsel-engrave #3d3a35; --gsel-engrave-hi rgb(255 255 255 / 0.55); --gsel-ink #1f1e1b; --gsel-knob #f4f1ea; --gsel-knob-ring #6b665d; --gsel-muted #5e5a52; --gsel-plate #cfccc5; --gsel-plate-line rgb(0 0 0 / 0.05); --gsel-stop #a6311f; --gsel-stop-screw #f2c4b8. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --gsel-accent #93b4ff; --gsel-cut #08090a; --gsel-cut-lip #505357; --gsel-danger #ff8c75; --gsel-edge #45474a; --gsel-engrave #d9d7d1; --gsel-engrave-hi rgb(0 0 0 / 0.6); --gsel-ink #ecebe7; --gsel-knob #e2dfd7; --gsel-knob-ring #8d8a83; --gsel-muted #a3a19b; --gsel-plate #2a2b2d; --gsel-plate-line rgb(255 255 255 / 0.03); --gsel-stop #e0634c; --gsel-stop-screw #5a1d14. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e9e6df", mode: "center", frame: [900, 600] },
  isNew: true,
};
