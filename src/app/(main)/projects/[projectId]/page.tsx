"use client";

import { use, useMemo, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProjectsLayout, useProjectsFilter } from "@/components/ProjectsLayout";
import { AssetCard } from "@/components/AssetCard";
import { SpaceCard } from "@/components/SpaceCard";
import { usePalette } from "@/contexts/PaletteContext";
import { useCreateModal } from "@/contexts/CreateModalContext";
import { useFolder } from "@/contexts/FolderContext";
import type { Folder } from "@/contexts/FolderContext";
import { getProjectAssets, getFolderThumbnails, getFolderAssetCount, isAssetFavorite, projectPathMap } from "@/data/projectAssets";
import { allSpaces } from "@/data/spaces";
import {
  Plus,
  DotsThreeVertical,
  CaretDown,
  PencilSimple,
  FolderSimple,
} from "@phosphor-icons/react";


// Folder Card Component - matches Figma design (node 8889:51500)
function FolderCard({ name, assets, thumbnails, projectName, onDrop: onDropProp }: { name: string; assets: number; thumbnails: string[]; projectName?: string; onDrop?: (assetId: string, assetSrc: string, fromProject: string, fromFolder: string) => void }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const placeholder = "/placeholder.svg?height=100&width=100";
  const thumb1 = thumbnails[0] || placeholder;
  const thumb2 = thumbnails[1] || thumb1;
  const thumb3 = thumbnails[2] || thumb1;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      onDropProp?.(data.assetId, data.assetSrc, data.fromProject, data.fromFolder);
    } catch { /* ignore */ }
  };

  return (
    <div
      className={`group relative flex h-[200px] w-[200px] shrink-0 cursor-pointer flex-col items-start justify-end transition-all ${isDragOver ? "scale-105 ring-2 ring-blue-500/60" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Folder tab — 100px wide, 29px tall, top-left */}
      <div className="absolute left-0 top-0 h-[29px] w-[100px] rounded-tl-[12px] rounded-tr-[12px] bg-[#353535]" />
      {/* Folder body — 187px tall, full width */}
      <div className={`relative flex h-[187px] w-full flex-col gap-[10px] rounded-[12px] p-[18px] ${isDragOver ? "bg-[#333]" : "bg-[#2b2b2b]"}`}>
        {/* Image area: left col (1 tall) + right col (2 stacked) */}
        <div className="flex min-h-0 flex-1 gap-[6px]">
          <div className="relative flex-1 overflow-hidden rounded-[4px]">
            <Image src={thumb1} alt="" fill className="object-cover" unoptimized />
          </div>
          <div className="flex flex-1 flex-col gap-[6px]">
            <div className="relative flex-1 overflow-hidden rounded-[4px]">
              <Image src={thumb2} alt="" fill className="object-cover" unoptimized />
            </div>
            <div className="relative flex-1 overflow-hidden rounded-[4px]">
              <Image src={thumb3} alt="" fill className="object-cover" unoptimized />
            </div>
          </div>
        </div>
        {/* Info */}
        <div className="flex shrink-0 flex-col gap-[2px]">
          <p className="truncate text-[12px] font-semibold leading-[1.6] text-white">{name}</p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-normal leading-[1.6] tracking-[0.2px] text-[#c5c5c5]">{assets} Assets</span>
            <button
              type="button"
              className="flex size-[16px] shrink-0 items-center justify-center rounded-[4px] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/10"
            >
              <DotsThreeVertical size={12} className="text-white/70" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// Map projectId URL slug to project name
const projectIdToName: Record<string, string> = {
  "personal": "Personal",
  "product-shots": "Product Shots",
  "nike-campaign": "Nike Campaign",
  "lifestyle": "Lifestyle",
  "road-trip": "Road Trip",
};

// Spaces data per project
const projectSpaces: Record<string, { id: string; name: string; editedAt: string; thumbnails: string[] }[]> = {
  "Personal": [
    { id: "space1", name: "Portrait Series", editedAt: "12 days ago", thumbnails: ["/projects/personal/asset-01.jpg", "/projects/personal/asset-02.jpg", "/projects/personal/asset-03.jpg"] },
    { id: "space2", name: "Artistic Shots", editedAt: "12 days ago", thumbnails: ["/projects/personal/asset-04.jpg"] },
  ],
  "Product Shots": [
    { id: "space1", name: "Product Gallery", editedAt: "5 days ago", thumbnails: ["/projects/product-shots/asset-01.jpg", "/projects/product-shots/asset-02.jpg", "/projects/product-shots/asset-03.jpg"] },
  ],
  "Nike Campaign": [
    { id: "space1", name: "Sneaker Hero", editedAt: "12 days ago", thumbnails: ["/projects/nike-campaign/asset-01.jpg", "/projects/nike-campaign/asset-02.jpg", "/projects/nike-campaign/asset-03.jpg"] },
    { id: "space2", name: "Action Shots", editedAt: "12 days ago", thumbnails: ["/projects/nike-campaign/asset-04.jpg"] },
    { id: "space3", name: "Lifestyle", editedAt: "23 days ago", thumbnails: ["/projects/nike-campaign/asset-05.jpg", "/projects/nike-campaign/asset-06.jpg", "/projects/nike-campaign/asset-07.jpg"] },
  ],
  "Lifestyle": [
    { id: "space1", name: "Interior Mood", editedAt: "8 days ago", thumbnails: ["/projects/lifestyle/asset-01.jpg", "/projects/lifestyle/asset-02.jpg"] },
  ],
  "Road Trip": [
    { id: "space1", name: "Best Shots", editedAt: "3 days ago", thumbnails: ["/projects/road-trip/asset-01.jpg", "/projects/road-trip/asset-02.jpg", "/projects/road-trip/asset-03.jpg"] },
    { id: "space2", name: "Landscapes", editedAt: "3 days ago", thumbnails: ["/projects/road-trip/asset-04.jpg", "/projects/road-trip/asset-05.jpg"] },
  ],
};

// Helper to find folder and its children recursively
function findFolder(folders: Folder[], folderName: string): Folder | null {
  for (const folder of folders) {
    if (folder.name === folderName) return folder;
    if (folder.children) {
      const found = findFolder(folder.children, folderName);
      if (found) return found;
    }
  }
  return null;
}

// Extract original asset index from ID (format: "projectPath-num")
function getAssetOriginalIndex(assetId: string): { path: string; index: number } | null {
  const lastDash = assetId.lastIndexOf("-");
  if (lastDash < 0) return null;
  const path = assetId.substring(0, lastDash);
  const num = parseInt(assetId.substring(lastDash + 1), 10);
  if (isNaN(num)) return null;
  return { path, index: num - 1 }; // asset-01 = index 0
}

// Assets grid that filters by favoritesOnly from the header
function FilteredAssets({ assets, projectPath, altText, projectName, folderName }: { assets: ReturnType<typeof getProjectAssets>; projectPath: string | null; altText: string; projectName?: string; folderName?: string }) {
  const { favoritesOnly } = useProjectsFilter();

  const assetsWithFav = useMemo(() => {
    return assets.map((asset) => {
      const orig = getAssetOriginalIndex(asset.id);
      const fav = orig ? isAssetFavorite(orig.path, orig.index) : false;
      return { ...asset, isFavorite: fav };
    });
  }, [assets]);

  const filtered = useMemo(() => {
    if (!favoritesOnly) return assetsWithFav;
    return assetsWithFav.filter((a) => a.isFavorite);
  }, [assetsWithFav, favoritesOnly]);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {filtered.map((asset) => (
        <AssetCard
          key={asset.id}
          src={asset.src}
          alt={altText}
          assetId={asset.id}
          projectName={projectName}
          folderName={folderName}
          isFavorite={asset.isFavorite}
        />
      ))}
    </div>
  );
}

// Main page component wrapped with Suspense for useSearchParams
export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  return (
    <Suspense fallback={<ProjectsLayout title="Loading..." simpleHeader><div className="flex items-center justify-center py-20"><p className="text-fg/50">Loading...</p></div></ProjectsLayout>}>
      <ProjectDetailContent params={params} />
    </Suspense>
  );
}

function ProjectDetailContent({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { surfaceColors: sc } = usePalette();
  const createModal = useCreateModal();
  const { projects, movedAssets, moveAsset } = useFolder();
  const [isDragOverRoot, setIsDragOverRoot] = useState(false);
  
  // Get folder from URL query param
  const currentFolderName = searchParams.get("folder") || "";
  
  // Get project name from URL slug
  const projectName = projectIdToName[projectId];
  const project = projects.find(p => p.name === projectName);
  const projectPath = projectName ? projectPathMap[projectName] : null;
  
  // Find current folder object if we're in a folder view
  const currentFolder = currentFolderName && project 
    ? findFolder(project.folders, currentFolderName) 
    : null;
  
  // Get assets for this project/folder from shared data, accounting for moves
  const assets = useMemo(() => {
    if (!projectName) return [];
    const baseAssets = getProjectAssets(projectName, currentFolderName);
    // Filter out assets that have been moved away from this location
    const remaining = baseAssets.filter(asset => {
      const moved = movedAssets[asset.id];
      if (!moved) return true; // not moved, stays in original location
      // If moved, only show if it was moved TO this exact location
      return moved.projectName === projectName && moved.folder === (currentFolderName || "");
    });
    // Add assets moved TO this location from elsewhere
    const movedHere = Object.entries(movedAssets)
      .filter(([, loc]) => loc.projectName === projectName && loc.folder === (currentFolderName || ""))
      .map(([assetId]) => assetId);
    // Find assets moved here that aren't already in baseAssets
    const existingIds = new Set(baseAssets.map(a => a.id));
    const extraAssets = movedHere
      .filter(id => !existingIds.has(id))
      .map(id => {
        // Reconstruct asset info from the ID (format: "projectPath-num")
        const lastDash = id.lastIndexOf("-");
        const origPath = id.substring(0, lastDash);
        const num = id.substring(lastDash + 1);
        return {
          id,
          src: `/projects/${origPath}/asset-${num.padStart(2, "0")}.jpg`,
          folder: currentFolderName || "",
          projectName,
          projectPath: projectPathMap[projectName] || "",
        };
      });
    return [...remaining, ...extraAssets];
  }, [projectName, currentFolderName, movedAssets]);

  // Drop handler for folders and root
  const handleFolderDrop = (folderName: string) => (assetId: string) => {
    if (projectName) {
      moveAsset(assetId, projectName, folderName);
    }
  };

  const handleRootDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOverRoot(true);
  };

  const handleRootDragLeave = () => {
    setIsDragOverRoot(false);
  };

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverRoot(false);
    if (!projectName) return;
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === "space") {
        moveSpace(data.spaceId, projectName);
      } else {
        moveAsset(data.assetId, projectName, currentFolderName || "");
      }
    } catch { /* ignore */ }
  };
  
  // Get spaces for this project (only show on project root, not in folders)
  // Filter out spaces moved away, include spaces moved here
  const { movedSpaces, moveSpace } = useFolder();
  const baseSpaces = !currentFolderName && projectName ? projectSpaces[projectName] || [] : [];
  const spacesMovedAway = baseSpaces.filter(s => movedSpaces[s.id] && movedSpaces[s.id] !== projectName);
  const spacesMovedHere = !currentFolderName ? allSpaces.filter(s => movedSpaces[s.id] === projectName && !baseSpaces.some(bs => bs.id === s.id)) : [];
  const spaces = [...baseSpaces.filter(s => !spacesMovedAway.some(sa => sa.id === s.id)), ...spacesMovedHere];
  

  
  // Handle folder click - navigate to folder view
  const handleFolderClick = (folderName: string) => {
    router.push(`/projects/${projectId}?folder=${encodeURIComponent(folderName)}`);
  };
  
  // Handle back to project root
  const handleBackToProject = () => {
    router.push(`/projects/${projectId}`);
  };
  
  if (!project || !projectName) {
    return (
      <ProjectsLayout title="Project not found" simpleHeader>
        <div className="flex items-center justify-center py-20">
          <p className="text-fg/50">Project not found</p>
        </div>
      </ProjectsLayout>
    );
  }

  // Folder View - when a folder is selected
  if (currentFolderName) {
    return (
      <ProjectsLayout title={project.name} projectDetailHeader>
        <div className="flex flex-col gap-6">
          {/* Subfolders - if current folder has children */}
          {currentFolder?.children && currentFolder.children.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-[14px] font-medium text-fg">Folders</span>
                <span className="text-[13px] text-fg/50">({currentFolder.children.length})</span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {currentFolder.children.map((subfolder) => (
                  <div key={subfolder.name} onClick={() => handleFolderClick(subfolder.name)}>
                    <FolderCard
                      name={subfolder.name}
                      assets={getFolderAssetCount(projectName, subfolder.name)}
                      thumbnails={getFolderThumbnails(projectName, subfolder.name)}
                      projectName={projectName}
                      onDrop={(assetId) => handleFolderDrop(subfolder.name)(assetId)}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Assets in this folder — drop zone */}
          <section
            onDragOver={handleRootDragOver}
            onDragLeave={handleRootDragLeave}
            onDrop={handleRootDrop}
            className={`rounded-xl transition-colors ${isDragOverRoot ? "bg-blue-500/10 ring-2 ring-blue-500/30" : ""}`}
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[14px] font-medium text-fg">Assets</span>
              <span className="text-[13px] text-fg/50">({assets.length})</span>
            </div>
            {assets.length > 0 ? (
              <FilteredAssets assets={assets} projectPath={projectPath} altText={`${project.name} - ${currentFolderName}`} projectName={projectName} folderName={currentFolderName} />
            ) : (
              <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed py-16 ${isDragOverRoot ? "border-blue-500/40" : "border-fg/10"}`}>
                <FolderSimple weight="thin" size={48} className="text-fg/20" />
                <p className="mt-3 text-[14px] text-fg/50">{isDragOverRoot ? "Drop asset here" : "No assets in this folder"}</p>
                <p className="mt-1 text-[12px] text-fg/30">Upload or generate assets to get started</p>
              </div>
            )}
          </section>
        </div>
      </ProjectsLayout>
    );
  }

  // Project Overview - show folders, spaces, and all assets
  return (
    <ProjectsLayout title={project.name} projectDetailHeader>
      <div className="flex flex-col gap-8">
        {/* Folders Section */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-[14px] font-medium text-fg">Folders</span>
            <span className="text-[13px] text-fg/50">({project.folders.length})</span>
            <CaretDown weight="bold" size={12} className="text-fg/50" />
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {project.folders.map((folder) => (
              <div key={folder.name} onClick={() => handleFolderClick(folder.name)}>
                <FolderCard
                  name={folder.name}
                  assets={getFolderAssetCount(projectName, folder.name)}
                  thumbnails={getFolderThumbnails(projectName, folder.name)}
                  projectName={projectName}
                  onDrop={(assetId) => handleFolderDrop(folder.name)(assetId)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Spaces Section */}
        {spaces.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[14px] font-medium text-fg">Spaces</span>
              <span className="text-[13px] text-fg/50">({spaces.length})</span>
              <CaretDown weight="bold" size={12} className="text-fg/50" />
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
              {spaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  spaceId={space.id}
                  projectName={projectName}
                  name={space.name}
                  editedAt={space.editedAt}
                  thumbnails={space.thumbnails}
                  isFavorite={allSpaces.find(s => s.id === space.id)?.isFavorite}
                />
              ))}
            </div>
          </section>
        )}

        {/* Assets Section — drop zone */}
        <section
          onDragOver={handleRootDragOver}
          onDragLeave={handleRootDragLeave}
          onDrop={handleRootDrop}
          className={`rounded-xl p-2 transition-colors ${isDragOverRoot ? "bg-blue-500/10 ring-2 ring-blue-500/30" : ""}`}
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="text-[14px] font-medium text-fg">Assets</span>
            <span className="text-[13px] text-fg/50">({assets.length})</span>
            <CaretDown weight="bold" size={12} className="text-fg/50" />
          </div>
          <FilteredAssets assets={assets} projectPath={projectPath} altText={project.name} projectName={projectName} folderName="" />
        </section>
      </div>
    </ProjectsLayout>
  );
}
