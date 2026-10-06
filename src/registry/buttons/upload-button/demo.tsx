"use client";
import { UploadButton } from "./UploadButton";

const LOOKS = ["button", "drop", "avatar"] as const;
const MB = 1024 * 1024;

export default function Demo({ variant = "button" }: { variant?: string }) {
  const look = (LOOKS as readonly string[]).includes(variant) ? (variant as (typeof LOOKS)[number]) : "button";
  const props = look === "avatar"
    ? { look, accept: "image/*", maxBytes: 8 * MB, hint: "JPG or PNG, up to 8 MB" }
    : { look, accept: ".pdf,.png,.jpg,.jpeg,image/*,application/pdf", maxBytes: 20 * MB };
  return (
    <div className="upl-demo">
      <div className="upl-demo__panel upl-demo__panel--light"><UploadButton {...props} /></div>
      <div className="upl-demo__panel upl-demo__panel--dark"><UploadButton {...props} theme="dark" /></div>
    </div>
  );
}
