"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import NextImage from "next/image";
import { usePalette } from "@/contexts/PaletteContext";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { useFolder, type Folder } from "@/contexts/FolderContext";
import { getProjectAssets } from "@/data/projectAssets";
import {
  Image,
  VideoCamera,
  SpeakerHigh,
  Heart,
  SlidersHorizontal,
  GridFour,
  MagnifyingGlass,
  CaretDown,
  CaretUp,
  CaretRight,
  FolderSimple,
  Cube,
  Waveform,
  Star,
  X,
  Microphone,
  ArrowsOutSimple,
  Trash,
  Plus,
  Stack,
  Clock,
  TreeStructure,
  PencilSimple,
  SidebarSimple,
} from "@phosphor-icons/react";

const sectionRoutes: Record<string, string> = {
  Image: "/ai-suite",
  Video: "/video",
  Audio: "/audio",
  "3D": "/3d",
};

function flattenFolders(items: Folder[], parentPath = ""): { name: string; path: string }[] {
  const result: { name: string; path: string }[] = [];
  for (const folder of items) {
    const path = parentPath ? `${parentPath} / ${folder.name}` : folder.name;
    result.push({ name: folder.name, path });
    if (folder.children) {
      result.push(...flattenFolders(folder.children, path));
    }
  }
  return result;
}

const recentFolders = ["Scenes", "Raw", "Music"];

function TreeNode({
  folder,
  depth,
  expandedSet,
  onToggle,
  activeFolder,
  onSelect,
  dragOverFolder,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  folder: Folder;
  depth: number;
  expandedSet: Set<string>;
  onToggle: (name: string) => void;
  activeFolder?: string;
  onSelect?: (name: string) => void;
  dragOverFolder?: string | null;
  onDragOver?: (e: React.DragEvent, name: string) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, name: string) => void;
}) {
  const hasChildren = folder.children && folder.children.length > 0;
  const isExpanded = expandedSet.has(folder.name);
  const isDragOver = dragOverFolder === folder.name;
  const isActive = activeFolder != null && activeFolder === folder.name;
  const isSelectable = !!onSelect;

  return (
    <>
      <div
        className={`flex w-full cursor-default select-none items-center gap-1.5 rounded-md py-1 pr-2 text-xs transition-colors ${isDragOver ? "bg-blue-500/20 text-fg ring-1 ring-blue-500/50" : isActive ? "bg-fg/5 text-fg" : "text-fg/60 hover:bg-fg/5 hover:text-fg"}`}
        style={{ paddingLeft: `${4 + depth * 12}px` }}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); onDragOver?.(e, folder.name); }}
        onDragLeave={(e) => { e.stopPropagation(); onDragLeave?.(e); }}
        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onDrop?.(e, folder.name); }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(folder.name)}
            className="flex shrink-0 cursor-pointer items-center justify-center"
          >
            <CaretRight
              weight="bold"
              size={10}
              className={`opacity-40 transition-transform ${isExpanded ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span className="w-[10px] shrink-0" />
        )}
        <div
          className={`flex min-w-0 flex-1 items-center gap-1.5 ${isSelectable || hasChildren ? "cursor-pointer" : ""}`}
          onClick={isSelectable ? () => onSelect(folder.name) : hasChildren ? () => onToggle(folder.name) : undefined}
        >
          <FolderSimple weight={isDragOver ? "fill" : isActive ? "fill" : "regular"} size={14} className="shrink-0" />
          <span className="flex-1 truncate">{folder.name}</span>
          {folder.assetCount != null && (
            <span className="shrink-0 text-[10px] tabular-nums text-fg/25">{folder.assetCount}</span>
          )}
        </div>
      </div>
      {hasChildren && isExpanded && folder.children!.map((child) => (
        <TreeNode
          key={child.name}
          folder={child}
          depth={depth + 1}
          expandedSet={expandedSet}
          onToggle={onToggle}
          activeFolder={activeFolder}
          onSelect={onSelect}
          dragOverFolder={dragOverFolder}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />
      ))}
    </>
  );
}

export function AssetPanel() {
  const { surfaceColors: sc } = usePalette();
  const router = useRouter();
  const pathname = usePathname();
  const activeSection = pathname.startsWith("/ai-suite") ? "Image"
    : pathname.startsWith("/video") ? "Video"
    : pathname.startsWith("/audio") ? "Audio"
    : pathname.startsWith("/3d") ? "3D"
    : null;

  const { activeProject, activeFolder, selectFolder, selectProject: ctxSelectProject } = useFolder();
  
  // Get assets based on selected project and folder
  const projectAssets = useMemo(() => getProjectAssets(activeProject?.name || "", activeFolder || ""), [activeProject?.name, activeFolder]);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(["All"]));
  const toggleFilter = useCallback((id: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (id === "All") return new Set(["All"]);
      next.delete("All");
      if (next.has(id)) {
        next.delete(id);
        return next.size === 0 ? new Set(["All"]) : next;
      }
      next.add(id);
      return next;
    });
  }, []);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [upscaledOnly, setUpscaledOnly] = useState(false);
  const [editedOnly, setEditedOnly] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>("Any time");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<string>("Any");
  const [modelFilter, setModelFilter] = useState<string>("Any");
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [toolFilter, setToolFilter] = useState<string>("Any");
  const [toolSearchQuery, setToolSearchQuery] = useState("");

  // View options state
  const [viewLayout, setViewLayout] = useState<"Row" | "Grid">("Row");
  const [imageSize, setImageSize] = useState<"Mini" | "Small" | "Medium" | "Large">("Medium");
  const [groupEdits, setGroupEdits] = useState<"Group" | "Ungroup">("Ungroup");

  const [activeContentType, setActiveContentType] = useState<string | null>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [viewPopoverOpen, setViewPopoverOpen] = useState(false);
  const [inlineSearchQuery, setInlineSearchQuery] = useState("");
  const inlineSearchRef = useRef<HTMLInputElement>(null);

  // Asset search bar state
  const [assetSearchQuery, setAssetSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchPopoverPos, setSearchPopoverPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const assetSearchInputRef = useRef<HTMLInputElement>(null);



  // Sidebar section collapse state
  const [feedFilterCollapsed, setFeedFilterCollapsed] = useState(false);
  const [viewModeCollapsed, setViewModeCollapsed] = useState(true);
  const [projectFoldersCollapsed, setProjectFoldersCollapsed] = useState(false);

  // Drag & drop state
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [draggingAssetId, setDraggingAssetId] = useState<string | null>(null);

  const handleAssetDragStart = useCallback((e: React.DragEvent, assetId: string) => {
    e.dataTransfer.setData("text/plain", assetId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingAssetId(assetId);

    const ghost = e.currentTarget.cloneNode(true) as HTMLElement;
    ghost.style.width = "64px";
    ghost.style.height = "64px";
    ghost.style.borderRadius = "12px";
    ghost.style.opacity = "0.9";
    ghost.style.position = "fixed";
    ghost.style.top = "-1000px";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 32, 32);
    requestAnimationFrame(() => document.body.removeChild(ghost));
  }, []);

  const handleAssetDragEnd = useCallback(() => {
    setDraggingAssetId(null);
    setDragOverFolder(null);
  }, []);

  const handleFolderDragOver = useCallback((_e: React.DragEvent, folderName: string) => {
    setDragOverFolder(folderName);
  }, []);

  const handleFolderDragLeave = useCallback((_e: React.DragEvent) => {
    setDragOverFolder(null);
  }, []);

  const handleFolderDrop = useCallback((_e: React.DragEvent, folderName: string) => {
    setDragOverFolder(null);
    setDraggingAssetId(null);
    // In production this would move the asset into the folder
  }, []);

  useEffect(() => {
    if (!searchFocused) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !searchBtnRef.current?.contains(target) &&
        !target.closest("[data-search-popover]")
      ) {
        setSearchFocused(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchFocused(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [searchFocused]);

  useEffect(() => {
    if (!viewPopoverOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-view-popover]")) setViewPopoverOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [viewPopoverOpen]);

  return (
    <>
      <div
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-2xl px-6 py-4"
        style={{ background: sc.panel }}
      >
        <div className="flex h-8 items-center justify-end">
          {/* Filters */}
          <div className="flex items-center gap-1.5">
            {/* Content type icon group */}
            <div className="flex items-center rounded-lg" style={{ background: sc.button }}>
              {[
                { icon: Image, label: "Images" },
                { icon: VideoCamera, label: "Videos" },
                { icon: Waveform, label: "Audio" },
                { icon: Cube, label: "3D" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveContentType((prev) => prev === label ? null : label)}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
                  style={{ color: activeContentType === label ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)" }}
                >
                  <Icon weight="bold" size={16} />
                </button>
              ))}
            </div>

            <button type="button" onClick={() => setFavoritesOnly(!favoritesOnly)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-fg/5" style={{ background: sc.button, color: favoritesOnly ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)" }}>
              <Heart weight={favoritesOnly ? "fill" : "bold"} size={16} />
            </button>
            <button
              ref={searchBtnRef}
              type="button"
              onClick={() => {
                const rect = searchBtnRef.current?.getBoundingClientRect();
                if (rect) setSearchPopoverPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
                setSearchFocused(true);
              }}
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
              style={{ background: sc.button, color: searchFocused ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)" }}
            >
              <SlidersHorizontal weight="bold" size={16} />
            </button>
            <div className="relative" data-view-popover>
              <button
                type="button"
                onClick={() => setViewPopoverOpen(!viewPopoverOpen)}
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
                    value={inlineSearchQuery}
                    onChange={(e) => setInlineSearchQuery(e.target.value)}
                    onBlur={() => { if (!inlineSearchQuery) setSearchExpanded(false); }}
                    onKeyDown={(e) => { if (e.key === "Escape") { setInlineSearchQuery(""); setSearchExpanded(false); } }}
                    placeholder="Search…"
                    className="min-w-0 flex-1 bg-transparent text-xs text-fg outline-none placeholder:text-fg-muted"
                  />
                  {inlineSearchQuery && (
                    <button type="button" onClick={() => { setInlineSearchQuery(""); inlineSearchRef.current?.focus(); }} className="shrink-0 cursor-pointer text-fg-muted hover:text-fg">
                      <X weight="bold" size={10} />
                    </button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="grid grid-cols-4 gap-2">
              {projectAssets.map(({ id, src }) => (
                <div
                  key={id}
                  draggable
                  onDragStart={(e) => handleAssetDragStart(e, id)}
                  onDragEnd={handleAssetDragEnd}
                  className={`relative aspect-square cursor-grab overflow-hidden rounded-[16px] border transition-all hover:opacity-80 active:cursor-grabbing ${draggingAssetId === id ? "opacity-60 !border-blue-500/60" : ""}`}
                  style={{
                    borderColor: "rgba(255,255,255,0.05)",
                    background: sc.button,
                  }}
                >
                  <NextImage
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>

      {/* Search popover */}
      {searchFocused && searchPopoverPos && createPortal(
        <div
          data-search-popover
          className="fixed z-[9999] flex animate-[popoverIn_150ms_ease-out] flex-col overflow-hidden rounded-xl border shadow-2xl"
          style={{ top: searchPopoverPos.top, right: `calc(100vw - ${searchPopoverPos.left + searchPopoverPos.width}px)`, width: "420px", background: sc.card, borderColor: "var(--surface-border-alpha-1)" }}
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


    </>
  );
}
