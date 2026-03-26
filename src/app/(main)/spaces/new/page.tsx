"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Cursor,
  Scissors,
  Square,
  ArrowsClockwise,
  ArrowUUpLeft,
  Gear,
  MagnifyingGlass,
  Image,
  FolderSimple,
  VideoCamera,
  Robot,
  FilmStrip,
  CaretDown,
  ShareNetwork,
} from "@phosphor-icons/react";
import { ProjectFolderBreadcrumb } from "@/components/ProjectFolderBreadcrumb";
import { usePalette } from "@/contexts/PaletteContext";
import { useFolder } from "@/contexts/FolderContext";
import { AvatarWithProgress } from "@/components/AvatarWithProgress";

const nodeTypes = [
  {
    id: "stock",
    label: "Stock",
    icon: MagnifyingGlass,
    gradient: "from-amber-900/40 to-amber-800/20",
    border: "border-amber-700/30",
  },
  {
    id: "media",
    label: "Media",
    icon: FolderSimple,
    gradient: "from-slate-700/40 to-slate-600/20",
    border: "border-slate-500/30",
  },
  {
    id: "image-generator",
    label: "Image Generator",
    icon: Image,
    gradient: "from-violet-900/40 to-violet-800/20",
    border: "border-violet-600/30",
  },
  {
    id: "video-generator",
    label: "Video Generator",
    icon: VideoCamera,
    gradient: "from-cyan-900/40 to-cyan-800/20",
    border: "border-cyan-600/30",
  },
  {
    id: "assistant",
    label: "Assistant",
    icon: Robot,
    gradient: "from-emerald-900/40 to-emerald-800/20",
    border: "border-emerald-600/30",
  },
];

const sidebarTools = [
  { id: "add", icon: Plus, label: "Add node" },
  { id: "select", icon: Cursor, label: "Select" },
  { id: "cut", icon: Scissors, label: "Cut" },
  { id: "frame", icon: Square, label: "Frame" },
  { id: "undo", icon: ArrowUUpLeft, label: "Undo" },
  { id: "redo", icon: ArrowsClockwise, label: "Redo" },
  { id: "settings", icon: Gear, label: "Settings" },
];

export default function NewSpacePage() {
  const router = useRouter();
  const { surfaceColors: sc, ctaColor, ctaTextColor } = usePalette();
  const { activeProject, activeFolder } = useFolder();
  const [spaceName] = useState("Untitled Space");

  const handleNodeSelect = useCallback(
    (nodeId: string) => {
      // In a real app, this would create the space and navigate to the canvas
      // For now, navigate back to spaces
    },
    []
  );

  return (
    <main
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl"
      style={{ background: "var(--surface-modal)" }}
    >
      {/* Top header / breadcrumb */}
      <header className="flex h-[52px] shrink-0 items-center justify-between px-5">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="text-fg/60">{activeProject.name}</span>
          <span className="text-fg/30">/</span>
          <span className="font-medium text-fg/80">Spaces</span>
          <span className="text-fg/30">/</span>
          <div
            className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5"
          >
            <span
              className="size-3 shrink-0 rounded"
              style={{ background: activeProject.color }}
            />
            <span className="font-medium text-fg">{spaceName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-3 text-[13px] font-medium text-fg/80 transition-colors hover:bg-white/5"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <ShareNetwork weight="bold" size={14} />
            Share
          </button>
          <AvatarWithProgress />
        </div>
      </header>

      {/* Main area with sidebar */}
      <div className="flex min-h-0 flex-1 px-1 pb-1">
        {/* Left sidebar toolbar */}
        <div
          className="flex w-[48px] shrink-0 flex-col items-center gap-1 rounded-xl py-3"
          style={{ background: sc.panel }}
        >
          {sidebarTools.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg/50 transition-colors hover:bg-white/10 hover:text-fg/80"
              title={label}
            >
              <Icon weight="regular" size={18} />
            </button>
          ))}
        </div>

        {/* Canvas area */}
        <div
          className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl"
          style={{ background: sc.panel }}
        >
          {/* Decorative background particles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <svg
              className="absolute inset-0 size-full opacity-20"
              viewBox="0 0 800 600"
              fill="none"
            >
              <circle cx="200" cy="150" r="180" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <circle cx="600" cy="400" r="220" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <circle cx="400" cy="300" r="280" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              {/* Scattered dots */}
              {Array.from({ length: 40 }).map((_, i) => (
                <circle
                  key={i}
                  cx={100 + (i * 173) % 600}
                  cy={50 + (i * 137) % 500}
                  r={1 + (i % 3) * 0.5}
                  fill="rgba(255,255,255,0.08)"
                />
              ))}
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Title */}
            <h1 className="text-[28px] font-medium tracking-tight text-fg">
              Your space is ready
            </h1>

            {/* Choose where to save */}
            <p className="text-[18px] text-fg/60">
              Choose where you want to save this space:
            </p>

            {/* Project/Folder selector */}
            <ProjectFolderBreadcrumb />

            {/* Choose first node */}
            <p className="mt-4 text-[16px] text-fg/50">
              Choose your first node and start creating
            </p>

            {/* Node type cards */}
            <div className="mt-2 flex gap-4">
              {nodeTypes.map(({ id, label, icon: Icon, gradient, border }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNodeSelect(id)}
                  className={`group flex w-[120px] cursor-pointer flex-col items-center gap-3 rounded-xl border bg-gradient-to-b p-6 transition-all hover:scale-[1.03] hover:border-white/20 ${gradient} ${border}`}
                >
                  <Icon
                    weight="regular"
                    size={28}
                    className="text-fg/70 transition-colors group-hover:text-fg"
                  />
                  <span className="text-[13px] font-medium text-fg/80 transition-colors group-hover:text-fg">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] text-fg/40 transition-colors hover:bg-white/5 hover:text-fg/60"
            >
              <Square weight="regular" size={12} />
              Give feedback
            </button>
            <div className="flex items-center gap-1 rounded-md px-2 py-1 text-[12px] text-fg/40">
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
