"use client";
import { UploadDropZone } from "./UploadDropZone";

const MB = 1024 * 1024;

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className="dzub-demo dzub-demo--{theme}">
      <UploadDropZone accept=".pdf,.png,.jpg,.jpeg,image/*,application/pdf" maxBytes={20 * MB} theme={theme} />
    </div>
  );
}
