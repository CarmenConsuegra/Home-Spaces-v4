"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback, type DragEvent as ReactDragEvent } from "react";
import { createPortal } from "react-dom";
import {
  Stack,
  Users,
  CaretDown,
  FolderSimple,
  Plus,
  Heart,
  UploadSimple,
  Trash,
  GridFour,
  LockSimple,
  ArrowRight,
  Check,
  X,
  DotsThree,
  Sparkle,
  DownloadSimple,
  ShareNetwork,
  Gear,
  FolderPlus,
} from "@phosphor-icons/react";
import { Tooltip } from "@/components/Tooltip";
import { useFolder, type Folder, type Project } from "@/contexts/FolderContext";
import { useNewProjectModal } from "@/contexts/NewProjectModalContext";
import { BusinessUpgradeModal } from "@/components/BusinessUpgradeModal";

// ── Project context menu ──────────────────────────────────────────────────────

type ProjectMenuType = "personal" | "private" | "shared-by-me" | "shared-with-me";

function getProjectMenuType(project: Project): ProjectMenuType {
  if (project.name === "Personal") return "personal";
  if (project.isTeam && project.owner === "Alvaro Castañeda") return "shared-by-me";
  if (project.isTeam) return "shared-with-me";
  return "private";
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  danger?: boolean;
}

function getMenuItems(type: ProjectMenuType): MenuItem[] {
  const base: MenuItem[] = [
    { id: "new-folder", label: "New Folder", icon: FolderPlus },
    { id: "generate", label: "Generate in project", icon: Sparkle },
  ];

  if (type === "personal") {
    return [...base, { id: "settings", label: "Settings", icon: Gear }];
  }

  // private, shared-by-me, shared-with-me all get export + share
  const extended: MenuItem[] = [
    ...base,
    { id: "export-metadata", label: "Export Metadata", icon: DownloadSimple },
    { id: "share", label: "Share", icon: ShareNetwork },
    { id: "settings", label: "Settings", icon: Gear },
  ];

  if (type === "shared-with-me") {
    return extended; // no delete for projects shared with me
  }

  return [...extended, { id: "delete", label: "Delete project", icon: Trash, danger: true }];
}

function ProjectContextMenu({
  project,
  anchorRect,
  onClose,
  onNewFolder,
}: {
  project: Project;
  anchorRect: { top: number; left: number };
  onClose: () => void;
  onNewFolder: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const menuType = getProjectMenuType(project);
  const items = getMenuItems(menuType);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleItemClick = (id: string) => {
    if (id === "new-folder") onNewFolder();
    onClose();
  };

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] flex w-[210px] flex-col overflow-hidden rounded-xl border p-2 shadow-lg"
      style={{
        top: anchorRect.top,
        left: anchorRect.left,
        background: "var(--surface-modal)",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => handleItemClick(item.id)}
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

const iconBtn = "size-7";

// Inline new-folder input (same pattern as ProjectFolderBreadcrumb)
function NewFolderInput({
  depth,
  onConfirm,
  onCancel,
}: {
  depth: number;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState("Untitled");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 10);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); onConfirm(value); }
    else if (e.key === "Escape") { e.preventDefault(); onCancel(); }
  };

  return (
    <div
      className="flex w-full items-center gap-1.5 rounded-lg bg-white/5 py-1 pr-1.5 text-[13px]"
      style={{ paddingLeft: `${12 + depth * 16}px` }}
    >
      <FolderSimple weight="regular" size={14} className="shrink-0 opacity-50" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => onConfirm(value)}
        className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
        style={{ color: "var(--surface-foreground-0)" }}
        placeholder="Folder name"
      />
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onConfirm(value); }}
        className="flex size-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-white/10"
        style={{ color: "var(--surface-foreground-2)" }}
      >
        <Check weight="bold" size={11} />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onCancel(); }}
        className="flex size-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-white/10"
        style={{ color: "var(--surface-foreground-2)" }}
      >
        <X weight="bold" size={10} />
      </button>
    </div>
  );
}

const MAX_SIDEBAR_DEPTH = 2;

function FolderItem({
  folder,
  project,
  projectName,
  parentPath,
  depth,
  expandedFolders,
  toggleFolder,
  creatingSubfolderAt,
  onStartCreate,
  onConfirmCreate,
  onCancelCreate,
  onDropAsset,
}: {
  folder: Folder;
  project: { name: string; color: string; cover?: string; folders: Folder[]; isTeam?: boolean; isPrivate?: boolean };
  projectName: string;
  parentPath: string;
  depth: number;
  expandedFolders: Record<string, boolean>;
  toggleFolder: (key: string) => void;
  creatingSubfolderAt: string | null;
  onStartCreate: (key: string) => void;
  onConfirmCreate: (projectName: string, parentPath: string | null, name: string) => void;
  onCancelCreate: () => void;
  onDropAsset: (assetId: string, toProject: string, toFolder: string) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);

  const folderPath = parentPath ? `${parentPath}/${folder.name}` : folder.name;
  const fullKey = `${projectName}/${folderPath}`;
  const hasChildren = folder.children && folder.children.length > 0;
  const isExpanded = expandedFolders[fullKey];
  const atMaxDepth = depth >= MAX_SIDEBAR_DEPTH;

  const urlFolder = searchParams.get("folder") || "";
  const projectSlug = project.name.toLowerCase().replace(/\s+/g, "-");
  const isOnThisProject = pathname === `/projects/${projectSlug}`;
  const isHighlighted = isOnThisProject && urlFolder === folder.name;

  const folderHref = `/projects/${projectSlug}?folder=${encodeURIComponent(folder.name)}`;
  const isCreatingHere = creatingSubfolderAt === fullKey;

  const indentPx = 12 + depth * 14;

  const handleDragOver = (e: ReactDragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: ReactDragEvent) => {
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: ReactDragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      onDropAsset(data.assetId, projectName, folder.name);
    } catch { /* ignore */ }
  };

  return (
    <li>
      <div
        className={`group flex h-8 w-full items-center gap-2 rounded-lg pr-2 text-left text-[12px] font-medium transition-colors ${isDragOver ? "ring-1 ring-blue-500/60" : ""}`}
        style={{
          paddingLeft: `${indentPx}px`,
          color: "var(--surface-foreground-0)",
          background: isDragOver ? "rgba(59,130,246,0.15)" : isHighlighted ? "var(--selected)" : "transparent",
        }}
        onMouseEnter={(e) => {
          if (!isHighlighted && !isDragOver) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isHighlighted ? "var(--selected)" : "transparent";
          setIsDragOver(false);
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Expand/navigate toggle */}
        {hasChildren && !atMaxDepth ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFolder(fullKey); }}
            className="flex shrink-0 cursor-pointer items-center justify-center rounded transition-colors -ml-1"
            style={{ padding: 0 }}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <CaretDown
              weight="bold"
              size={14}
              className={`shrink-0 opacity-50 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`}
              style={{ transition: "transform 0.2s" }}
            />
          </button>
        ) : hasChildren && atMaxDepth ? (
          <Link
            href={`/projects/${projectSlug}`}
            draggable={false}
            className="flex shrink-0 cursor-pointer items-center justify-center rounded transition-colors -ml-1 opacity-40 hover:opacity-80"
            aria-label="Open in project view"
          >
            <ArrowRight weight="bold" size={12} />
          </Link>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {/* Folder link */}
        <Link
          href={folderHref}
          draggable={false}
          onClick={(e) => { e.preventDefault(); router.push(folderHref); }}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 py-1 pr-1"
        >
          <FolderSimple weight="fill" size={14} className="shrink-0 opacity-50" />
          <span className="min-w-0 flex-1 truncate">{folder.name}</span>
        </Link>

        {/* Add subfolder on hover — only when not at max depth */}
        {!atMaxDepth && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onStartCreate(fullKey); }}
            className="shrink-0 opacity-0 transition-opacity group-hover:opacity-40 hover:!opacity-100"
            aria-label="New subfolder"
          >
            <Plus weight="bold" size={12} />
          </button>
        )}
      </div>

      {/* Inline new-folder input */}
      {isCreatingHere && (
        <NewFolderInput
          depth={depth + 1}
          onConfirm={(name) => {
            const parts = fullKey.split("/");
            const proj = parts[0];
            const parent = parts.length > 1 ? parts.slice(1).join("/") : null;
            onConfirmCreate(proj, parent, name);
          }}
          onCancel={onCancelCreate}
        />
      )}

      {/* Children — only when not at max depth */}
      {hasChildren && isExpanded && !atMaxDepth && (
        <ul className="ml-2 mt-0.5 border-l pb-0.5" style={{ borderColor: "transparent" }}>
          {folder.children!.map((child) => (
            <FolderItem
              key={child.name}
              folder={child}
              project={project}
              projectName={projectName}
              parentPath={folderPath}
              depth={depth + 1}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              creatingSubfolderAt={creatingSubfolderAt}
              onStartCreate={onStartCreate}
              onConfirmCreate={onConfirmCreate}
              onCancelCreate={onCancelCreate}
              onDropAsset={onDropAsset}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function ProjectRow({
  project,
  projectSlug,
  isProjectHighlighted,
  isExpanded,
  isCreatingRootFolder,
  toggleProject,
  openContextMenu,
  contextMenu,
  expandedFolders,
  toggleFolder,
  creatingFolderAt,
  handleStartCreate,
  handleConfirmCreate,
  handleCancelCreate,
  handleDropAsset,
  handleDropSpace,
  onUpgradeClick,
}: {
  project: Project;
  projectSlug: string;
  isProjectHighlighted: boolean;
  isExpanded: boolean;
  isCreatingRootFolder: boolean;
  toggleProject: (name: string) => void;
  openContextMenu: (project: Project, btn: HTMLButtonElement) => void;
  contextMenu: { project: Project; rect: { top: number; left: number } } | null;
  expandedFolders: Record<string, boolean>;
  toggleFolder: (key: string) => void;
  creatingFolderAt: string | null;
  handleStartCreate: (key: string) => void;
  handleConfirmCreate: (projectName: string, parentPath: string | null, name: string) => void;
  handleCancelCreate: () => void;
  handleDropAsset: (assetId: string, toProject: string, toFolder: string) => void;
  handleDropSpace: (spaceId: string, toProject: string) => void;
  onUpgradeClick?: () => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: ReactDragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: ReactDragEvent) => {
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: ReactDragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === "space") {
        handleDropSpace(data.spaceId, project.name);
      } else {
        handleDropAsset(data.assetId, project.name, "");
      }
    } catch { /* ignore */ }
  };

  return (
    <li key={project.name}>
      <div
        className={`group flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg pl-1 pr-1 text-left text-[12px] font-medium transition-colors ${isDragOver ? "ring-1 ring-blue-500/60" : ""}`}
        style={{
          color: "var(--surface-foreground-0)",
          background: isDragOver ? "rgba(59,130,246,0.15)" : isProjectHighlighted ? "var(--selected)" : "transparent",
        }}
        onMouseEnter={(e) => {
          if (!isProjectHighlighted && !isDragOver) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isProjectHighlighted ? "var(--selected)" : "transparent";
          setIsDragOver(false);
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleProject(project.name); }}
          className="flex shrink-0 cursor-pointer items-center justify-center rounded transition-colors -ml-1"
          style={{ padding: 0 }}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          <CaretDown
            weight="bold"
            size={14}
            className={`shrink-0 opacity-50 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`}
            style={{ transition: "transform 0.2s" }}
          />
        </button>
        <Link
          href={`/projects/${projectSlug}`}
          draggable={false}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg py-1 pr-1 text-left"
          style={{ color: "inherit" }}
          onClick={project.isTeam ? (e) => { e.preventDefault(); onUpgradeClick?.(); } : undefined}
        >
          {project.cover ? (
            <div className="size-3.5 shrink-0 overflow-hidden rounded" style={{ borderRadius: "4px" }}>
              <Image src={project.cover} alt={project.name} width={14} height={14} unoptimized draggable={false} className="size-full object-cover" />
            </div>
          ) : (
            <span className="size-3.5 shrink-0 rounded" style={{ background: project.color, borderRadius: "4px" }} />
          )}
          <span className="min-w-0 flex-1 truncate">{project.name}</span>
          {project.isPrivate && <LockSimple weight="bold" size={12} className="shrink-0 opacity-40" />}
          {project.teamMembers && project.teamMembers.length > 0 && (
            <Users weight="fill" size={14} className="shrink-0 text-fg/40" />
          )}
        </Link>
        {/* Context menu trigger on hover */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openContextMenu(project, e.currentTarget); }}
          className="flex shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-50 hover:!opacity-100 size-4"
          style={{ background: contextMenu?.project.name === project.name ? "rgba(255,255,255,0.1)" : undefined }}
          aria-label="Project options"
        >
          <DotsThree weight="bold" size={14} />
        </button>
      </div>

      <div
        className={isExpanded ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"}
        style={{
          maxHeight: isExpanded ? 800 : 0,
          opacity: isExpanded ? 1 : 0,
          transition: `max-height 0.2s ${isExpanded ? "ease-in-out" : "ease-out"}, opacity 0.2s`,
        }}
      >
        <ul className="ml-2 mt-0.5 border-l pb-0.5" style={{ borderColor: "transparent" }}>
          {project.folders.map((folder) => (
            <FolderItem
              key={folder.name}
              folder={folder}
              project={project}
              projectName={project.name}
              parentPath=""
              depth={0}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              creatingSubfolderAt={creatingFolderAt}
              onStartCreate={handleStartCreate}
              onConfirmCreate={handleConfirmCreate}
              onCancelCreate={handleCancelCreate}
              onDropAsset={handleDropAsset}
            />
          ))}
          {isCreatingRootFolder && (
            <NewFolderInput
              depth={0}
              onConfirm={(name) => handleConfirmCreate(project.name, null, name)}
              onCancel={handleCancelCreate}
            />
          )}
        </ul>
      </div>
    </li>
  );
}

export function ProjectsPanel() {
  const pathname = usePathname();
  const { projects, addFolder, moveAsset, moveSpace } = useFolder();
  const newProjectModal = useNewProjectModal();
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [creatingFolderAt, setCreatingFolderAt] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ project: Project; rect: { top: number; left: number } } | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const openContextMenu = useCallback((project: Project, btnEl: HTMLButtonElement) => {
    const r = btnEl.getBoundingClientRect();
    setContextMenu({ project, rect: { top: r.bottom + 4, left: r.left } });
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const toggleProject = (name: string) => {
    setExpandedProjects((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleFolder = (key: string) => {
    setExpandedFolders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartCreate = (key: string) => {
    // Expand the folder so the input appears inside it
    setExpandedFolders((prev) => ({ ...prev, [key]: true }));
    setCreatingFolderAt(key);
  };

  const handleConfirmCreate = (projectName: string, parentPath: string | null, name: string) => {
    if (name.trim()) addFolder(projectName, parentPath, name.trim());
    setCreatingFolderAt(null);
  };

  const handleCancelCreate = () => setCreatingFolderAt(null);

  const handleDropAsset = useCallback((assetId: string, toProject: string, toFolder: string) => {
    moveAsset(assetId, toProject, toFolder);
  }, [moveAsset]);

  const handleDropSpace = useCallback((spaceId: string, toProject: string) => {
    moveSpace(spaceId, toProject);
  }, [moveSpace]);

  // Start creating a root folder for a project
  const handleStartProjectFolder = (projectName: string) => {
    setExpandedProjects((prev) => ({ ...prev, [projectName]: true }));
    setCreatingFolderAt(`__root__${projectName}`);
  };

  const renderProjectList = (list: typeof projects) =>
    list.map((project) => {
      const projectSlug = project.name.toLowerCase().replace(/\s+/g, "-");
      const isProjectHighlighted = pathname === `/projects/${projectSlug}`;
      const isExpanded = expandedProjects[project.name];
      const isCreatingRootFolder = creatingFolderAt === `__root__${project.name}`;

      return (
        <ProjectRow
          key={project.name}
          project={project}
          projectSlug={projectSlug}
          isProjectHighlighted={isProjectHighlighted}
          isExpanded={!!isExpanded}
          isCreatingRootFolder={isCreatingRootFolder}
          toggleProject={toggleProject}
          openContextMenu={openContextMenu}
          contextMenu={contextMenu}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
          creatingFolderAt={creatingFolderAt}
          handleStartCreate={handleStartCreate}
          handleConfirmCreate={handleConfirmCreate}
          handleCancelCreate={handleCancelCreate}
          handleDropAsset={handleDropAsset}
          handleDropSpace={handleDropSpace}
          onUpgradeClick={() => setUpgradeModalOpen(true)}
        />
      );
    });

  return (
    <>
      {/* Quick links */}
      <div className="px-2 pt-1">
        {[
          { href: "/projects/all-projects", label: "All projects", icon: GridFour },
          { href: "/projects/all-assets", label: "All assets", icon: Stack },
          { href: "/projects/uploads", label: "Uploads", icon: UploadSimple },
          { href: "/projects/favorites", label: "Favorites", icon: Heart },
          { href: "/projects/trash", label: "Trash", icon: Trash },
        ].map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[12px] font-medium transition-colors"
              style={{
                background: isActive ? "var(--selected)" : "transparent",
                color: isActive ? "var(--surface-foreground-0)" : "#aaa",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? "var(--selected)" : "transparent"; }}
            >
              <Icon weight="regular" size={14} className="shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Separator */}
      <div className="mx-4 my-1 h-px" style={{ background: "var(--surface-border-alpha-1)" }} />

      {/* PROJECTS header */}
      <div className="px-2">
        <div className="flex h-9 items-center justify-between pl-4 pr-0">
          <span
            className="text-[10px] font-medium uppercase tracking-[0.2px]"
            style={{ color: "#737373" }}
          >
            Projects
          </span>
          <Tooltip content="New project" side="left">
            <button
              type="button"
              onClick={() => newProjectModal?.open()}
              className={`flex shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/10 ${iconBtn}`}
              style={{ color: "var(--surface-foreground-0)" }}
              aria-label="Add project"
            >
              <Plus weight="bold" size={14} className="shrink-0" />
            </button>
          </Tooltip>
        </div>

        {/* All projects — single unified list */}
        <ul className="space-y-0.5">{renderProjectList(projects)}</ul>
      </div>

      {/* Context menu portal */}
      {contextMenu && (
        <ProjectContextMenu
          project={contextMenu.project}
          anchorRect={contextMenu.rect}
          onClose={closeContextMenu}
          onNewFolder={() => handleStartProjectFolder(contextMenu.project.name)}
        />
      )}

      <BusinessUpgradeModal isOpen={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
    </>
  );
}
