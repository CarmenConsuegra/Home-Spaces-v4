"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(
  () => import("@/components/Sidebar").then((m) => ({ default: m.Sidebar })),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-0 shrink-0 overflow-hidden rounded-2xl"
        style={{ background: "#181818", width: "64px" }}
      />
    ),
  }
);

export function SidebarWrapper() {
  return <Sidebar />;
}
