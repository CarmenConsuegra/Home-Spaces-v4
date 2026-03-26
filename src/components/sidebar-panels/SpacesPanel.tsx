"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  SquaresFour,
  Browsers,
  UsersThree,
  Plus,
} from "@phosphor-icons/react";
import { Tooltip } from "@/components/Tooltip";
import { useSpotlight } from "@/contexts/SpotlightContext";

const spacesItems = [
  { id: "all-spaces", label: "All Spaces", icon: SquaresFour },
  { id: "templates", label: "Templates", icon: Browsers },
  { id: "shared-with-me", label: "Shared with me", icon: UsersThree },
];

const recentSpaces = [
  { id: "space-1", label: "Product showcase", thumbnail: "bg-gradient-to-br from-blue-400 via-indigo-400 to-violet-500" },
  { id: "space-2", label: "Virtual gallery", thumbnail: "bg-gradient-to-br from-emerald-400 to-teal-600" },
  { id: "space-3", label: "Game environment", thumbnail: "bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500" },
];

const iconBtn = "size-7";

export function SpacesPanel() {
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const spotlight = useSpotlight();
  const router = useRouter();

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
          Spaces
        </span>
        <Tooltip content="New space" side="left">
          <button
            type="button"
            className={`flex shrink-0 items-center justify-center rounded-md transition-colors hover:bg-white/10 ${iconBtn}`}
            style={{ color: "var(--surface-foreground-0)" }}
            aria-label="New space"
            onClick={() => router.push("/spaces/new")}
          >
            <Plus weight="bold" size={14} className="shrink-0" />
          </button>
        </Tooltip>
      </div>

      <div className="mt-2 flex-1 overflow-auto px-2">
        <ul className="space-y-0.5">
          {spacesItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
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
                <Icon weight="bold" size={14} className="shrink-0 opacity-50" />
                <span className="truncate">{label}</span>
              </button>
            </li>
          ))}
        </ul>

        <h2
          className="mb-0.5 mt-4 flex h-8 items-center px-1 text-[13px] font-medium opacity-50"
          style={{ color: "var(--surface-foreground-2)" }}
        >
          Recent spaces
        </h2>
        <ul className="mt-1.5 space-y-0.5">
          {recentSpaces.map(({ id, label, thumbnail }) => (
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
