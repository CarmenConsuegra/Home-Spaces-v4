"use client";

import {
  Image,
  VideoCamera,
  Waveform,
  Cube,
  CaretDown,
  Heart,
  SlidersHorizontal,
  SquaresFour,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { usePalette } from "@/contexts/PaletteContext";
import { useAssetsFilter } from "@/contexts/AssetsFilterContext";
import { ProjectFilter, OwnerFilter } from "@/components/FilterDropdowns";

export function AssetsFilterBar() {
  const { surfaceColors: sc } = usePalette();
  
  const {
    selectedProject,
    setSelectedProject,
    selectedOwner,
    setSelectedOwner,
    favoritesOnly,
    setFavoritesOnly,
    activeContentType,
    setActiveContentType,
  } = useAssetsFilter();

  const toggleContentType = (type: string) => {
    setActiveContentType(activeContentType === type ? null : type);
  };

  const contentTypes = [
    { icon: Image, label: "Images" },
    { icon: VideoCamera, label: "Videos" },
    { icon: Waveform, label: "Audio" },
    { icon: Cube, label: "3D" },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Content type icon group */}
      <div className="flex items-center rounded-lg" style={{ background: sc.button }}>
        {contentTypes.map(({ icon: Icon, label }) => {
          const isActive = activeContentType === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggleContentType(label)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
              style={{ color: isActive ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)" }}
            >
              <Icon weight="bold" size={18} />
            </button>
          );
        })}
        <button
          type="button"
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
          style={{ color: "var(--surface-foreground-2)" }}
        >
          <CaretDown weight="bold" size={12} />
        </button>
      </div>

      {/* Favorites toggle */}
      <button
        type="button"
        onClick={() => setFavoritesOnly(!favoritesOnly)}
        className="flex size-9 items-center justify-center rounded-lg transition-colors"
        style={{
          background: favoritesOnly ? "rgba(255,255,255,0.1)" : sc.button,
          color: favoritesOnly ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
        }}
      >
        <Heart weight={favoritesOnly ? "fill" : "bold"} size={18} />
      </button>

      {/* Project dropdown */}
      <ProjectFilter
        value={selectedProject === "All" ? null : selectedProject}
        onChange={(val) => setSelectedProject(val || "All")}
      />

      {/* Owner dropdown */}
      <OwnerFilter
        value={selectedOwner === "Anyone" ? null : selectedOwner}
        onChange={(val) => setSelectedOwner(val || "Anyone")}
      />

      {/* Filter icon */}
      <button
        type="button"
        className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
        style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
      >
        <SlidersHorizontal weight="bold" size={18} />
      </button>

      {/* Grid view icon */}
      <button
        type="button"
        className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
        style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
      >
        <SquaresFour weight="bold" size={18} />
      </button>

      {/* Search icon */}
      <button
        type="button"
        className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
        style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
      >
        <MagnifyingGlass weight="bold" size={18} />
      </button>
    </div>
  );
}
