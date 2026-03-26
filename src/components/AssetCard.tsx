"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  DotsThree,
  Trash,
  DownloadSimple,
  Copy,
  Export,
  Globe,
  BookmarkSimple,
  CaretRight,
  PencilSimple,
  CaretDown,
} from "@phosphor-icons/react";
import { MoveAssetModal } from "./MoveAssetModal";

interface AssetCardProps {
  src: string;
  alt?: string;
  projectName?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function AssetCard({
  src,
  alt = "Asset",
  projectName,
  isFavorite = false,
  onToggleFavorite,
}: AssetCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const [moveModalOpen, setMoveModalOpen] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    onToggleFavorite?.();
  };

  const handleMoveAsset = (projectId: string, folderId?: string) => {
    console.log("Moving asset to:", projectId, folderId);
    // In a real app, this would move the asset
  };

  const menuItems = [
    { icon: Copy, label: "Copy prompt", action: () => {} },
    { icon: Export, label: "Move asset", action: () => { setMenuOpen(false); setMoveModalOpen(true); } },
    { icon: Globe, label: "Publish", action: () => {} },
    { icon: Export, label: "Export metadata", hasSubmenu: true, action: () => {} },
    { icon: BookmarkSimple, label: "Save as template", action: () => {} },
  ];

  return (
    <>
      <div
        className={`group relative rounded-xl ${menuOpen ? "z-50" : ""} ${isHovered && !menuOpen ? "overflow-hidden" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setMenuOpen(false); }}
      >
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Favorite icon - always visible when favorited */}
        {favorite && !isHovered && (
          <button
            type="button"
            onClick={handleToggleFavorite}
            className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors"
          >
            <Heart weight="fill" size={14} className="text-white" />
          </button>
        )}

        {/* Hover overlay */}
        {isHovered && (
          <>
            {/* Top-left checkbox */}
            <div className="absolute left-2 top-2">
              <div className="flex size-5 items-center justify-center rounded border-2 border-white/60 bg-black/30 backdrop-blur-sm transition-colors hover:border-white hover:bg-black/50">
                {/* Checkbox would go here */}
              </div>
            </div>

            {/* Top-right action icons */}
            <div className="absolute right-2 top-2 flex items-center gap-1">
              {/* 3-dot menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                  className="flex size-7 items-center justify-center rounded-full bg-white/90 text-neutral-700 backdrop-blur-sm transition-colors hover:bg-white"
                >
                  <DotsThree weight="bold" size={16} />
                </button>

                {/* Dropdown menu */}
                {menuOpen && (
                  <div
                    className="absolute left-0 top-full z-[100] mt-1 w-48 rounded-xl border border-neutral-200 bg-white py-1.5 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {menuItems.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={item.action}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] text-neutral-700 transition-colors hover:bg-neutral-100"
                      >
                        <item.icon weight="regular" size={18} />
                        <span className="flex-1">{item.label}</span>
                        {item.hasSubmenu && <CaretRight weight="bold" size={14} className="text-neutral-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Trash */}
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="flex size-7 items-center justify-center rounded-full bg-white/90 text-neutral-700 backdrop-blur-sm transition-colors hover:bg-white"
              >
                <Trash weight="regular" size={16} />
              </button>

              {/* Download */}
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="flex size-7 items-center justify-center rounded-full bg-white/90 text-neutral-700 backdrop-blur-sm transition-colors hover:bg-white"
              >
                <DownloadSimple weight="regular" size={16} />
              </button>

              {/* Favorite */}
              <button
                type="button"
                onClick={handleToggleFavorite}
                className="flex size-7 items-center justify-center rounded-full bg-white/90 text-neutral-700 backdrop-blur-sm transition-colors hover:bg-white"
              >
                <Heart weight={favorite ? "fill" : "regular"} size={16} className={favorite ? "text-red-500" : ""} />
              </button>
            </div>

            {/* Bottom section */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-2">
              {/* Left side - avatar */}
              <div className="flex items-center gap-1.5">
                <div className="flex size-6 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-indigo-500 to-purple-600 text-[8px] font-semibold text-white">
                  JD
                </div>
              </div>

              {/* Right side - Edit and Use buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <PencilSimple weight="bold" size={14} />
                </button>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-8 items-center gap-1 rounded-full bg-neutral-800 px-3 text-[12px] font-medium text-white transition-colors hover:bg-neutral-700"
                >
                  Use
                  <CaretDown weight="bold" size={10} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Move Asset Modal */}
      <MoveAssetModal
        isOpen={moveModalOpen}
        onClose={() => setMoveModalOpen(false)}
        onMove={handleMoveAsset}
        assetName={alt}
      />
    </>
  );
}
