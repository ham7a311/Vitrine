import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "keycap",
  "name": "Keycap",
  "category": "buttons",
  "description": "A button made like a real key: it has travel, a sculpted top and a shadowed skirt \u2014 and it presses itself when you hit the matching key on your keyboard.",
  "tags": [
    "button",
    "keyboard",
    "shortcut",
    "keycap",
    "3d",
    "kbd"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "Keycap.tsx",
    "keycap.css"
  ],
  "dependencies": [],
  "prompt": "Build a keyboard-key button. The dark 'skirt' is the button (radius 12px) with 5px of bottom padding; inside it a face (52px tall, radius 11px) with a sculpted top \u2014 a radial gradient lighter at the upper centre \u2014 plus an inner top highlight, an inner lower shade and a 1px dark edge. Pressing sinks the face 4px into the skirt in 40ms and compresses its shading (release springs back in 90ms), so it has real travel.\n\nEach keycap can declare the shortcut it represents (key plus meta/shift). A window keydown listener presses the cap visually and fires onPress when the real key combination is hit; keyup releases it. Wide caps show a label on the left and the legend (\u2318 K) on the right in mono; square caps centre the legend. Tones: graphite, bone and a frost accent.",
  "interaction": "Click it or press its real shortcut on the keyboard \u2014 either way it travels down and fires.",
  "animation": "40ms press / 90ms release on the face's translate and shading.",
  "a11y": "A real button; the shortcut is visible in the legend. Pressing the shortcut calls the same handler. Reduced motion removes the travel transition.",
  "responsive": "Intrinsic width; wide caps have a 12rem minimum.",
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Pointer down/up gives the same travel on touch."
};
