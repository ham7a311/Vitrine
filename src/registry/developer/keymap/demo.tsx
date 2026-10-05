"use client";
import { Keymap, type Shortcut } from "./Keymap";

const SHORTCUTS: Shortcut[] = [
  { keys: "Mod+B", action: "Bold", group: "Text" },
  { keys: "Mod+I", action: "Italic", group: "Text" },
  { keys: "Mod+U", action: "Underline", group: "Text" },
  { keys: "Mod+Shift+X", action: "Strikethrough", group: "Text" },
  { keys: "Mod+E", action: "Inline code", group: "Text" },
  { keys: "Mod+K", action: "Insert link", group: "Insert" },
  { keys: "Mod+Shift+I", action: "Insert image", group: "Insert" },
  { keys: "Mod+Shift+T", action: "Insert table", group: "Insert" },
  { keys: "Mod+Alt+1", action: "Heading 1", group: "Blocks" },
  { keys: "Mod+Alt+2", action: "Heading 2", group: "Blocks" },
  { keys: "Mod+Alt+3", action: "Heading 3", group: "Blocks" },
  { keys: "Mod+Shift+7", action: "Numbered list", group: "Blocks" },
  { keys: "Mod+Shift+8", action: "Bulleted list", group: "Blocks" },
  { keys: "Mod+Shift+9", action: "Checklist", group: "Blocks" },
  { keys: "Mod+K", action: "Command menu", group: "Navigate" },
  { keys: "Mod+P", action: "Jump to document", group: "Navigate" },
  { keys: "Mod+[", action: "Back", group: "Navigate" },
  { keys: "Mod+]", action: "Forward", group: "Navigate" },
  { keys: "Mod+\\", action: "Toggle sidebar", group: "Navigate" },
  { keys: "Mod+/", action: "Show shortcuts", group: "Navigate" },
  { keys: "Mod+Z", action: "Undo", group: "Edit" },
  { keys: "Mod+Shift+Z", action: "Redo", group: "Edit" },
  { keys: "Mod+D", action: "Duplicate block", group: "Edit" },
  { keys: "Mod+Alt+M", action: "Add comment", group: "Edit" },
  { keys: "Alt+ArrowUp", action: "Move block up", group: "Edit" },
  { keys: "Alt+ArrowDown", action: "Move block down", group: "Edit" },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${dark ? "bg-[#0c0d0e]" : "bg-[#e6e6e2]"}`}>
      <div className="w-full max-w-[60rem]">
        <Keymap title="Qalam shortcuts" shortcuts={SHORTCUTS} platform="mac" theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
