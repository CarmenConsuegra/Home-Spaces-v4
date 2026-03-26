"use client";

import { useState } from "react";
import {
  MagnifyingGlass,
  Lightbulb,
  Image,
  PaintBrush,
  GridFour,
  Star,
  TShirt,
  Play,
  File,
  Layout,
  TextT,
  SpeakerHigh,
  Plus,
} from "@phosphor-icons/react";
import { Tooltip } from "@/components/Tooltip";
import { useSpotlight } from "@/contexts/SpotlightContext";

const stockItems = [
  { id: "featured", label: "Featured", icon: Lightbulb },
  { id: "photos", label: "Photos", icon: Image },
  { id: "illustrations", label: "Illustrations", icon: PaintBrush },
  { id: "vectors", label: "Vectors", icon: GridFour },
  { id: "icons", label: "Icons", icon: Star },
  { id: "mockups", label: "Mockups", icon: TShirt },
  { id: "videos", label: "Videos", icon: Play },
  { id: "psds", label: "PSD's", icon: File },
  { id: "designs", label: "Designs", icon: Layout },
  { id: "fonts", label: "Fonts", icon: TextT },
  { id: "audio", label: "Audio", icon: SpeakerHigh },
];

const myCollectionsItems = [
  { id: "brand-assets", label: "Brand assets", thumbnail: "bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300" },
  { id: "product-mockups", label: "Product mockups", thumbnail: "bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300" },
  { id: "bw-portraits", label: "Black and white portrai...", thumbnail: "bg-gradient-to-br from-gray-300 to-gray-500" },
  { id: "backgrounds", label: "Backgrounds", thumbnail: "bg-gradient-to-br from-blue-300 via-indigo-300 to-purple-300" },
];

const iconBtn = "size-7";

export function StockPanel() {
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

      <div className="flex h-8 items-center justify-between px-3">
        <span className="text-[13px] font-medium opacity-50" style={{ color: "var(--surface-foreground-2)" }}>
          Stock
        </span>
      </div>

      <div className="mt-2 flex-1 overflow-auto px-2">
        <ul className="space-y-0.5">
          {stockItems.map(({ id, label, icon: Icon }) => {
            const isActive = id === "featured";
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
        <div className="mt-2 mb-0.5 flex h-8 items-center justify-between px-1">
          <span className="text-[13px] font-medium opacity-50" style={{ color: "var(--surface-foreground-2)" }}>
            My collections
          </span>
          <Tooltip content="New collection" side="left">
            <button
              type="button"
              className={`flex shrink-0 items-center justify-center rounded-md transition-colors hover:bg-white/10 ${iconBtn}`}
              style={{ color: "var(--surface-foreground-0)" }}
              aria-label="Add collection"
            >
              <Plus weight="bold" size={14} className="shrink-0" />
            </button>
          </Tooltip>
        </div>
        <ul className="mt-1.5 space-y-0.5">
          {myCollectionsItems.map(({ id, label, thumbnail }) => (
            <li key={id}>
              <button
                type="button"
                className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[13px] transition-colors hover:bg-white/5"
                style={{ color: "var(--surface-foreground-0)" }}
              >
                <span
                  className={`size-5 shrink-0 rounded-md opacity-80 ${thumbnail}`}
                  aria-hidden
                />
                <span className="truncate">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
