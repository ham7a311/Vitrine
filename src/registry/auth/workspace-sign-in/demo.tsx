"use client";

import { WorkspaceSignIn } from "./WorkspaceSignIn";

const WS = [
  { slug: "northstar", name: "Northstar", color: "#e8a24a", members: 214, sso: "Okta" },
  { slug: "halden", name: "Halden & Co.", color: "#8fe388", members: 48, sso: "Google Workspace" },
  { slug: "lumen", name: "Lumen Labs", color: "#c8b9ea", members: 1320, sso: "Microsoft Entra" },
  { slug: "gutech", name: "GUtech", color: "#7fb8ff", members: 3900, sso: "Microsoft Entra" },
];

export default function Demo() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-5 bg-[#0b080d] p-8">
      <WorkspaceSignIn workspaces={WS} />
      <p className="font-[family-name:Geist_Mono] text-[0.625rem] uppercase tracking-[0.14em] text-[#6f6a74]">try northstar, halden, lumen or gutech</p>
    </div>
  );
}
