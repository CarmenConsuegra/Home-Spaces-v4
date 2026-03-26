"use client";

import { useState } from "react";
import {
  MagnifyingGlass,
  Copy,
  Sparkle,
} from "@phosphor-icons/react";
import { useSpotlight } from "@/contexts/SpotlightContext";

const recentItems = [
  { id: "recent-1", label: "Product photo shoot", thumbnail: "bg-gradient-to-br from-blue-400 via-indigo-400 to-violet-500" },
  { id: "recent-2", label: "Brand campaign video", thumbnail: "bg-gradient-to-br from-emerald-400 to-teal-600" },
  { id: "recent-3", label: "Podcast intro music", thumbnail: "bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500" },
  { id: "recent-4", label: "Social media assets", thumbnail: "bg-gradient-to-br from-amber-400 to-yellow-500" },
];

export function AppsPanel() {
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

      <div className="mt-2 flex-1 overflow-auto px-2">
        {/* All templates */}
        <button
          type="button"
          className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[14px] transition-colors"
          style={{
            background: "transparent",
            color: "var(--surface-foreground-0)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Sparkle weight="bold" size={14} className="shrink-0 opacity-50" />
          <span className="truncate">All templates</span>
        </button>

        {/* My templates */}
        <button
          type="button"
          className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[14px] transition-colors"
          style={{
            background: "transparent",
            color: "var(--surface-foreground-0)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Copy weight="bold" size={14} className="shrink-0 opacity-50" />
          <span className="truncate">My templates</span>
        </button>

        <h2
          className="mb-0.5 mt-2 flex h-8 items-center px-1 text-[13px] font-medium opacity-50"
          style={{ color: "var(--surface-foreground-2)" }}
        >
          Recents
        </h2>
        <ul className="mt-1.5 space-y-0.5 mb-2">
          {recentItems.map(({ id, label, thumbnail }) => (
            <li key={id}>
              <button
                type="button"
                className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[13px] transition-colors hover:bg-white/5"
                style={{ color: "var(--surface-foreground-2)" }}
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
