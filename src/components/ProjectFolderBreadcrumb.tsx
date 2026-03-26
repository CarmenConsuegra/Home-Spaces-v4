"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useFolder, type Folder, type Project, type TeamMember } from "@/contexts/FolderContext";
import { MagnifyingGlass, CaretDown, CaretRight, FolderSimple, Plus, Users, Check, X, LockSimple, ArrowSquareOut } from "@phosphor-icons/react";
import Link from "next/link";



interface NewFolderState {
  parentKey: string; // "projectName" for root level, "projectName/folderName" for nested
  name: string;
}

function FolderTreeNode({
  folder,
  depth,
  expandedSet,
  onToggle,
  activeFolder,
  onSelect,
  projectName,
  parentPath,
  onCreateSubfolder,
  newFolder,
  onNewFolderChange,
  onNewFolderConfirm,
  onNewFolderCancel,
}: {
  folder: Folder;
  depth: number;
  expandedSet: Set<string>;
  onToggle: (key: string) => void;
  activeFolder?: string;
  onSelect: (folderName: string) => void;
  projectName: string;
  parentPath: string;
  onCreateSubfolder: (parentKey: string) => void;
  newFolder: NewFolderState | null;
  onNewFolderChange: (name: string) => void;
  onNewFolderConfirm: () => void;
  onNewFolderCancel: () => void;
}) {
  const hasChildren = folder.children && folder.children.length > 0;
  const folderPath = parentPath ? `${parentPath}/${folder.name}` : folder.name;
  const folderKey = `${projectName}/${folderPath}`;
  const isExpanded = expandedSet.has(folderKey);
  const isActive = activeFolder === folder.name;
  const isCreatingHere = newFolder?.parentKey === folderKey;

  return (
    <>
      <div
        className={`group flex w-full cursor-pointer select-none items-center gap-1.5 rounded-md py-1.5 pr-2 text-[13px] transition-colors ${isActive ? "bg-white/10 text-fg" : "text-fg/70 hover:bg-white/5 hover:text-fg"}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => onSelect(folder.name)}
      >
        {hasChildren || isCreatingHere ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggle(folderKey); }}
            className="flex shrink-0 cursor-pointer items-center justify-center"
          >
            <CaretRight
              weight="bold"
              size={10}
              className={`opacity-40 transition-transform ${isExpanded || isCreatingHere ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span className="w-[10px] shrink-0" />
        )}
        <FolderSimple weight={isActive ? "fill" : "regular"} size={14} className="shrink-0 opacity-60" />
        <span className="flex-1 truncate">{folder.name}</span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onCreateSubfolder(folderKey); }}
          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
        >
          <Plus weight="bold" size={12} />
        </button>
      </div>

      {/* New folder input row (when creating subfolder under this folder) */}
      {isCreatingHere && (
        <NewFolderInput
          depth={depth + 1}
          value={newFolder.name}
          onChange={onNewFolderChange}
          onConfirm={onNewFolderConfirm}
          onCancel={onNewFolderCancel}
        />
      )}

      {/* Children folders */}
      {(hasChildren && isExpanded) && folder.children!.map((child) => (
        <FolderTreeNode
          key={child.name}
          folder={child}
          depth={depth + 1}
          expandedSet={expandedSet}
          onToggle={onToggle}
          activeFolder={activeFolder}
          onSelect={onSelect}
          projectName={projectName}
          parentPath={folderPath}
          onCreateSubfolder={onCreateSubfolder}
          newFolder={newFolder}
          onNewFolderChange={onNewFolderChange}
          onNewFolderConfirm={onNewFolderConfirm}
          onNewFolderCancel={onNewFolderCancel}
        />
      ))}
    </>
  );
}

function NewFolderInput({
  depth,
  value,
  onChange,
  onConfirm,
  onCancel,
}: {
  depth: number;
  value: string;
  onChange: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus and select all text
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 10);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div
      className="flex w-full items-center gap-1.5 rounded-md bg-white/5 py-1 pr-1.5 text-[13px]"
      style={{ paddingLeft: `${12 + depth * 16}px` }}
    >
      <span className="w-[10px] shrink-0" />
      <FolderSimple weight="regular" size={14} className="shrink-0 opacity-60" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onConfirm}
        className="min-w-0 flex-1 bg-transparent text-[13px] text-fg outline-none"
        placeholder="Folder name"
      />
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onConfirm(); }}
        className="flex size-5 shrink-0 items-center justify-center rounded text-fg/60 transition-colors hover:bg-white/10 hover:text-fg"
      >
        <Check weight="bold" size={12} />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onCancel(); }}
        className="flex size-5 shrink-0 items-center justify-center rounded text-fg/60 transition-colors hover:bg-white/10 hover:text-fg"
      >
        <X weight="bold" size={10} />
      </button>
    </div>
  );
}

interface RecentDest {
  projectName: string;
  projectColor: string;
  projectCover?: string;
  folder: string;
}

export function ProjectFolderBreadcrumb() {
  const { projects, activeProject, activeFolder, selectProject, selectFolder, addFolder } = useFolder();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPos, setPickerPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set([activeProject.name]));
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([`${activeProject.name}/Scenes`]));
  const [newFolder, setNewFolder] = useState<NewFolderState | null>(null);
  const [recentDests, setRecentDests] = useState<RecentDest[]>([]);

  const pushRecent = useCallback((projectName: string, projectColor: string, projectCover: string | undefined, folder: string) => {
    setRecentDests((prev) => {
      const filtered = prev.filter((d) => !(d.projectName === projectName && d.folder === folder));
      return [{ projectName, projectColor, projectCover, folder }, ...filtered].slice(0, 3);
    });
  }, []);

  const togglePicker = useCallback(() => {
    if (pickerOpen) {
      setPickerOpen(false);
      setSearchQuery("");
      setNewFolder(null);
      return;
    }
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPickerPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 - 140 });
    setPickerOpen(true);
    setSearchQuery("");
    setNewFolder(null);
    setExpandedProjects((prev) => new Set(prev).add(activeProject.name));
    setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [activeProject.name, pickerOpen]);

  const closePicker = useCallback(() => {
    setPickerOpen(false);
    setSearchQuery("");
    setNewFolder(null);
  }, []);

  useEffect(() => {
    if (!pickerOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-picker]") && !btnRef.current?.contains(target)) {
        closePicker();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (newFolder) {
          setNewFolder(null);
        } else {
          closePicker();
        }
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [pickerOpen, closePicker, newFolder]);

  const toggleProject = useCallback((name: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const toggleFolder = useCallback((key: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleSelectFolder = useCallback((project: Project, folderName: string) => {
    selectProject(project, folderName);
    pushRecent(project.name, project.color, project.cover, folderName);
    closePicker();
  }, [selectProject, pushRecent, closePicker]);

  // Select project at root level (no folder)
  const handleSelectProject = useCallback((project: Project) => {
    selectProject(project, "");
    pushRecent(project.name, project.color, project.cover, "");
    closePicker();
  }, [selectProject, pushRecent, closePicker]);

  // Create subfolder handler
  const handleCreateSubfolder = useCallback((parentKey: string) => {
    // Expand the parent folder
    setExpandedFolders((prev) => new Set(prev).add(parentKey));
    // Start creating new folder
    setNewFolder({ parentKey, name: "Untitled" });
  }, []);

  // Create folder at project root level
  const handleCreateProjectFolder = useCallback((projectName: string) => {
    // Expand the project
    setExpandedProjects((prev) => new Set(prev).add(projectName));
    // Start creating new folder at project root
    setNewFolder({ parentKey: projectName, name: "Untitled" });
  }, []);

  const handleNewFolderChange = useCallback((name: string) => {
    setNewFolder((prev) => prev ? { ...prev, name } : null);
  }, []);

  const handleNewFolderConfirm = useCallback(() => {
    if (newFolder && newFolder.name.trim()) {
      const folderName = newFolder.name.trim();
      const parentKey = newFolder.parentKey;
      
      // Check if it's a project root or nested folder
      const parts = parentKey.split("/");
      const projectName = parts[0];
      const parentPath = parts.length > 1 ? parts.slice(1).join("/") : null;
      
      // Add the folder to the project
      addFolder(projectName, parentPath, folderName);
      
      // Expand the parent to show the new folder
      if (parentPath) {
        setExpandedFolders((prev) => new Set(prev).add(parentKey));
      }
    }
    setNewFolder(null);
  }, [newFolder, addFolder]);

  const handleNewFolderCancel = useCallback(() => {
    setNewFolder(null);
  }, []);

  // Filter projects based on search
  const filteredProjects = searchQuery.trim()
    ? projects.filter((p) => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.folders.some((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : projects;

  return (
    <>
  <button
  ref={btnRef}
  type="button"
  onClick={togglePicker}
  className="flex cursor-pointer items-center gap-2 rounded-lg border bg-white/10 px-3 py-1.5 transition-colors hover:bg-white/15"
  style={{ borderColor: "rgba(255,255,255,0.1)" }}
  >
  {activeProject.cover ? (
    <div className="size-5 shrink-0 overflow-hidden rounded">
      <Image src={activeProject.cover} alt={activeProject.name} width={20} height={20} unoptimized className="size-full object-cover" />
    </div>
  ) : (
    <div className="size-3 shrink-0 rounded" style={{ background: activeProject.color }} />
  )}
  {activeProject.isTeam && (
    <Users weight="fill" size={14} className="shrink-0 text-fg/50" />
  )}
  <span className="text-[13px] font-medium text-fg">{activeProject.name}</span>
        {activeFolder && (
          <>
            <span className="text-[13px] text-fg/30">/</span>
            <span className="text-[13px] font-medium text-fg">{activeFolder}</span>
          </>
        )}
        <CaretDown weight="bold" size={10} className="ml-0.5 text-fg/40" />
      </button>

      {/* Direct link to project/folder */}
      <Link
        href={
          activeFolder
            ? `/projects/${activeProject.name.toLowerCase().replace(/\s+/g, "-")}?folder=${encodeURIComponent(activeFolder)}`
            : `/projects/${activeProject.name.toLowerCase().replace(/\s+/g, "-")}`
        }
        className="flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-white/10"
        style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--surface-foreground-0)" }}
        title="Go to project"
      >
        <ArrowSquareOut weight="bold" size={14} />
      </Link>

      {/* Combined picker portal */}
      {pickerOpen && createPortal(
        <div
          data-picker
          className="fixed z-[9999] flex w-[280px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#232323] shadow-2xl"
          style={{ top: pickerPos?.top, left: pickerPos?.left, maxHeight: "480px" }}
        >
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <MagnifyingGlass weight="bold" size={14} className="shrink-0 text-fg/30" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-fg/30"
            />
          </div>

          {/* Recent destinations */}
          {!searchQuery.trim() && recentDests.length > 0 && (
            <div className="border-b border-white/5 pb-1">
              <div className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-fg/30">Recent</div>
              {recentDests.map((dest, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const proj = projects.find((p) => p.name === dest.projectName);
                    if (proj) dest.folder ? handleSelectFolder(proj, dest.folder) : handleSelectProject(proj);
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-[13px] text-fg/70 transition-colors hover:bg-white/5 hover:text-fg"
                >
                  {dest.projectCover ? (
                    <div className="size-4 shrink-0 overflow-hidden rounded">
                      <Image src={dest.projectCover} alt={dest.projectName} width={16} height={16} unoptimized className="size-full object-cover" />
                    </div>
                  ) : (
                    <div className="size-3 shrink-0 rounded" style={{ background: dest.projectColor }} />
                  )}
                  <span className="truncate">
                    {dest.projectName}
                    {dest.folder && <><span className="opacity-40"> / </span>{dest.folder}</>}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Projects & Folders list */}
          <div className="flex-1 overflow-y-auto pb-2">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const isProjectExpanded = expandedProjects.has(project.name);
                const isActiveProject = activeProject.name === project.name;
                const isCreatingAtProjectRoot = newFolder?.parentKey === project.name;

                return (
                  <div key={project.name}>
                    {/* Project row */}
                    <div
                      className={`group flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-[13px] transition-colors hover:bg-white/5 ${isActiveProject && !activeFolder ? "bg-white/10 text-fg" : isActiveProject ? "text-fg" : "text-fg/70"}`}
                      onClick={() => handleSelectProject(project)}
                    >
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleProject(project.name); }}
                        className="flex shrink-0 items-center justify-center"
                      >
                        <CaretDown
                          weight="bold"
                          size={10}
                          className={`opacity-40 transition-transform ${isProjectExpanded ? "rotate-0" : "-rotate-90"}`}
                        />
                      </button>
                      {project.cover ? (
                        <div className="size-6 shrink-0 overflow-hidden rounded">
                          <Image
                            src={project.cover}
                            alt={project.name}
                            width={24}
                            height={24}
                            unoptimized
                            className="size-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="size-4 shrink-0 rounded" style={{ background: project.color }} />
                      )}
                      <span className="flex-1 truncate font-medium">{project.name}</span>
                      {project.isPrivate && (
                        <LockSimple weight="bold" size={12} className="shrink-0 opacity-30" />
                      )}
                      {project.teamMembers && project.teamMembers.length > 0 && (
                        <Users weight="fill" size={14} className="shrink-0 text-fg/40" />
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleCreateProjectFolder(project.name); }}
                        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
                      >
                        <Plus weight="bold" size={12} />
                      </button>
                    </div>

                    {/* New folder input at project root level */}
                    {isProjectExpanded && isCreatingAtProjectRoot && (
                      <NewFolderInput
                        depth={0}
                        value={newFolder.name}
                        onChange={handleNewFolderChange}
                        onConfirm={handleNewFolderConfirm}
                        onCancel={handleNewFolderCancel}
                      />
                    )}

                    {/* Folders tree (when expanded) */}
                    {isProjectExpanded && project.folders.map((folder) => (
                      <FolderTreeNode
                        key={folder.name}
                        folder={folder}
                        depth={0}
                        expandedSet={expandedFolders}
                        onToggle={toggleFolder}
                        activeFolder={isActiveProject ? activeFolder : undefined}
                        onSelect={(folderName) => handleSelectFolder(project, folderName)}
                        projectName={project.name}
                        parentPath=""
                        onCreateSubfolder={handleCreateSubfolder}
                        newFolder={newFolder}
                        onNewFolderChange={handleNewFolderChange}
                        onNewFolderConfirm={handleNewFolderConfirm}
                        onNewFolderCancel={handleNewFolderCancel}
                      />
                    ))}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-6 text-center text-[13px] text-fg/30">No projects found</div>
            )}
          </div>

          {/* New project button */}
          <div className="border-t border-white/5 px-3 py-2">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-[13px] text-fg/60 transition-colors hover:bg-white/5 hover:text-fg"
            >
              <Plus weight="bold" size={14} className="opacity-60" />
              <span>New project</span>
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
