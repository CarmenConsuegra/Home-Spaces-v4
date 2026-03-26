"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  FolderSimple,
  Plus,
  Users,
  LockSimple,
} from "@phosphor-icons/react";
import { useFolder, type Project, type Folder } from "@/contexts/FolderContext";

interface MoveAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (projectName: string, folderPath?: string) => void;
  assetName?: string;
}

function FolderTreeItem({
  folder,
  projectName,
  parentPath,
  selectedFolder,
  onSelect,
  hoveredFolder,
  setHoveredFolder,
  expandedFolders,
  toggleFolder,
  onCreateSubfolder,
}: {
  folder: Folder;
  projectName: string;
  parentPath: string;
  selectedFolder: string | null;
  onSelect: (folderPath: string) => void;
  hoveredFolder: string | null;
  setHoveredFolder: (path: string | null) => void;
  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
  onCreateSubfolder: (parentPath: string) => void;
}) {
  const folderPath = parentPath ? `${parentPath}/${folder.name}` : folder.name;
  const fullKey = `${projectName}/${folderPath}`;
  const hasChildren = folder.children && folder.children.length > 0;
  const isExpanded = expandedFolders.has(fullKey);
  const isSelected = selectedFolder === fullKey;

  return (
    <div>
      <div
        className={`group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-white/5 ${
          isSelected ? "bg-white/10" : ""
        }`}
        onClick={() => onSelect(fullKey)}
        onMouseEnter={() => setHoveredFolder(fullKey)}
        onMouseLeave={() => setHoveredFolder(null)}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) toggleFolder(fullKey);
          }}
          className={`flex size-5 items-center justify-center text-white/40 transition-transform ${
            isExpanded ? "rotate-90" : ""
          } ${!hasChildren ? "invisible" : ""}`}
        >
          <CaretRight weight="bold" size={12} />
        </button>

        <FolderSimple weight="fill" size={16} className="text-white/40" />
        <span className="flex-1 text-[14px] text-white/80">{folder.name}</span>

        {hoveredFolder === fullKey && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCreateSubfolder(fullKey);
            }}
            className="flex size-5 items-center justify-center rounded text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Plus weight="bold" size={14} />
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-5 mt-0.5 space-y-0.5">
          {folder.children!.map((child) => (
            <FolderTreeItem
              key={child.name}
              folder={child}
              projectName={projectName}
              parentPath={folderPath}
              selectedFolder={selectedFolder}
              onSelect={onSelect}
              hoveredFolder={hoveredFolder}
              setHoveredFolder={setHoveredFolder}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              onCreateSubfolder={onCreateSubfolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MoveAssetModal({ isOpen, onClose, onMove, assetName }: MoveAssetModalProps) {
  const { projects, addFolder, addProject } = useFolder();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set([projects[0]?.name]));
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [creatingFolderIn, setCreatingFolderIn] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");

  if (!isOpen) return null;

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.folders.some((folder) =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const toggleProject = (projectName: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(projectName)) {
        next.delete(projectName);
      } else {
        next.add(projectName);
      }
      return next;
    });
  };

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderKey)) {
        next.delete(folderKey);
      } else {
        next.add(folderKey);
      }
      return next;
    });
  };

  const handleSelectFolder = (folderKey: string) => {
    const [projectName] = folderKey.split("/");
    setSelectedProject(projectName);
    setSelectedFolder(folderKey);
  };

  const handleSelectProject = (projectName: string) => {
    setSelectedProject(projectName);
    setSelectedFolder(null);
  };

  const handleMove = () => {
    if (selectedFolder) {
      const parts = selectedFolder.split("/");
      const projectName = parts[0];
      const folderPath = parts.slice(1).join("/");
      onMove(projectName, folderPath);
      onClose();
    } else if (selectedProject) {
      onMove(selectedProject);
      onClose();
    }
  };

  const getSelectedName = () => {
    if (selectedFolder) {
      const parts = selectedFolder.split("/");
      return parts[parts.length - 1];
    }
    return selectedProject || "";
  };

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim(), "#6366f1");
      setIsCreatingProject(false);
      setNewProjectName("");
    }
  };

  const handleCreateFolder = (parentKey: string) => {
    if (newFolderName.trim()) {
      const parts = parentKey.split("/");
      const projectName = parts[0];
      const parentPath = parts.length > 1 ? parts.slice(1).join("/") : null;
      addFolder(projectName, parentPath, newFolderName.trim());
      setCreatingFolderIn(null);
      setNewFolderName("");
      // Expand the parent to show the new folder
      setExpandedFolders((prev) => new Set(prev).add(parentKey));
    }
  };

  const handleCreateSubfolder = (parentKey: string) => {
    setCreatingFolderIn(parentKey);
    setNewFolderName("Untitled");
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-[#1a1a1a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <CaretLeft weight="bold" size={18} />
          </button>
          <h2 className="text-[15px] font-semibold text-white">Move asset</h2>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
            <MagnifyingGlass weight="bold" size={16} className="text-white/40" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Projects list */}
        <div className="max-h-[360px] overflow-y-auto px-2 pb-2">
          {filteredProjects.map((project) => (
            <div key={project.name} className="mb-1">
              {/* Project row */}
              <div
                className={`group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-white/5 ${
                  selectedProject === project.name && !selectedFolder ? "bg-white/10" : ""
                }`}
                onClick={() => {
                  handleSelectProject(project.name);
                  if (project.folders.length > 0) {
                    toggleProject(project.name);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProject(project.name);
                  }}
                  className={`flex size-5 items-center justify-center text-white/40 transition-transform ${
                    expandedProjects.has(project.name) ? "rotate-90" : ""
                  } ${project.folders.length === 0 ? "invisible" : ""}`}
                >
                  <CaretRight weight="bold" size={12} />
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
                  <div
                    className="size-4 rounded"
                    style={{ background: project.color }}
                  />
                )}

                <span className="flex-1 text-[14px] text-white">{project.name}</span>

                {project.isPrivate && (
                  <LockSimple weight="bold" size={12} className="text-white/30" />
                )}
                {project.teamMembers && project.teamMembers.length > 0 && (
                  <div className="flex shrink-0 -space-x-1">
                    {project.teamMembers.slice(0, 2).map((member, i) => (
                      <div
                        key={i}
                        className="flex size-5 items-center justify-center rounded-full text-[9px] font-medium text-white ring-1 ring-[#1a1a1a]"
                        style={{ background: member.color }}
                      >
                        {member.initials}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Folders */}
              {expandedProjects.has(project.name) && (
                <div className="ml-5 mt-1 space-y-0.5">
                  {project.folders.map((folder) => (
                    <FolderTreeItem
                      key={folder.name}
                      folder={folder}
                      projectName={project.name}
                      parentPath=""
                      selectedFolder={selectedFolder}
                      onSelect={handleSelectFolder}
                      hoveredFolder={hoveredFolder}
                      setHoveredFolder={setHoveredFolder}
                      expandedFolders={expandedFolders}
                      toggleFolder={toggleFolder}
                      onCreateSubfolder={handleCreateSubfolder}
                    />
                  ))}

                  {/* Creating new folder input */}
                  {creatingFolderIn?.startsWith(project.name) && (
                    <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-2">
                      <div className="size-5" />
                      <FolderSimple weight="fill" size={16} className="text-white/40" />
                      <input
                        type="text"
                        placeholder="Folder name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreateFolder(creatingFolderIn);
                          if (e.key === "Escape") {
                            setCreatingFolderIn(null);
                            setNewFolderName("");
                          }
                        }}
                        onBlur={() => {
                          if (!newFolderName.trim()) {
                            setCreatingFolderIn(null);
                          }
                        }}
                        autoFocus
                        className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/40"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* New project button */}
          {!isCreatingProject ? (
            <button
              type="button"
              onClick={() => setIsCreatingProject(true)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <div className="flex size-5 items-center justify-center">
                <Plus weight="bold" size={14} />
              </div>
              <span className="text-[14px]">New project</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-2">
              <div className="size-5" />
              <div className="size-4 rounded bg-gradient-to-br from-blue-500 to-purple-500" />
              <input
                type="text"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateProject();
                  if (e.key === "Escape") {
                    setIsCreatingProject(false);
                    setNewProjectName("");
                  }
                }}
                onBlur={() => {
                  if (!newProjectName.trim()) {
                    setIsCreatingProject(false);
                  }
                }}
                autoFocus
                className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/40"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleMove}
            disabled={!selectedProject && !selectedFolder}
            className={`w-full rounded-lg py-2.5 text-[14px] font-medium transition-colors ${
              selectedProject || selectedFolder
                ? "bg-white text-black hover:bg-white/90"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            }`}
          >
            {selectedProject || selectedFolder ? `Move to ${getSelectedName()}` : "Move"}
          </button>
        </div>
      </div>
    </div>
  );
}
