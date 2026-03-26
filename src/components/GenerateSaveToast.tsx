"use client";

import { useFolder } from "@/contexts/FolderContext";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

export function GenerateSaveToast({ visible }: { visible: boolean }) {
  const { activeProject, activeFolder } = useFolder();

  const projectSlug = activeProject.name.toLowerCase().replace(/\s+/g, "-");
  const href = activeFolder
    ? `/projects/${projectSlug}?folder=${encodeURIComponent(activeFolder)}`
    : `/projects/${projectSlug}`;

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium shadow-xl transition-all duration-300"
      style={{
        background: "var(--surface-modal)",
        border: "1px solid rgba(255,255,255,0.08)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <CheckCircle weight="fill" size={16} className="shrink-0 text-emerald-400" />
      <span style={{ color: "var(--surface-foreground-0)" }}>
        Saved to{" "}
        <span className="font-semibold">{activeProject.name}</span>
        {activeFolder && (
          <>
            <span className="opacity-40"> / </span>
            <span className="font-semibold">{activeFolder}</span>
          </>
        )}
      </span>
      <Link
        href={href}
        className="ml-1 flex items-center gap-1 opacity-50 transition-opacity hover:opacity-100"
        style={{ color: "var(--surface-foreground-0)" }}
      >
        View
        <ArrowRight weight="bold" size={12} />
      </Link>
    </div>
  );
}
