"use client";

import {
  Heart,
  SlidersHorizontal,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { usePalette } from "@/contexts/PaletteContext";
import { useAssetsFilter } from "@/contexts/AssetsFilterContext";
import { ProjectFilter, OwnerFilter } from "@/components/FilterDropdowns";

export function SpacesFilterBar() {
  const { surfaceColors: sc } = usePalette();
  const {
    selectedProject,
    setSelectedProject,
    selectedOwner,
    setSelectedOwner,
    favoritesOnly,
    setFavoritesOnly,
  } = useAssetsFilter();

  return (
    <div className="flex items-center gap-2">
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

      {/* Advanced filters icon */}
      <button
        type="button"
        className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-fg/5"
        style={{ background: sc.button, color: "var(--surface-foreground-2)" }}
      >
        <SlidersHorizontal weight="bold" size={18} />
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
