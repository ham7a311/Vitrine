import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "reactive-prose",
  name: "Reactive Prose",
  category: "reading",
  description: "A paragraph that is also the calculator. Drag any underlined number sideways, nudge it with the arrow keys or type over it, and every figure that depends on it is recalculated in the sentence and flashed; hover a number first to see which figures those are.",
  tags: ["explorable", "calculator", "editorial", "pricing", "what-if", "inline", "keyboard"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["ReactiveProse.tsx", "reactive-prose.css"],
  dependencies: [],
  prompt:
    "Build reactive prose in the spirit of Bret Victor's explorable explanations: a paragraph whose numbers are its controls. 'Masar's field notes go out to [120] readers today. If [40] people sign up each week and [2%] unsubscribe each month, the list passes [1,000] readers in **March 2027**, **22 weeks from now**.' Then a small line chart, then 'At [$0.04] a reader, sending to that many costs about **$40** a month.'\n\nAPI: <ReactiveProse initial={{…}} compute={(values) => outputs}> holds named numeric inputs and derives every output from one pure function; <Scrub name min max step format label /> is an input placed in the text; <Out name label format /> prints an output; <Trend name target caption /> draws a numeric series as a sparkline with an optional dashed target line (a number or an output's name). If compute throws, the last good outputs stay and the offending input turns red.\n\nType: Newsreader at 18–21px with 1.7 line height on warm paper, a 14px-radius panel with a hairline border, a 1.6em heading. Inputs are set in semibold ink-blue with a 2px dotted underline and tabular numbers, sized to their text; hovering or dragging tints them faintly. While dragging, a small tick ruler (6px spacing, a centre notch, faded at both ends) appears above the number and slides as the value changes. Outputs are semibold ink. When an output changes, a pale highlighter sweeps under it left to right and fades. Hovering or focusing an input underlines, in blue, exactly the outputs that depend on it (found by running compute with that input nudged and comparing), and outlines the chart if the chart depends on it. The model should surface something you'd only discover by playing: here, above about 4% monthly unsubscribes the date becomes 'never' and the timing reads 'it levels off near 4,345'.",
  interaction:
    "Drag horizontally on a number (6px per step); a press without movement focuses it for typing instead. ↑/↓ change by one step, Shift by ten; typing then Enter commits (non-numeric characters are ignored), Escape reverts, blur commits. Values clamp to min/max and snap to the step. Intermediate drag values update the text live; one announcement is made when the drag ends.",
  animation:
    "The highlighter sweep runs 900ms (filling over the first third) with cubic-bezier(.2,.8,.2,1); the ruler fades and rises 4px over 140ms; tints and dependency underlines fade over 140–160ms. Reduced motion or motion={false} keeps the values updating but removes the sweep and ruler movement.",
  a11y:
    "Every number is a real text input with a spoken label ('new sign-ups per week') and a description of how to change it; outputs are output elements. After a drag or a committed edit, a polite live region reads the labelled outputs that changed ('Passes the target May 2027, Timing 31 weeks from now'). Invalid input sets aria-invalid.",
  responsive: "Padding and type size scale with the viewport; inputs never wrap internally, and the chart stretches to the column width.",
  touchFallback: "Drag sideways with a finger (the number blocks scrolling only while it's being dragged); tap to type with the decimal keypad.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#e9e3d6", mode: "page", frame: [1000, 760] },
  isNew: true,
};
