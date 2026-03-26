"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MagnifyingGlass,
  Lightbulb,
  GraduationCap,
  Globe,
} from "@phosphor-icons/react";
import { useSpotlight } from "@/contexts/SpotlightContext";

const homeItems = [
  { id: "get-started", label: "Get started", icon: Lightbulb, href: "/home/get-started" },
  { id: "learn", label: "Academy", icon: GraduationCap, href: "/home/learn" },
  { id: "community", label: "Community", icon: Globe, href: "/home/community" },
];

const recentsItems = [
  { id: "personal", label: "Personal", thumbnail: "bg-gradient-to-br from-emerald-300 via-cyan-300 to-rose-300" },
  { id: "marketing", label: "Marketing", thumbnail: "bg-gradient-to-br from-sky-400 to-blue-600" },
  { id: "nike", label: "Nike", thumbnail: "bg-gradient-to-br from-rose-400 via-orange-300 to-emerald-300" },
];

export function HomePanel() {
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
          Home
        </span>
      </div>

      <div className="mt-2 flex-1 overflow-auto px-2">
        <ul className="space-y-0.5">
          {homeItems.map(({ id, label, icon: Icon, href }) => {
            const isActive = pathname === href || (pathname === "/home" && id === "get-started");
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
        <h2 className="mb-0.5 mt-2 flex h-8 items-center text-[13px] font-medium opacity-50" style={{ color: "var(--surface-foreground-2)" }}>
          Recent projects
        </h2>
        <ul className="mt-1.5 space-y-0.5">
          {recentsItems.map(({ id, label, thumbnail }) => (
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
