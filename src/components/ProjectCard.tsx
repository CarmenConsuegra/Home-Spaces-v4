"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  PushPin,
  DotsThree,
  Plus,
  Users,
  FolderPlus,
  Sparkle,
  DownloadSimple,
  ShareNetwork,
  Gear,
  Trash,
} from "@phosphor-icons/react";
import { useFolder, type Project } from "@/contexts/FolderContext";

// ── Context menu for project cards ────────────────────────────────────────
type ProjectMenuType = "personal" | "private" | "shared-by-me" | "shared-with-me";

function getMenuType(project: Project): ProjectMenuType {
  if (project.name === "Personal") return "personal";
  if (project.isTeam && project.owner === "Alvaro Castañeda") return "shared-by-me";
  if (project.isTeam) return "shared-with-me";
  return "private";
}

interface MItem { id: string; label: string; icon: React.ElementType; danger?: boolean }

function getItems(type: ProjectMenuType): MItem[] {
  const base: MItem[] = [
    { id: "new-folder", label: "New Folder", icon: FolderPlus },
    { id: "generate", label: "Generate in project", icon: Sparkle },
  ];
  if (type === "personal") return [...base, { id: "settings", label: "Settings", icon: Gear }];
  const ext: MItem[] = [
    ...base,
    { id: "export-metadata", label: "Export Metadata", icon: DownloadSimple },
    { id: "share", label: "Share", icon: ShareNetwork },
    { id: "settings", label: "Settings", icon: Gear },
  ];
  if (type === "shared-with-me") return ext;
  return [...ext, { id: "delete", label: "Delete project", icon: Trash, danger: true }];
}

function CardContextMenu({ pos, items, onClose }: { pos: { top: number; left: number }; items: MItem[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const click = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", esc); };
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      className="fixed z-[9999] flex w-[210px] flex-col overflow-hidden rounded-xl border p-2 shadow-lg"
      style={{ top: pos.top, left: pos.left, background: "var(--surface-modal)", borderColor: "rgba(255,255,255,0.05)" }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onClose()}
          className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-2 text-left text-[12px] transition-colors hover:bg-white/5"
          style={{ color: item.danger ? "#ef4444" : "var(--surface-foreground-0)" }}
        >
          <item.icon weight="regular" size={14} className="shrink-0 opacity-70" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>,
    document.body,
  );
}

// ──────────────────────────────────────────────────────────────────────────

interface ProjectCardProps {
  id: string;
  title: string;
  cover: string;
  editedAt: string;
  isPrivate: boolean;
  isPinned?: boolean;
  collaborators?: { name: string; avatar?: string; color?: string }[];
}

export function ProjectCard({
  id,
  title,
  cover,
  editedAt,
  isPrivate,
  isPinned = false,
  collaborators = [],
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { projects } = useFolder();
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  // Find the project data to determine menu type
  const project = projects.find((p) => p.name.toLowerCase().replace(/\s+/g, "-") === id);
  const menuItems = project ? getItems(getMenuType(project)) : [];

  const closeMenu = useCallback(() => setMenuPos(null), []);

  return (
    <Link
      href={`/projects/${id}`}
      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image */}
      <Image
        src={cover}
        alt={title}
        fill
        unoptimized
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Top icons - Lock and Pin */}
      <div className="absolute left-3 top-3 flex items-center gap-1.5">
        {isPrivate ? (
          <div className="flex size-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Lock weight="fill" size={14} className="text-white" />
          </div>
        ) : (
          /* Shared - show users icon */
          <div className="flex size-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Users weight="fill" size={14} className="text-white" />
          </div>
        )}

        {/* Pin icon - shows on hover or if pinned */}
        {(isHovered || isPinned) && (
          <div
            className={`flex size-7 items-center justify-center rounded-full backdrop-blur-sm transition-opacity ${
              isPinned ? "bg-white/30" : "bg-white/20"
            }`}
          >
            <PushPin
              weight={isPinned ? "fill" : "regular"}
              size={14}
              className="text-white"
            />
          </div>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-white drop-shadow-md">
            {title}
          </h3>
          <p className="text-[12px] text-white/70">{editedAt}</p>
        </div>

        {/* Menu button */}
        <button
          type="button"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const r = e.currentTarget.getBoundingClientRect();
            setMenuPos({ top: r.bottom + 4, left: r.left });
          }}
        >
          <DotsThree weight="bold" size={16} />
        </button>
      </div>

      {/* Context menu */}
      {menuPos && menuItems.length > 0 && (
        <CardContextMenu pos={menuPos} items={menuItems} onClose={closeMenu} />
      )}
    </Link>
  );
}

export function NewProjectCard({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="group flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed transition-colors hover:border-white/30 hover:bg-white/5"
      style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)" }}
      onClick={onClick}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-white text-[#0d0d0d]">
        <Plus weight="bold" size={20} />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-medium text-white">New project</p>
        <p className="mt-0.5 text-[12px] text-white/50">
          Organize and share
          <br />
          your assets
        </p>
      </div>
    </div>
  );
}
