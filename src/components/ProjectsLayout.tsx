"use client";

import { useState, useRef, useEffect, createContext, useContext, type ReactNode, Suspense } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useFolder, type Folder, type Project } from "@/contexts/FolderContext";
import { Tooltip } from "@/components/Tooltip";
import { AssetsFilterBar } from "@/components/AssetsFilterBar";
import {
  Stack,
  CardsThree,
  Users,
  CaretDown,
  Folders,
  Plus,
  Heart,
  Image,
  VideoCamera,
  SpeakerHigh,
  Cube,
  GridFour,
  Lock,
  MagnifyingGlass,
  UploadSimple,
  DownloadSimple,
  Trash,
  DotsThree,
  ShareNetwork,
  X,
  Clock,
  Layout,
  BookBookmark,
  Waveform,
  SlidersHorizontal,
  SquaresFour,
  FolderPlus,
  Sparkle,
  Gear,
} from "@phosphor-icons/react";
import { AssistantButton } from "@/components/AssistantButton";
import { AvatarWithProgress } from "@/components/AvatarWithProgress";
import { FreepikButton } from "@/components/FreepikButton";
import { usePalette } from "@/contexts/PaletteContext";
import { useCreateModal } from "@/contexts/CreateModalContext";
import { useNewProjectModal } from "@/contexts/NewProjectModalContext";



// ── Project context menu (reused in project detail header) ─────────────────
type ProjectMenuType = "personal" | "private" | "shared-by-me" | "shared-with-me";

function getProjectMenuType(project: Project): ProjectMenuType {
  if (project.name === "Personal") return "personal";
  if (project.isTeam && project.owner === "Alvaro Castañeda") return "shared-by-me";
  if (project.isTeam) return "shared-with-me";
  return "private";
}

interface PMenuItem { id: string; label: string; icon: React.ElementType; danger?: boolean }

function getProjectMenuItems(type: ProjectMenuType): PMenuItem[] {
  const base: PMenuItem[] = [
    { id: "new-folder", label: "New Folder", icon: FolderPlus },
    { id: "generate", label: "Generate in project", icon: Sparkle },
  ];
  if (type === "personal") return [...base, { id: "settings", label: "Settings", icon: Gear }];
  const extended: PMenuItem[] = [
    ...base,
    { id: "export-metadata", label: "Export Metadata", icon: DownloadSimple },
    { id: "share", label: "Share", icon: ShareNetwork },
    { id: "settings", label: "Settings", icon: Gear },
  ];
  if (type === "shared-with-me") return extended;
  return [...extended, { id: "delete", label: "Delete project", icon: Trash, danger: true }];
}

function ProjectHeaderContextMenu({
  project,
  anchorRect,
  onClose,
}: {
  project: Project;
  anchorRect: { top: number; left: number };
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const items = getProjectMenuItems(getProjectMenuType(project));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleEsc); };
  }, [onClose]);

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] flex w-[210px] flex-col overflow-hidden rounded-xl border p-2 shadow-lg"
      style={{ top: anchorRect.top, left: anchorRect.left, background: "var(--surface-modal)", borderColor: "rgba(255,255,255,0.05)" }}
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
// ────────────────────────────────────────────────────────────────────────────

const placeholderItems = Array.from({ length: 16 }, (_, i) => ({
  id: `asset-${i}`,
}));

const iconBtn = "size-7";

const navLinks = [
  { href: "/projects/all-projects", label: "All projects", icon: CardsThree },
  { href: "/projects/all-assets", label: "All assets", icon: Stack },
  { href: "/projects/uploads", label: "Uploads", icon: UploadSimple },
  { href: "/projects/favorites", label: "Favorites", icon: Heart },
  { href: "/projects/trash", label: "Trash", icon: Trash },
];

// ─── Projects filter context (consumed by page children) ────────────────────
interface ProjectsFilterValue {
  visibilityFilter: "All" | "Shared" | "Private";
  selectedOwner: string; // "Anyone" | "Me" | "Others"
  favoritesOnly: boolean;
  activeContentType: string | null;
  projectsSearchQuery: string;
}

const ProjectsFilterCtx = createContext<ProjectsFilterValue>({
  visibilityFilter: "All",
  selectedOwner: "Anyone",
  favoritesOnly: false,
  activeContentType: null,
  projectsSearchQuery: "",
});

export function useProjectsFilter() {
  return useContext(ProjectsFilterCtx);
}
// ─────────────────────────────────────────────────────────────────────────────

export function ProjectsLayout(props: { title: string; children?: ReactNode; simpleHeader?: boolean; projectsHeader?: boolean; projectDetailHeader?: boolean; assetsHeader?: boolean; hideFavoritesFilter?: boolean }) {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><div className="text-fg/50">Loading...</div></div>}>
      <ProjectsLayoutInner {...props} />
    </Suspense>
  );
}

function ProjectsLayoutInner({ title, children, simpleHeader = false, projectsHeader = false, projectDetailHeader = false, assetsHeader = false, hideFavoritesFilter = false }: { title: string; children?: ReactNode; simpleHeader?: boolean; projectsHeader?: boolean; projectDetailHeader?: boolean; assetsHeader?: boolean; hideFavoritesFilter?: boolean }) {
  const createModal = useCreateModal();
  const newProjectModal = useNewProjectModal();
  const [visibilityFilter, setVisibilityFilter] = useState<"All" | "Shared" | "Private">("All");
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState("Anyone");
  const [selectedSort, setSelectedSort] = useState("Last edited");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { surfaceColors: sc } = usePalette();
  const { projects, selectProject } = useFolder();

  // Project context menu state for the detail header
  const [projectMenuOpen, setProjectMenuOpen] = useState<{ rect: { top: number; left: number } } | null>(null);
  const currentProject = projects.find(
    (p) => `/projects/${p.name.toLowerCase().replace(/\s+/g, "-")}` === pathname
  );

  const [expandedMyProjects, setExpandedMyProjects] = useState<Record<string, boolean>>({
    "Short film": false,
    Personal: false,
  });
  const [expandedNestedFolders, setExpandedNestedFolders] = useState<Record<string, boolean>>({});
  
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [viewLayout, setViewLayout] = useState<"Row" | "Grid">("Grid");
  const [imageSize, setImageSize] = useState<"Mini" | "Small" | "Medium" | "Large">("Medium");
  const [groupEdits, setGroupEdits] = useState<"Group" | "Ungroup">("Ungroup");
  const [viewPopoverOpen, setViewPopoverOpen] = useState(false);
  const viewBtnRef = useRef<HTMLButtonElement>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const inlineSearchRef = useRef<HTMLInputElement>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [activeContentType, setActiveContentType] = useState<string | null>(null);
  const [projectsSearchQuery, setProjectsSearchQuery] = useState("");
  const toggleContentType = (type: string) => {
    setActiveContentType((prev) => prev === type ? null : type);
  };
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
    Project: "All projects",
    Creator: "All creators",
    Type: "All",
    View: "Grid",
  });
  const filterRef = useRef<HTMLDivElement>(null);

  // Search popover state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchPopoverPos, setSearchPopoverPos] = useState<{ top: number; right: number } | null>(null);
  const [aspectRatio, setAspectRatio] = useState("Any");
  const [modelFilter, setModelFilter] = useState("Any");
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [toolFilter, setToolFilter] = useState("Any");
  const [toolSearchQuery, setToolSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateFilter, setDateFilter] = useState("Any time");
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const hasCustomFilters = dateFilter !== "Any time" || aspectRatio !== "Any" || modelFilter !== "Any" || toolFilter !== "Any";

  const openSearchPopover = () => {
    const rect = searchBtnRef.current?.getBoundingClientRect();
    if (rect) setSearchPopoverPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setSearchFocused(true);
    setViewPopoverOpen(false);
    setOpenFilter(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpenFilter(null);
        setViewPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchFocused) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!searchBtnRef.current?.contains(target) && !target.closest("[data-projects-search-popover]")) {
        setSearchFocused(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setSearchFocused(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleEsc); };
  }, [searchFocused]);

  const creators = [
    { name: "Me", initial: "J", bg: "#10b981" },
    { name: "Marcus", initial: "M", bg: "#8b5cf6" },
    { name: "Sarah", initial: "S", bg: "#0ea5e9" },
    { name: "Kim", initial: "K", bg: "#f59e0b" },
    { name: "Alex", initial: "A", bg: "#f43f5e" },
  ];

  const filterOptions: Record<string, string[]> = {
    Project: ["All projects", ...projects.map((p) => p.name)],
    Creator: ["All creators", ...creators.map((c) => c.name)],
    Type: ["All", "Image", "Video", "Audio", "3D"],
    View: ["Grid", "List", "Large grid"],
  };

  const toggleMyProject = (name: string) => {
    setExpandedMyProjects((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleNestedFolder = (key: string) => {
    setExpandedNestedFolders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Derive highlighted folder from URL
  const urlFolder = searchParams.get("folder") || "";
  
  // Auto-expand project when viewing one of its folders
  useEffect(() => {
    if (urlFolder) {
      // Find which project this folder belongs to by checking the pathname
      const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);
      if (projectMatch) {
        const projectSlug = projectMatch[1];
        // Find the project name from slug
        const matchingProject = projects.find(
          p => p.name.toLowerCase().replace(/\s+/g, "-") === projectSlug
        );
        if (matchingProject) {
          setExpandedMyProjects(prev => ({ ...prev, [matchingProject.name]: true }));
        }
      }
    }
  }, [pathname, urlFolder, projects]);
  
  const renderFolderList = (
    projectName: string,
    folderList: Folder[],
    parentPath: string
  ): ReactNode =>
    folderList.map((folder) => {
      const path = parentPath ? `${parentPath}/${folder.name}` : folder.name;
      const fullKey = `${projectName}/${path}`;
      const hasChildren = folder.children && folder.children.length > 0;
      const isExpanded = expandedNestedFolders[fullKey];
      
      // Derive highlight from URL
      const projectSlug = projectName.toLowerCase().replace(/\s+/g, "-");
      const isOnThisProject = pathname === `/projects/${projectSlug}`;
      const isHighlighted = isOnThisProject && urlFolder === folder.name;
      
      // Navigate to folder
      const handleFolderClick = () => {
        router.push(`/projects/${projectSlug}?folder=${encodeURIComponent(folder.name)}`);
      };
      
      if (!hasChildren) {
        return (
          <li key={path}>
            <button
              type="button"
              onClick={handleFolderClick}
              className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-2 text-left text-[13px] transition-colors hover:bg-fg/5"
              style={{
                color: isHighlighted ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
                ...(isHighlighted ? { background: "var(--selected)" } : {}),
              }}
            >
              <Folders weight="bold" size={14} className="shrink-0 opacity-50" />
              {folder.name}
            </button>
          </li>
        );
      }
      
      return (
        <li key={path}>
          <div
            className="flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg pl-3 pr-3 text-left text-[13px] transition-colors hover:bg-fg/5"
            style={{
              color: isHighlighted ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
              ...(isHighlighted ? { background: "var(--selected)" } : {}),
            }}
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleNestedFolder(fullKey); }}
              className="-ml-1 flex shrink-0 cursor-pointer items-center justify-center rounded transition-colors"
              style={{ padding: 0 }}
            >
              <CaretDown
                weight="bold"
                size={14}
                className={`shrink-0 opacity-50 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`}
              />
            </button>
            <button
              type="button"
              onClick={handleFolderClick}
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg py-1 pr-1 text-left"
            >
              <Folders weight="bold" size={14} className="shrink-0 opacity-50" />
              <span className="min-w-0 flex-1 truncate">{folder.name}</span>
            </button>
          </div>
          <div
            className={isExpanded ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"}
            style={{
              maxHeight: isExpanded ? 400 : 0,
              opacity: isExpanded ? 1 : 0,
              transition: "max-height 0.2s ease-out, opacity 0.2s ease-out",
            }}
          >
            <ul className="ml-2 mt-0.5 space-y-0 border-l border-transparent pl-2 pb-0.5">
              {renderFolderList(projectName, folder.children!, path)}
            </ul>
          </div>
        </li>
      );
    });

  return (
    <>
    <main
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl"
      style={{ background: "var(--surface-modal)" }}
    >
      <header className="flex h-[60px] shrink-0 items-center justify-between px-6">
        <Breadcrumb />
        <div className="flex items-center gap-3">
          <FreepikButton />
          <AssistantButton />
          <AvatarWithProgress />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-1 px-1 pb-1">
        {/* Left panel */}
        <div
          className="flex w-[260px] shrink-0 flex-col rounded-2xl py-4"
          style={{ background: sc.panel }}
        >
          {/* Fixed navigation section */}
          <div className="shrink-0">
            <ul className="space-y-0.5 px-2">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[13px] transition-colors hover:bg-fg/5"
                      style={{
                        color: isActive ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
                        ...(isActive ? { background: "var(--selected)" } : {}),
                      }}
                    >
                      <Icon weight="bold" size={14} className="shrink-0 opacity-60" />
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mx-4 mt-4 h-px bg-fg/5" />
            <div className="mt-3 flex items-center justify-between px-4 pb-1">
              <span className="text-[10px] font-medium uppercase tracking-wider text-fg-muted">
                My projects
              </span>
              <Tooltip content="New project" side="left">
                <button
                  type="button"
                  onClick={() => newProjectModal?.open()}
                  className={`flex shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-fg/10 hover:text-fg ${iconBtn}`}
                  aria-label="Add project"
                >
                  <Plus weight="bold" size={12} />
                </button>
              </Tooltip>
            </div>
          </div>
          
          {/* Scrollable projects list */}
          <div className="min-h-0 flex-1 overflow-y-auto">
          <ul className="space-y-0.5 px-2">
{projects.map((project) => {
  const { name, cover, isPrivate, folders, teamMembers } = project;
  const id = name.toLowerCase().replace(/\s+/g, "-");
  // Highlight project if we're on its page (without a folder selected)
  const isHighlighted = pathname === `/projects/${id}` && !urlFolder;
  const isExpanded = expandedMyProjects[name];
  const hasCollaborators = teamMembers && teamMembers.length > 0;
              return (
                <li key={id}>
                  <div
                    className="group/proj flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg pl-3 pr-3 text-left text-[13px] transition-colors hover:bg-fg/5"
                    style={{
                      color: isHighlighted ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
                      ...(isHighlighted ? { background: "var(--selected)" } : {}),
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleMyProject(name); }}
                      className="-ml-1 flex shrink-0 cursor-pointer items-center justify-center rounded transition-colors"
                      style={{ padding: 0 }}
                    >
                      <CaretDown
                        weight="bold"
                        size={14}
                        className={`shrink-0 opacity-50 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`}
                      />
                    </button>
                    <Link
                      href={`/projects/${id}`}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg py-1 pr-1 text-left"
                    >
  {cover ? (
    <div className="relative size-5 shrink-0 overflow-hidden rounded">
      <NextImage src={cover} alt={name} fill unoptimized className="object-cover" />
    </div>
  ) : (
    <div className="size-3 shrink-0 rounded" style={{ background: project.color }} />
  )}
                      <span className="min-w-0 flex-1 truncate">{name}</span>
                    </Link>
                    {hasCollaborators ? (
                      <Users weight="fill" size={14} className="shrink-0 text-fg/40" />
                    ) : (
                      <Lock weight="bold" size={12} className="shrink-0 opacity-0 transition-opacity group-hover/proj:opacity-30" />
                    )}
                  </div>
                  <div
                    className={isExpanded ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"}
                    style={{
                      maxHeight: isExpanded ? 400 : 0,
                      opacity: isExpanded ? 1 : 0,
                      transition: "max-height 0.2s ease-out, opacity 0.2s ease-out",
                    }}
                  >
                    <ul className="ml-2 mt-0.5 space-y-0 border-l border-transparent pl-2 pb-0.5">
                      {renderFolderList(name, folders, "")}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
          </div>
        </div>

        {/* Right content area */}
        <div
          className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto rounded-2xl px-6 py-4"
          style={{ background: sc.panel }}
        >
          <div className="flex h-8 items-center justify-between">
            <div className="flex items-center gap-5">
              <h2 className="text-lg font-normal text-fg">{title}</h2>
              {projectDetailHeader && (
                <button
                  type="button"
                  className="flex size-7 items-center justify-center rounded-md text-fg/50 transition-colors hover:bg-fg/5 hover:text-fg/70"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setProjectMenuOpen({ rect: { top: r.bottom + 4, left: r.left } });
                  }}
                >
                  <DotsThree weight="bold" size={18} />
                </button>
              )}
              {(simpleHeader || projectDetailHeader) && (
                <button
                  type="button"
                  onClick={() => { if (currentProject) selectProject(currentProject, ""); createModal?.open(); }}
                  className="flex h-8 items-center gap-2 rounded-lg px-4 text-[12px] font-medium text-fg transition-colors hover:opacity-90"
                  style={{ background: sc.button }}
                >
                  <Plus weight="bold" size={14} />
                  Start creating
                </button>
              )}
            </div>
            {simpleHeader ? (
              <div
                className="flex h-8 w-35 items-center gap-1 rounded-md px-2.5"
                style={{ background: "rgba(255,255,255,0.15)", color: "var(--surface-foreground-4, #737373)" }}
              >
                <MagnifyingGlass weight="bold" size={12} className="shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  className="min-w-0 flex-1 bg-transparent text-[12px] font-medium outline-none placeholder:text-[#737373]"
                />
              </div>
            ) : assetsHeader ? (
              <AssetsFilterBar hideFavorites={hideFavoritesFilter} />
            ) : projectDetailHeader ? (
              <div className="flex items-center gap-1.5">
                {/* Content type icon group */}
                <div className="flex items-center rounded-lg" style={{ background: sc.button }}>
                  {[
                    { icon: Image, label: "Images" },
                    { icon: VideoCamera, label: "Videos" },
                    { icon: Waveform, label: "Audio" },
                    { icon: Cube, label: "3D" },
                  ].map(({ icon: Icon, label }) => {
                    const isActive = activeContentType === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleContentType(label)}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
                        style={{ color: isActive ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)" }}
                      >
                        <Icon weight="bold" size={16} />
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
                    style={{ color: "var(--surface-foreground-2)" }}
                  >
                    <CaretDown weight="bold" size={12} />
                  </button>
                </div>

                {/* Favorites */}
                <button
                  type="button"
                  onClick={() => setFavoritesOnly(!favoritesOnly)}
                  className="flex size-8 items-center justify-center rounded-lg transition-colors"
                  style={{
                    background: favoritesOnly ? "rgba(255,255,255,0.1)" : sc.button,
                    color: favoritesOnly ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
                  }}
                >
                  <Heart weight={favoritesOnly ? "fill" : "bold"} size={16} />
                </button>

                {/* Owner dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setOwnerDropdownOpen(!ownerDropdownOpen); setSortDropdownOpen(false); }}
                    className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors hover:bg-fg/5"
                    style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
                  >
                    Owner
                    <CaretDown weight="bold" size={10} />
                  </button>
                  {ownerDropdownOpen && (
                    <div
                      className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border p-1 shadow-lg"
                      style={{ background: sc.panel, borderColor: "var(--surface-border-alpha-0)" }}
                    >
                      {["Anyone", "Me", "Others"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => { setSelectedOwner(option); setOwnerDropdownOpen(false); }}
                          className="flex w-full items-center rounded-md px-3 py-2 text-left text-[13px] transition-colors hover:bg-fg/5"
                          style={{ color: selectedOwner === option ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)" }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter icon */}
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
                  style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
                >
                  <SlidersHorizontal weight="bold" size={16} />
                </button>

                {/* Grid view icon */}
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
                  style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
                >
                  <SquaresFour weight="bold" size={16} />
                </button>

                {/* Search */}
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
                  style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
                >
                  <MagnifyingGlass weight="bold" size={16} />
                </button>
              </div>
            ) : projectsHeader ? (
              <div className="flex items-center gap-2">
                {/* All / Shared / Private toggle */}
                <div className="flex items-center rounded-lg p-0.5" style={{ background: sc.button }}>
                  {(["All", "Shared", "Private"] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setVisibilityFilter(filter)}
                      className="flex h-7 items-center justify-center rounded-md px-3 text-[13px] font-medium transition-colors"
                      style={{
                        background: visibilityFilter === filter ? "rgba(255,255,255,0.1)" : "transparent",
                        color: visibilityFilter === filter ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Owner dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setOwnerDropdownOpen(!ownerDropdownOpen); setSortDropdownOpen(false); }}
                    className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors hover:bg-fg/5"
                    style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
                  >
                    Owner
                    <CaretDown weight="bold" size={10} />
                  </button>
                  {ownerDropdownOpen && (
                    <div
                      className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border p-1 shadow-lg"
                      style={{ background: sc.panel, borderColor: "var(--surface-border-alpha-0)" }}
                    >
                      {["Anyone", "Me", "Others"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => { setSelectedOwner(option); setOwnerDropdownOpen(false); }}
                          className="flex w-full items-center rounded-md px-3 py-2 text-left text-[13px] transition-colors hover:bg-fg/5"
                          style={{ color: selectedOwner === option ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)" }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Last edited dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setSortDropdownOpen(!sortDropdownOpen); setOwnerDropdownOpen(false); }}
                    className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors hover:bg-fg/5"
                    style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
                  >
                    {selectedSort}
                    <CaretDown weight="bold" size={10} />
                  </button>
                  {sortDropdownOpen && (
                    <div
                      className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border p-1 shadow-lg"
                      style={{ background: sc.panel, borderColor: "var(--surface-border-alpha-0)" }}
                    >
                      {["Last edited", "Last created", "Name A-Z", "Name Z-A"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => { setSelectedSort(option); setSortDropdownOpen(false); }}
                          className="flex w-full items-center rounded-md px-3 py-2 text-left text-[13px] transition-colors hover:bg-fg/5"
                          style={{ color: selectedSort === option ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)" }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search */}
                <div
                  className="flex h-8 w-[140px] items-center gap-2 rounded-lg px-3"
                  style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
                >
                  <MagnifyingGlass weight="bold" size={14} className="shrink-0 opacity-60" />
                  <input
                    type="text"
                    value={projectsSearchQuery}
                    onChange={(e) => setProjectsSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="min-w-0 flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-fg/40"
                  />
                </div>
              </div>
            ) : (
            <div ref={filterRef} className="flex items-center gap-1.5">
              {/* Content type icon group */}
              <div className="flex items-center rounded-lg" style={{ background: sc.button }}>
                {[
                  { icon: Image, label: "Images" },
                  { icon: VideoCamera, label: "Videos" },
                  { icon: Waveform, label: "Audio" },
                  { icon: Cube, label: "3D" },
                ].map(({ icon: Icon, label }) => {
                  const isActive = activeContentType === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleContentType(label)}
                      className="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
                      style={{ color: isActive ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)" }}
                    >
                      <Icon weight="bold" size={16} />
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setOpenFilter(openFilter === "Type" ? null : "Type")}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
                  style={{ color: "var(--surface-foreground-2)" }}
                >
                  <CaretDown weight="bold" size={12} />
                </button>
              </div>

              {/* Individual icon buttons */}
              <button type="button" onClick={() => setFavoritesOnly(!favoritesOnly)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-fg/5" style={{ background: sc.button, color: favoritesOnly ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)" }} >
                <Heart weight={favoritesOnly ? "fill" : "bold"} size={16} />
              </button>
              <button
                type="button"
                ref={searchBtnRef}
                onClick={openSearchPopover}
                className="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
                style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
              >
                <SlidersHorizontal weight="bold" size={16} />
              </button>
              <div className="relative">
                <button
                  ref={viewBtnRef}
                  type="button"
                  onClick={() => { setViewPopoverOpen(!viewPopoverOpen); setSearchFocused(false); setOpenFilter(null); }}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
                  style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
                >
                  <GridFour weight="bold" size={16} />
                </button>
                {viewPopoverOpen && (
                  <div
                    className="absolute right-0 top-full z-50 mt-2 w-[200px] animate-[popoverIn_150ms_ease-out] rounded-xl border p-3 shadow-xl"
                    style={{ background: sc.card, borderColor: "var(--surface-border-alpha-1)" }}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="px-1 text-[10px] font-medium uppercase tracking-wide text-fg/20">Layout</span>
                        {(["Row", "Grid"] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setViewLayout(opt)}
                            className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${viewLayout === opt ? "text-fg" : "text-fg-muted hover:bg-fg/5 hover:text-fg"}`}
                          >
                            <div className={`flex size-3 items-center justify-center rounded-full border ${viewLayout === opt ? "border-fg" : "border-fg/20"}`}>
                              {viewLayout === opt && <div className="size-1.5 rounded-full bg-fg" />}
                            </div>
                            {opt}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="px-1 text-[10px] font-medium uppercase tracking-wide text-fg/20">Image size</span>
                        {(["Mini", "Small", "Medium", "Large"] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setImageSize(opt)}
                            className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${imageSize === opt ? "text-fg" : "text-fg-muted hover:bg-fg/5 hover:text-fg"}`}
                          >
                            <div className={`flex size-3 items-center justify-center rounded-full border ${imageSize === opt ? "border-fg" : "border-fg/20"}`}>
                              {imageSize === opt && <div className="size-1.5 rounded-full bg-fg" />}
                            </div>
                            {opt}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="px-1 text-[10px] font-medium uppercase tracking-wide text-fg/20">Edits</span>
                        {(["Group", "Ungroup"] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setGroupEdits(opt)}
                            className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${groupEdits === opt ? "text-fg" : "text-fg-muted hover:bg-fg/5 hover:text-fg"}`}
                          >
                            <div className={`flex size-3 items-center justify-center rounded-full border ${groupEdits === opt ? "border-fg" : "border-fg/20"}`}>
                              {groupEdits === opt && <div className="size-1.5 rounded-full bg-fg" />}
                            </div>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg transition-all duration-200"
                style={{ background: sc.button, color: "var(--surface-foreground-2)", width: searchExpanded ? 200 : 32, paddingLeft: searchExpanded ? 10 : 0, paddingRight: searchExpanded ? 8 : 0 }}
                onClick={() => {
                  if (!searchExpanded) {
                    setSearchExpanded(true);
                    setViewPopoverOpen(false);
                    setOpenFilter(null);
                    setSearchFocused(false);
                    setTimeout(() => inlineSearchRef.current?.focus(), 50);
                  }
                }}
              >
                <MagnifyingGlass weight="bold" size={14} className="shrink-0 text-fg-muted" style={{ marginLeft: searchExpanded ? 0 : 9 }} />
                {searchExpanded && (
                  <>
                    <input
                      ref={inlineSearchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => { if (!searchQuery) setSearchExpanded(false); }}
                      onKeyDown={(e) => { if (e.key === "Escape") { setSearchQuery(""); setSearchExpanded(false); } }}
                      placeholder="Search…"
                      className="min-w-0 flex-1 bg-transparent text-xs text-fg outline-none placeholder:text-fg-muted"
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => { setSearchQuery(""); inlineSearchRef.current?.focus(); }} className="shrink-0 cursor-pointer text-fg-muted hover:text-fg">
                        <X weight="bold" size={10} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            )}
          </div>

          <ProjectsFilterCtx.Provider value={{ visibilityFilter, selectedOwner, favoritesOnly, activeContentType, projectsSearchQuery }}>
          {children || (
            <div className="grid grid-cols-4 gap-2">
              {placeholderItems.map(({ id }) => (
                <div
                  key={id}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border transition-colors hover:border-fg/20"
                  style={{
                    borderColor: "var(--surface-border-alpha-0)",
                    background: sc.card,
                  }}
                >
                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                  {/* Top row */}
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="size-7 shrink-0 rounded-full border-2 border-white/15" />
                    <div className="flex items-center gap-1.5">
                      {[DotsThree, Trash, DownloadSimple, Heart].map((Icon, i) => (
                        <button
                          key={i}
                          type="button"
                          className="flex size-7 items-center justify-center rounded-full bg-white/10 text-fg backdrop-blur-sm transition-colors hover:bg-white/20"
                        >
                          <Icon weight="bold" size={14} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-end p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="flex items-center gap-1.5">
                      <button type="button" className="flex size-7 items-center justify-center rounded-full bg-white text-[#0d0d0d] transition-colors hover:bg-white/90">
                        <ShareNetwork weight="bold" size={14} />
                      </button>
                      <button type="button" className="flex size-7 items-center justify-center rounded-full bg-white text-[#0d0d0d] transition-colors hover:bg-white/90">
                        <Plus weight="bold" size={14} />
                      </button>
                      <button type="button" className="flex h-7 items-center gap-0.5 rounded-full bg-white px-2.5 text-[11px] font-medium text-[#0d0d0d] transition-colors hover:bg-white/90">
                        Use
                        <CaretDown weight="bold" size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </ProjectsFilterCtx.Provider>
        </div>
      </div>
    </main>

    {searchFocused && searchPopoverPos && createPortal(
      <div
        data-projects-search-popover
        className="fixed z-[9999] flex animate-[popoverIn_150ms_ease-out] flex-col overflow-hidden rounded-xl border shadow-2xl"
        style={{ top: searchPopoverPos.top, right: searchPopoverPos.right, width: "420px", background: sc.card, borderColor: "var(--surface-border-alpha-1)" }}
      >
        <div className="px-3 pt-3 pb-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-fg/25">Aspect ratio</span>
        </div>
        <div className="flex flex-wrap gap-1 px-3 pb-2">
          {["Any", "1:1", "4:3", "3:2", "16:9", "9:16", "3:4", "2:3"].map((r) => (
            <button key={r} type="button" onClick={() => setAspectRatio(r)}
              className={`cursor-pointer rounded-md border px-2 py-1 text-[11px] transition-colors ${aspectRatio === r ? "border-white/30 bg-white/10 text-fg" : "border-white/10 text-fg/50 hover:border-white/20 hover:text-fg"}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="mx-3 my-1 h-px bg-fg/5" />
        <div className="px-3 pt-1 pb-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-fg/25">Model</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-hidden px-3 pb-3">
          <input type="text" value={modelSearchQuery} onChange={(e) => setModelSearchQuery(e.target.value)} placeholder="Search…"
            className="h-[26px] w-[140px] shrink-0 rounded-md border border-white/10 bg-fg/5 px-2 text-[11px] text-fg outline-none placeholder:text-fg/25 transition-colors focus:border-white/20 [color-scheme:dark]" />
          {["Any", "Flux Pro", "Flux Dev", "SDXL", "Midjourney v6", "DALL·E 3"]
            .filter((m) => !modelSearchQuery.trim() || m.toLowerCase().includes(modelSearchQuery.toLowerCase()))
            .slice(0, modelSearchQuery.trim() ? undefined : 3)
            .map((m) => (
              <button key={m} type="button" onClick={() => { setModelFilter(m); setModelSearchQuery(""); }}
                className={`shrink-0 cursor-pointer whitespace-nowrap rounded-md border px-2 py-1 text-[11px] transition-colors ${modelFilter === m ? "border-white/30 bg-white/10 text-fg" : "border-white/10 text-fg/50 hover:border-white/20 hover:text-fg"}`}>
                {m}
              </button>
            ))}
        </div>
        <div className="mx-3 my-1 h-px bg-fg/5" />
        <div className="px-3 pt-1 pb-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-fg/25">Tool</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-hidden px-3 pb-3">
          <input type="text" value={toolSearchQuery} onChange={(e) => setToolSearchQuery(e.target.value)} placeholder="Search…"
            className="h-[26px] w-[140px] shrink-0 rounded-md border border-white/10 bg-fg/5 px-2 text-[11px] text-fg outline-none placeholder:text-fg/25 transition-colors focus:border-white/20 [color-scheme:dark]" />
          {["Any", "Upscale", "Image Editor", "Camera Angle", "Background Remover", "Face Swap"]
            .filter((t) => !toolSearchQuery.trim() || t.toLowerCase().includes(toolSearchQuery.toLowerCase()))
            .slice(0, toolSearchQuery.trim() ? undefined : 3)
            .map((t) => (
              <button key={t} type="button" onClick={() => { setToolFilter(t); setToolSearchQuery(""); }}
                className={`shrink-0 cursor-pointer whitespace-nowrap rounded-md border px-2 py-1 text-[11px] transition-colors ${toolFilter === t ? "border-white/30 bg-white/10 text-fg" : "border-white/10 text-fg/50 hover:border-white/20 hover:text-fg"}`}>
                {t}
              </button>
            ))}
        </div>
        <div className="mx-3 my-1 h-px bg-fg/5" />
        <div className="px-3 pt-1 pb-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-fg/25">Date range</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5">
          <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setDateFilter(e.target.value || dateTo ? "Custom range" : "Any time"); }}
            className="h-7 flex-1 rounded-md border border-white/10 bg-fg/5 px-2 text-[11px] text-fg outline-none transition-colors focus:border-white/20 [color-scheme:dark]" />
          <span className="text-[10px] text-fg-muted">to</span>
          <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setDateFilter(dateFrom || e.target.value ? "Custom range" : "Any time"); }}
            className="h-7 flex-1 rounded-md border border-white/10 bg-fg/5 px-2 text-[11px] text-fg outline-none transition-colors focus:border-white/20 [color-scheme:dark]" />
        </div>
        <div className="border-t border-white/5 p-2">
          <button
            type="button"
            onClick={() => setSearchFocused(false)}
            className="flex h-8 w-full cursor-pointer items-center justify-center rounded-lg text-xs font-medium text-fg transition-colors hover:opacity-90"
            style={{ background: "#074AE5" }}
          >
            Search
          </button>
        </div>
      </div>,
      document.body,
    )}

    {/* Project detail header context menu */}
    {projectMenuOpen && currentProject && (
      <ProjectHeaderContextMenu
        project={currentProject}
        anchorRect={projectMenuOpen.rect}
        onClose={() => setProjectMenuOpen(null)}
      />
    )}
    </>
  );
}
