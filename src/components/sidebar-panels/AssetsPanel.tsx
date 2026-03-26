"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MagnifyingGlass,
  Stack,
  Heart,
  Users,
  Image,
  VideoCamera,
  SpeakerHigh,
  TreeStructure,
  FilmStrip,
  Plus,
} from "@phosphor-icons/react";
import { Tooltip } from "@/components/Tooltip";
import { useSpotlight } from "@/contexts/SpotlightContext";

const assetsSectionItems = [
  { id: "all-assets", label: "All assets", icon: Stack, href: "/assets/all-assets" },
  { id: "favorites", label: "Favorites", icon: Heart, href: "/assets/favorites" },
  { id: "shared-with-me", label: "Shared with me", icon: Users, href: "/assets/shared-with-me" },
];

const typesItems = [
  { id: "image", label: "Image", icon: Image },
  { id: "video", label: "Video", icon: VideoCamera },
  { id: "audio", label: "Audio", icon: SpeakerHigh },
  { id: "spaces", label: "Spaces", icon: TreeStructure },
  { id: "video-projects", label: "Video projects", icon: FilmStrip },
];

const iconBtn = "size-7";

export function AssetsPanel() {
  const pathname = usePathname();
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const spotlight = useSpotlight();

  return (
    <>
      {/* Search */}
      <div className="px-3 pt-0 pb-2">
        <div
          className="relative cursor-pointer"
          onClick={() => spotlight?.open(sidebarSearchQuery)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              spotlight?.open(sidebarSearchQuery);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Open search"
        >
          <MagnifyingGlass
            weight="bold"
            size={12}
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50"
            style={{ color: "var(--surface-foreground-2)" }}
          />
          <input
            type="text"
            placeholder="Search"
            value={sidebarSearchQuery}
            onChange={(e) => setSidebarSearchQuery(e.target.value)}
            readOnly
            className="w-full rounded-lg border px-7 pr-16 py-1.5 text-xs outline-none transition-colors focus:border-[var(--primary)] cursor-pointer"
            style={{
              background: "transparent",
              borderColor: "var(--surface-border-alpha-0)",
              color: "var(--surface-foreground-0)",
            }}
          />
          <kbd
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded px-1 py-0.5 text-[12px] font-normal opacity-40"
            style={{
              color: "var(--surface-foreground-2)",
            }}
          >
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </div>
      </div>

      <div className="flex h-8 items-center px-3">
        <span className="text-[13px] font-medium opacity-50" style={{ color: "var(--surface-foreground-2)" }}>
          Assets
        </span>
      </div>

      <div className="mt-2 flex-1 overflow-auto px-2">
        <ul className="space-y-0.5">
          {assetsSectionItems.map(({ id, label, icon: Icon, href }) => {
            const isActive = pathname === href || (pathname === "/" && id === "all-assets");
            return (
              <li key={id}>
                <Link
                  href={href}
                  className="relative flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[14px] transition-colors"
                  style={{
                    background: isActive ? "var(--selected)" : "transparent",
                    color: "var(--surface-foreground-0)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isActive ? "var(--selected)" : "transparent";
                  }}
                >
                  <Icon weight="bold" size={14} className="shrink-0 opacity-50" />
                  <span className="truncate">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 mb-0.5 flex h-8 items-center justify-between px-3">
          <span className="text-[13px] font-medium opacity-50" style={{ color: "var(--surface-foreground-2)" }}>
            Types
          </span>
          <Tooltip content="Manage types" side="left">
            <button
              type="button"
              className={`flex shrink-0 items-center justify-center rounded-md transition-colors hover:bg-white/10 ${iconBtn}`}
              style={{ color: "var(--surface-foreground-0)" }}
              aria-label="Manage types"
            >
              <Plus weight="bold" size={14} className="shrink-0" />
            </button>
          </Tooltip>
        </div>
        <ul className="mt-1.5 space-y-0.5">
          {typesItems.map(({ id, label, icon: Icon }) => {
            const isActive = false;
            return (
              <li key={id}>
                <button
                  type="button"
                  className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[14px] transition-colors"
                  style={{
                    background: isActive ? "var(--selected)" : "transparent",
                    color: "var(--surface-foreground-0)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isActive ? "var(--selected)" : "transparent";
                  }}
                >
                  <Icon weight="bold" size={14} className="shrink-0 opacity-50" />
                  <span className="truncate">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
