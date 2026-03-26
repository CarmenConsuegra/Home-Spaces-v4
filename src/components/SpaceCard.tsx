"use client";

import { useState } from "react";
import Image from "next/image";
import { PencilSimple, Heart } from "@phosphor-icons/react";

interface SpaceCardProps {
  name: string;
  editedAt: string;
  thumbnails: string[];
  isFavorite?: boolean;
  spaceId?: string;
  projectName?: string;
}

export function SpaceCard({ name, editedAt, thumbnails, isFavorite = false, spaceId, projectName }: SpaceCardProps) {
  const thumb = thumbnails[0];
  const [favorite, setFavorite] = useState(isFavorite);

  return (
    <div
      className="group cursor-pointer"
      draggable={!!spaceId}
      onDragStart={(e) => {
        if (!spaceId) return;
        e.dataTransfer.setData("application/json", JSON.stringify({
          type: "space",
          spaceId,
          spaceName: name,
          fromProject: projectName || "",
        }));
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      <div className="relative aspect-square overflow-hidden rounded-[12px] bg-[#2b2b2b]">
        {thumb && (
          <Image
            src={thumb}
            alt={name}
            fill
            className="object-cover"
            unoptimized
          />
        )}

        {/* Filled heart — always visible when favorited and not hovered */}
        {favorite && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setFavorite(false); }}
            className="absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors group-hover:opacity-0"
          >
            <Heart weight="fill" size={13} />
          </button>
        )}

        {/* Heart toggle — visible on hover */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setFavorite(!favorite); }}
          className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full bg-white/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          <Heart
            weight={favorite ? "fill" : "regular"}
            size={14}
            className={favorite ? "text-red-500" : "text-neutral-700"}
          />
        </button>

        {/* Editor badge — bottom-left, visible on hover */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
          <PencilSimple weight="bold" size={12} className="text-[#0d0d0d]" />
          <span className="text-[11px] font-medium text-[#0d0d0d]">Editor</span>
        </div>
      </div>
      <h3 className="mt-2 truncate text-[14px] text-fg">{name}</h3>
      <p className="text-[12px] text-fg/50">{editedAt}</p>
    </div>
  );
}
