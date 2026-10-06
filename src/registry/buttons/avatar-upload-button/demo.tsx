"use client";
import { AvatarUpload } from "./AvatarUpload";

const MB = 1024 * 1024;

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className="avub-demo avub-demo--{theme}">
      <AvatarUpload accept="image/*" maxBytes={8 * MB} hint="JPG or PNG, up to 8 MB" theme={theme} />
    </div>
  );
}
