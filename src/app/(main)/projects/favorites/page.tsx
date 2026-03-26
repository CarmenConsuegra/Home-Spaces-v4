"use client";

import { useMemo } from "react";
import { ProjectsLayout } from "@/components/ProjectsLayout";
import { AssetCard } from "@/components/AssetCard";
import { SpaceCard } from "@/components/SpaceCard";
import { useAssetsFilter } from "@/contexts/AssetsFilterContext";
import { allSpaces } from "@/data/spaces";

// Favorite assets from all projects (2 per project = 10 total)
const favoriteAssets = [
  // Personal - indices 1, 6
  { src: "/projects/personal/asset-02.jpg", project: "Personal", owner: "Alvaro Castañeda" },
  { src: "/projects/personal/asset-07.jpg", project: "Personal", owner: "Alvaro Castañeda" },
  // Product Shots - indices 2, 7
  { src: "/projects/product-shots/asset-03.jpg", project: "Product Shots", owner: "Martin LeBlanc" },
  { src: "/projects/product-shots/asset-08.jpg", project: "Product Shots", owner: "Martin LeBlanc" },
  // Nike Campaign - indices 0, 5
  { src: "/projects/nike-campaign/asset-01.jpg", project: "Nike Campaign", owner: "Adrián Fernández" },
  { src: "/projects/nike-campaign/asset-06.jpg", project: "Nike Campaign", owner: "Adrián Fernández" },
  // Lifestyle - indices 3, 8
  { src: "/projects/lifestyle/asset-04.jpg", project: "Lifestyle", owner: "Leandro Bos" },
  { src: "/projects/lifestyle/asset-09.jpg", project: "Lifestyle", owner: "Leandro Bos" },
  // Road Trip - indices 1, 4
  { src: "/projects/road-trip/asset-02.jpg", project: "Road Trip", owner: "Alvaro Castañeda" },
  { src: "/projects/road-trip/asset-05.jpg", project: "Road Trip", owner: "Alvaro Castañeda" },
];

export default function FavoritesPage() {
  const { selectedProject, selectedOwner } = useAssetsFilter();

  const filteredSpaces = useMemo(() => {
    let spaces = allSpaces.filter(s => s.isFavorite);
    if (selectedProject !== "All") spaces = spaces.filter(s => s.projectName === selectedProject);
    if (selectedOwner !== "Anyone") spaces = spaces.filter(s => s.owner === selectedOwner);
    return spaces;
  }, [selectedProject, selectedOwner]);

  const filteredAssets = useMemo(() => {
    let assets = favoriteAssets;
    if (selectedProject !== "All") assets = assets.filter(a => a.project === selectedProject);
    if (selectedOwner !== "Anyone") assets = assets.filter(a => a.owner === selectedOwner);
    return assets;
  }, [selectedProject, selectedOwner]);

  return (
    <ProjectsLayout title="Favorites" assetsHeader hideFavoritesFilter>
      <div className="flex flex-col gap-8">
        {/* Spaces */}
        {filteredSpaces.length > 0 && (
          <section className="flex flex-col gap-4">
            <p className="text-[13px] text-fg/50">{filteredSpaces.length} favorited space{filteredSpaces.length !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
              {filteredSpaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  name={space.name}
                  editedAt={space.editedAt}
                  thumbnails={space.thumbnails}
                  isFavorite={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Assets */}
        <section className="flex flex-col gap-4">
          <p className="text-[13px] text-fg/50">{filteredAssets.length} favorited asset{filteredAssets.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredAssets.map((asset, i) => (
              <AssetCard
                key={i}
                src={asset.src}
                alt={asset.project}
                projectName={asset.project}
                isFavorite={true}
              />
            ))}
          </div>
        </section>
      </div>
    </ProjectsLayout>
  );
}
