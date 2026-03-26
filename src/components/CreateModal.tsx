"use client";

import { useState, useEffect } from "react";
import {
  MagnifyingGlass,
  X,
  SquaresFour,
} from "@phosphor-icons/react";
import { ProjectFolderBreadcrumb } from "@/components/ProjectFolderBreadcrumb";
import { usePalette } from "@/contexts/PaletteContext";
import { getSections } from "@/components/sidebar-panels/AllToolsPanel";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SidebarSection = "start-creating" | "apps" | "templates";
type TemplatesCategory = "featured" | "image" | "video" | "community" | "character" | "face-swap" | "product-shots" | "social-media";


export function CreateModal({ isOpen, onClose }: CreateModalProps) {
  const [activeSection, setActiveSection] = useState<SidebarSection>("start-creating");
  const [templatesCategory, setTemplatesCategory] = useState<TemplatesCategory>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const { colors: paletteColors } = usePalette();
  const toolSections = getSections(paletteColors);
  const [activeToolTab, setActiveToolTab] = useState(toolSections[0].id);
  const activeToolSection = toolSections.find((s) => s.id === activeToolTab)!;
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0, 0, 0, 0.7)" }}
        onClick={onClose}
      >
          {/* Modal Container */}
        <div
          className="relative flex h-auto max-h-[90vh] w-full max-w-[640px] overflow-hidden"
          style={{ background: "var(--surface-modal)", borderRadius: "16px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content Area */}
          <div className="flex min-w-0 flex-1 flex-col" style={{ background: "var(--surface-1)" }}>
            {/* Top Row: Create in + Close */}
            <div className="flex items-center justify-between px-6 pt-5 pb-6">
              <div className="flex items-center" style={{ gap: "20px" }}>
                <span className="text-sm text-fg-muted">Create to:</span>
                <ProjectFolderBreadcrumb />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                style={{ color: "var(--surface-foreground-0)" }}
                aria-label="Close modal"
              >
                <X weight="bold" size={16} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 px-6 pb-4">
              <div className="relative flex-1">
                <MagnifyingGlass
                  weight="bold"
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                  style={{ color: "var(--surface-foreground-2)" }}
                />
                <input
                  type="text"
                  placeholder="Search for apps, templates and files"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-colors focus:border-[var(--primary)]"
                  style={{
                    background: "var(--surface-modal)",
                    borderColor: "var(--surface-border-alpha-0)",
                    color: "var(--surface-foreground-0)",
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded transition-colors hover:bg-white/5"
                  style={{ color: "var(--surface-foreground-2)" }}
                >
                  <SquaresFour weight="bold" size={12} className="opacity-50" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative px-6 py-5" style={{ height: 440 }}>
              {activeSection === "start-creating" && (
                <>
                  {/* Category tabs */}
                  <div className="mb-4 flex gap-1 overflow-x-auto scrollbar-hide">
                    {toolSections.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveToolTab(s.id)}
                        className="cursor-pointer whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium transition-colors"
                        style={{
                          background: activeToolTab === s.id ? "var(--selected)" : "transparent",
                          color: activeToolTab === s.id ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Tools grid */}
                  <div className="mb-6 grid grid-cols-2 gap-0.5">
                    {activeToolSection.tools.map(({ id, label, icon: Icon, desc }) => (
                      <button
                        key={id}
                        type="button"
                        className="group/tool flex cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/5"
                      >
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: activeToolSection.accent }}
                        >
                          <Icon weight="regular" size={20} style={{ color: activeToolSection.iconColor }} className="opacity-80 transition-colors group-hover/tool:opacity-100" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="text-xs font-medium text-fg/80 transition-colors group-hover/tool:text-fg">{label}</span>
                          <span className="text-[11px] leading-snug text-fg/40">{desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                </>
              )}

              {activeSection === "apps" && (
                <div>
                  {/* Empty content */}
                </div>
              )}

              {activeSection === "templates" && (
                <div>
                  {/* Empty content */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
