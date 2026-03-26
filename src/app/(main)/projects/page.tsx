"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ProjectsLayout } from "@/components/ProjectsLayout";
import { ProjectCard, NewProjectCard } from "@/components/ProjectCard";
import { AssetCard } from "@/components/AssetCard";
import { SpaceCard } from "@/components/SpaceCard";
import { useNewProjectModal } from "@/contexts/NewProjectModalContext";
import { useFolder } from "@/contexts/FolderContext";
import { getProjectAssets } from "@/data/projectAssets";
import { allSpaces } from "@/data/spaces";
import { CaretDown, ArrowRight } from "@phosphor-icons/react";

// Section header: label + collapse toggle + "All X →" ghost button
function SectionHeader({
  label,
  href,
  allLabel,
  expanded,
  onToggle,
}: {
  label: string;
  href: string;
  allLabel: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex h-8 items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span
          className="text-[14px] font-normal leading-[1.6]"
          style={{ color: "var(--surface-foreground-0)" }}
        >
          {label}
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="flex size-4 items-center justify-center rounded-sm opacity-50 transition-transform"
          style={{ background: "rgba(115,115,115,0.1)" }}
        >
          <CaretDown
            weight="bold"
            size={10}
            className={`transition-transform ${expanded ? "" : "-rotate-90"}`}
          />
        </button>
      </div>
      <Link
        href={href}
        className="flex h-8 items-center gap-2 rounded-lg px-4 text-[12px] font-medium transition-colors hover:bg-white/5"
        style={{ color: "#f7f7f7" }}
      >
        {allLabel}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

// Parse relative date strings like "3 days ago", "12 days ago" into sortable numbers
function parseDaysAgo(editedAt: string): number {
  const match = editedAt.match(/(\d+)\s+days?\s+ago/);
  return match ? parseInt(match[1], 10) : 999;
}

// Returns [ref, visibleCount] — only shows as many items as fit fully in one row
function useFitRow(cardWidth: number, gap: number, total: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(total);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const calc = () => {
      const w = el.offsetWidth;
      setCount(Math.max(1, Math.floor((w + gap) / (cardWidth + gap))));
    };

    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cardWidth, gap, total]);

  return [ref, count] as const;
}

export default function WorkPage() {
  const newProjectModal = useNewProjectModal();
  const { projects } = useFolder();

  const assetsData = useMemo(() => {
    const allAssets = getProjectAssets("");
    return allAssets.slice(0, 12).map((asset, idx) => ({
      id: `asset-${idx + 1}`,
      thumbnail: asset.src,
    }));
  }, []);

  // Sort spaces from most recent to oldest
  const sortedSpaces = useMemo(
    () => [...allSpaces].sort((a, b) => parseDaysAgo(a.editedAt) - parseDaysAgo(b.editedAt)),
    []
  );

  // All project items (NewProjectCard + projects)
  const allProjectItems = useMemo(() => projects, [projects]);
  const totalProjectItems = allProjectItems.length + 1; // +1 for NewProjectCard

  const [projectsRef, visibleProjectCount] = useFitRow(200, 24, totalProjectItems);
  const [spacesRef, visibleSpacesCount] = useFitRow(200, 24, sortedSpaces.length);

  // Slice to only show what fits completely
  const visibleProjects = allProjectItems.slice(0, visibleProjectCount - 1); // reserve 1 slot for NewProjectCard
  const visibleSpaces = sortedSpaces.slice(0, visibleSpacesCount);

  // Collapse state per section
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [spacesExpanded, setSpacesExpanded] = useState(true);
  const [assetsExpanded, setAssetsExpanded] = useState(true);

  return (
    <ProjectsLayout title="Work" simpleHeader>
      <div className="flex flex-col gap-6">

        {/* Projects Section */}
        <section className="flex flex-col gap-3">
          <SectionHeader
            label="Projects"
            href="/projects/all-projects"
            allLabel="All projects"
            expanded={projectsExpanded}
            onToggle={() => setProjectsExpanded((v) => !v)}
          />
          {projectsExpanded && (
            <div ref={projectsRef} className="flex gap-6">
              <div className="w-[200px] shrink-0">
                <NewProjectCard onClick={() => newProjectModal?.open()} />
              </div>
              {visibleProjects.map((project) => (
                <div key={project.name} className="w-[200px] shrink-0">
                  <ProjectCard
                    id={project.name.toLowerCase().replace(/\s+/g, "-")}
                    title={project.name}
                    cover={project.cover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop"}
                    editedAt="Edited recently"
                    isPrivate={project.isPrivate ?? true}
                    isPinned={false}
                    collaborators={project.teamMembers?.map((m) => ({ name: m.initials, color: m.color })) || []}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Spaces Section */}
        <section className="flex flex-col gap-3">
          <SectionHeader
            label="Spaces"
            href="/spaces"
            allLabel="All spaces"
            expanded={spacesExpanded}
            onToggle={() => setSpacesExpanded((v) => !v)}
          />
          {spacesExpanded && (
            <div ref={spacesRef} className="flex gap-6">
              {visibleSpaces.map((space) => (
                <div key={space.id} className="w-[200px] shrink-0">
                  <SpaceCard
                    name={space.name}
                    editedAt={space.editedAt}
                    thumbnails={space.thumbnails}
                    isFavorite={space.isFavorite}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Assets Section */}
        <section className="flex flex-col gap-3">
          <SectionHeader
            label="Assets"
            href="/projects/all-assets"
            allLabel="All assets"
            expanded={assetsExpanded}
            onToggle={() => setAssetsExpanded((v) => !v)}
          />
          {assetsExpanded && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(236px,1fr))] gap-4">
              {assetsData.map((asset) => (
                <AssetCard key={asset.id} src={asset.thumbnail} />
              ))}
            </div>
          )}
        </section>

      </div>
    </ProjectsLayout>
  );
}
