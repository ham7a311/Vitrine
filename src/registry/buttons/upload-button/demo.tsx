"use client";
import { UploadButton } from "./UploadButton";

const MB = 1024 * 1024;

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className="upl-demo upl-demo--{theme}">
      <UploadButton accept=".pdf,.png,.jpg,.jpeg,image/*,application/pdf" maxBytes={20 * MB} theme={theme} />
    </div>
  );
}
