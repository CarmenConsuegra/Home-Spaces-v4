"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  CaretDown,
  X,
  MagnifyingGlass,
  PushPin,
  Users,
} from "@phosphor-icons/react";
import { usePalette } from "@/contexts/PaletteContext";
import { useFolder } from "@/contexts/FolderContext";

interface ProjectFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

interface OwnerFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const teamMembers = [
  { id: "1", name: "Alvaro Castañeda" },
  { id: "2", name: "Martin LeBlanc" },
  { id: "3", name: "Adrián Fernández" },
  { id: "4", name: "Leandro Bos" },
];

export function ProjectFilter({ value, onChange }: ProjectFilterProps) {
  const { surfaceColors: sc } = usePalette();
  const { projects } = useFolder();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedProject = value ? projects.find(p => p.name === value) : null;

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (projectName: string) => {
    onChange(projectName);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      {selectedProject ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-medium transition-colors hover:bg-fg/5"
          style={{ background: sc.button, color: "var(--surface-foreground-0)" }}
        >
          {selectedProject.cover ? (
            <div className="size-5 shrink-0 overflow-hidden rounded">
              <Image
                src={selectedProject.cover}
                alt={selectedProject.name}
                width={20}
                height={20}
                className="size-full object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="size-4 shrink-0 rounded" style={{ background: selectedProject.color }} />
          )}
          <span>{selectedProject.name}</span>
          <button
            type="button"
            onClick={handleClear}
            className="ml-1 flex size-4 items-center justify-center rounded-full hover:bg-white/10"
          >
            <X weight="bold" size={10} />
          </button>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 items-center gap-2 rounded-lg px-4 text-[13px] font-medium transition-colors hover:bg-fg/5"
          style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
        >
          Project
          <CaretDown weight="bold" size={12} />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border shadow-xl"
          style={{ background: sc.panel, borderColor: "var(--surface-border-alpha-0)" }}
        >
          {/* Search input */}
          <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: "var(--surface-border-alpha-0)" }}>
            <MagnifyingGlass weight="bold" size={14} className="shrink-0 text-fg-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-fg-muted"
              autoFocus
            />
          </div>

          {/* Projects list */}
          <div className="max-h-64 overflow-y-auto p-1">
            {filteredProjects.map((project) => {
              const isShared = !project.isPrivate;
              const isPinned = project.name === "Personal" || project.name === "Team project";
              
              return (
                <button
                  key={project.name}
                  type="button"
                  onClick={() => handleSelect(project.name)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-fg/5"
                  style={{ color: value === project.name ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)" }}
                >
                  {project.cover ? (
                    <div className="size-6 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={project.cover}
                        alt={project.name}
                        width={24}
                        height={24}
                        className="size-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="size-5 shrink-0 rounded" style={{ background: project.color }} />
                  )}
                  <span className="flex-1 truncate text-[13px]">{project.name}</span>
                  {isPinned && (
                    <PushPin weight="fill" size={12} className="shrink-0 text-fg-muted" />
                  )}
                  {isShared && (
                    <Users weight="fill" size={12} className="shrink-0 text-fg-muted" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function OwnerFilter({ value, onChange }: OwnerFilterProps) {
  const { surfaceColors: sc } = usePalette();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredMembers = teamMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (memberName: string) => {
    onChange(memberName);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      {value ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-medium transition-colors hover:bg-fg/5"
          style={{ background: sc.button, color: "var(--surface-foreground-0)" }}
        >
          <span>{value}</span>
          <button
            type="button"
            onClick={handleClear}
            className="ml-1 flex size-4 items-center justify-center rounded-full hover:bg-white/10"
          >
            <X weight="bold" size={10} />
          </button>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 items-center gap-2 rounded-lg px-4 text-[13px] font-medium transition-colors hover:bg-fg/5"
          style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
        >
          Owner
          <CaretDown weight="bold" size={12} />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border shadow-xl"
          style={{ background: sc.panel, borderColor: "var(--surface-border-alpha-0)" }}
        >
          {/* Search input */}
          <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: "var(--surface-border-alpha-0)" }}>
            <MagnifyingGlass weight="bold" size={14} className="shrink-0 text-fg-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member..."
              className="flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-fg-muted"
              autoFocus
            />
          </div>

          {/* Members list */}
          <div className="max-h-64 overflow-y-auto p-1">
            {filteredMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => handleSelect(member.name)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-fg/5"
                style={{ color: value === member.name ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)" }}
              >
                <span className="text-[13px]">{member.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
