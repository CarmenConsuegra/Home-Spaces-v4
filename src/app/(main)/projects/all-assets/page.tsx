"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { CaretDown } from "@phosphor-icons/react";
import { ProjectsLayout } from "@/components/ProjectsLayout";
import { AssetCard } from "@/components/AssetCard";
import { SpaceCard } from "@/components/SpaceCard";
import { usePalette } from "@/contexts/PaletteContext";
import { useAssetsFilter } from "@/contexts/AssetsFilterContext";
import { allSpaces } from "@/data/spaces";
import { getProjectAssets, isAssetFavorite } from "@/data/projectAssets";

// Owner to project mapping
const projectOwnerMap: Record<string, string> = {
  "Personal": "Alvaro Castañeda",
  "Team project": "Martin LeBlanc",
  "Nike Campaign": "Adrián Fernández",
  "Lifestyle": "Leandro Bos",
  "Road Trip": "Alvaro Castañeda",
};

export default function AllAssetsPage() {
  const { surfaceColors: sc } = usePalette();
  const { selectedProject, selectedOwner, favoritesOnly } = useAssetsFilter();
  const [spacesExpanded, setSpacesExpanded] = useState(true);
  const [assetsExpanded, setAssetsExpanded] = useState(true);

  // Filter spaces based on selected project, owner, and favorites
  const filteredSpaces = useMemo(() => {
    let spaces = allSpaces;

    if (selectedProject !== "All") {
      spaces = spaces.filter(space => space.projectName === selectedProject);
    }

    if (selectedOwner !== "Anyone") {
      spaces = spaces.filter(space => space.owner === selectedOwner);
    }

    if (favoritesOnly) {
      spaces = spaces.filter(space => space.isFavorite);
    }

    return spaces;
  }, [selectedProject, selectedOwner, favoritesOnly]);

  // Get all assets using the shared data function
  const allAssets = useMemo(() => {
    // Get all projects' assets with owner info
    const projectNames = Object.keys(projectOwnerMap);
    return projectNames.flatMap((projectName) => {
      const assets = getProjectAssets(projectName, "");
      const owner = projectOwnerMap[projectName];
      return assets.map((asset, index) => ({
        ...asset,
        owner,
        isFavorite: asset.projectPath ? isAssetFavorite(asset.projectPath, index) : false,
      }));
    });
  }, []);
  
  // Filter assets based on selected project, owner, and favorites
  const filteredAssets = useMemo(() => {
    let assets = allAssets;
    
    // Filter by project
    if (selectedProject !== "All") {
      assets = assets.filter(asset => asset.projectName === selectedProject);
    }
    
    // Filter by owner
    if (selectedOwner !== "Anyone") {
      assets = assets.filter(asset => asset.owner === selectedOwner);
    }
    
    // Filter by favorites
    if (favoritesOnly) {
      assets = assets.filter(asset => asset.isFavorite);
    }
    
    return assets;
  }, [allAssets, selectedProject, selectedOwner, favoritesOnly]);

  return (
    <ProjectsLayout title="All assets" assetsHeader>
      <div className="flex flex-col gap-8">
        {/* Spaces Section */}
        <section>
          <button
            type="button"
            onClick={() => setSpacesExpanded(!spacesExpanded)}
            className="mb-4 flex items-center gap-2 text-[14px] font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--surface-foreground-0)" }}
          >
            <span>Spaces</span>
            <span className="text-[13px] font-normal" style={{ color: "var(--surface-foreground-2)" }}>({filteredSpaces.length})</span>
            <CaretDown
              weight="bold"
              size={12}
              className={`transition-transform ${spacesExpanded ? "rotate-0" : "-rotate-90"}`}
              style={{ color: "var(--surface-foreground-2)" }}
            />
          </button>

          {spacesExpanded && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
              {filteredSpaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  name={space.name}
                  editedAt={space.editedAt}
                  thumbnails={space.thumbnails}
                  isFavorite={space.isFavorite}
                />
              ))}
            </div>
          )}
        </section>

        {/* Assets Section */}
        <section>
          <button
            type="button"
            onClick={() => setAssetsExpanded(!assetsExpanded)}
            className="mb-4 flex items-center gap-2 text-[14px] font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--surface-foreground-0)" }}
          >
            <span>Assets</span>
            <span className="text-[13px] font-normal" style={{ color: "var(--surface-foreground-2)" }}>({filteredAssets.length})</span>
            <CaretDown
              weight="bold"
              size={12}
              className={`transition-transform ${assetsExpanded ? "rotate-0" : "-rotate-90"}`}
              style={{ color: "var(--surface-foreground-2)" }}
            />
          </button>

          {assetsExpanded && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  src={asset.src}
                  alt={asset.projectName}
                  projectName={asset.projectName}
                  isFavorite={asset.isFavorite}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </ProjectsLayout>
  );
}
