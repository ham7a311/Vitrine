import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "model-picker",
  "name": "Model Picker",
  "category": "ai",
  "description": "A model switcher that tells you what you're trading: each model shows two quiet meters \u2014 speed and depth \u2014 and the selection mark slides between rows while the trigger's label rolls over.",
  "tags": [
    "ai",
    "select",
    "listbox",
    "popover",
    "model",
    "dropdown"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "ModelPicker.tsx",
    "model-picker.css"
  ],
  "dependencies": [],
  "prompt": "Build a model switcher for an AI chat. The trigger is a hairline pill with the current model name and a chevron; when the model changes, the name rolls vertically in the direction you moved through the list (420ms expo-out).\n\nThe popover (16px radius, surface, soft deep shadow, opens from 0.97 scale) holds a listbox. Every option has a name (with an optional mono badge like DEFAULT or BETA), a one-line note, and two identical 5-pip meters \u2014 SPEED and DEPTH \u2014 so the list reads as a trade-off rather than a list of names; the selected row's pips turn accent and its tick draws in. A single selection mark (tinted pill with an inset accent ring) glides between rows by animating top and height (380ms), instead of rows flashing. Hover and \u2191/\u2193/Home/End move the active option; Enter/Space choose it, then the popover closes and focus returns to the trigger. Esc/Tab/outside click close. Ship paper and night themes.",
  "interaction": "Click (or \u2191/\u2193 on the trigger) to open; hover or arrow through the models; Enter or click to choose.",
  "animation": "Popover opens 320ms from 0.97; selection mark glides 380ms; tick draws 360ms; trigger label rolls 420ms in the direction of travel.",
  "a11y": "Button with aria-haspopup='listbox' and aria-expanded; the listbox uses aria-activedescendant; meters have hidden text ('Speed 4 of 5, depth 4 of 5'); focus returns to the trigger. Reduced motion removes the roll and glide.",
  "responsive": "The popover is min(21rem, 100vw \u2212 2rem) wide.",
  "variants": [
    {
      "id": "paper",
      "label": "Paper"
    },
    {
      "id": "night",
      "label": "Night"
    }
  ],
  "preview": {
    "bg": "#f5f1e8",
    "mode": "fill"
  },
  "touchFallback": "Tap to open and tap a model; rows are 60px+ tall."
};
