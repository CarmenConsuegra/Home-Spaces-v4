"use client";

import { useMemo } from "react";
import { ProjectsLayout } from "@/components/ProjectsLayout";
import { AssetCard } from "@/components/AssetCard";
import { useAssetsFilter } from "@/contexts/AssetsFilterContext";

// Uploaded assets — 2 per project = 10 total
// Derived from uploadedAssetIndices in projectAssets.ts
const uploadedAssets = [
  // Personal - indices 2, 7
  { src: "/projects/personal/asset-03.jpg", project: "Personal", owner: "Alvaro Castañeda" },
  { src: "/projects/personal/asset-08.jpg", project: "Personal", owner: "Alvaro Castañeda" },
  // Product Shots - indices 0, 4
  { src: "/projects/product-shots/asset-01.jpg", project: "Product Shots", owner: "Martin LeBlanc" },
  { src: "/projects/product-shots/asset-05.jpg", project: "Product Shots", owner: "Martin LeBlanc" },
  // Nike Campaign - indices 3, 8
  { src: "/projects/nike-campaign/asset-04.jpg", project: "Nike Campaign", owner: "Adrián Fernández" },
  { src: "/projects/nike-campaign/asset-09.jpg", project: "Nike Campaign", owner: "Adrián Fernández" },
  // Lifestyle - indices 1, 5
  { src: "/projects/lifestyle/asset-02.jpg", project: "Lifestyle", owner: "Leandro Bos" },
  { src: "/projects/lifestyle/asset-06.jpg", project: "Lifestyle", owner: "Leandro Bos" },
  // Road Trip - indices 0, 6
  { src: "/projects/road-trip/asset-01.jpg", project: "Road Trip", owner: "Alvaro Castañeda" },
  { src: "/projects/road-trip/asset-07.jpg", project: "Road Trip", owner: "Alvaro Castañeda" },
];

export default function UploadsPage() {
  const { selectedProject, selectedOwner } = useAssetsFilter();

  const filtered = useMemo(() => {
    let assets = uploadedAssets;
    if (selectedProject !== "All") assets = assets.filter(a => a.project === selectedProject);
    if (selectedOwner !== "Anyone") assets = assets.filter(a => a.owner === selectedOwner);
    return assets;
  }, [selectedProject, selectedOwner]);

  return (
    <ProjectsLayout title="Uploads" assetsHeader>
      <div className="flex flex-col gap-4">
        <p className="text-[13px] text-fg/50">{filtered.length} uploaded asset{filtered.length !== 1 ? "s" : ""}</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((asset, i) => (
            <AssetCard
              key={i}
              src={asset.src}
              alt={asset.project}
              projectName={asset.project}
            />
          ))}
        </div>
      </div>
    </ProjectsLayout>
  );
}
