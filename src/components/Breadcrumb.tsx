"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DotsThree } from "@phosphor-icons/react";
import { useFolder } from "@/contexts/FolderContext";
import { useTool } from "@/contexts/ToolContext";

type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

const sectionLabels: Record<string, string> = {
  "/": "Assets",
  "/home": "Home",
  "/apps": "AI Suite",
  "/ai-suite": "AI Suite",
  "/video": "Video",
  "/audio": "Audio",
  "/3d": "3D",
  "/stock": "Stock",
  "/projects": "Work",
  "/spaces": "Spaces",
  "/academy": "Academy",
};

const assetLabels: Record<string, string> = {
  "/assets/all-assets": "All assets",
  "/assets/favorites": "Favorites",
  "/assets/shared-with-me": "Shared with me",
};

const homeLabels: Record<string, string> = {
  "/home/get-started": "Get started",
  "/home/learn": "Academy",
  "/home/community": "Community",
};

const folderLabels: Record<string, string> = {
  "/projects": "Work",
  "/projects/all-projects": "All projects",
  "/projects/all-assets": "All assets",
  "/projects/my-assets": "All assets",
  "/projects/shared-with-me": "Shared with me",
  "/projects/templates": "Templates",
  "/projects/references": "References",
  "/projects/uploads": "Uploads",
  "/projects/favorites": "Favorites",
  "/projects/trash": "Trash",
};

function BreadcrumbInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setHighlightedFolderKey } = useFolder();
  const { activeToolLabel, toggleToolsPanel } = useTool();
  const items: BreadcrumbItem[] = [];

  // Determine base section
  if (pathname === "/" || pathname.startsWith("/assets/")) {
    items.push({ label: "Assets" });
    if (pathname === "/") {
      // Default subsection for Assets
      items.push({ label: "All assets" });
    } else if (pathname.startsWith("/assets/")) {
      const label = assetLabels[pathname];
      if (label) {
        items.push({ label });
      }
    }
  } else if (pathname === "/home" || pathname.startsWith("/home/")) {
    items.push({ label: "Home" });
    if (pathname === "/home") {
      // Default subsection for Home
      items.push({ label: "Get started" });
    } else if (pathname.startsWith("/home/")) {
      const label = homeLabels[pathname];
      if (label) {
        items.push({ label });
      }
    }
  } else if (pathname === "/apps") {
    items.push({ label: "AI Suite" });
    items.push({ label: "Tools & Templates" });
  } else if (pathname === "/ai-suite" || pathname.startsWith("/ai-suite/")) {
    items.push({ label: "Image", onClick: toggleToolsPanel });
    items.push({ label: activeToolLabel });
  } else if (pathname === "/video" || pathname.startsWith("/video/")) {
    items.push({ label: "Video", onClick: toggleToolsPanel });
    items.push({ label: activeToolLabel });
  } else if (pathname === "/audio" || pathname.startsWith("/audio/")) {
    items.push({ label: "Audio", onClick: toggleToolsPanel });
    items.push({ label: activeToolLabel });
  } else if (pathname === "/3d" || pathname.startsWith("/3d/")) {
    items.push({ label: "3D", onClick: toggleToolsPanel });
    items.push({ label: activeToolLabel });
  } else if (pathname === "/spaces" || pathname.startsWith("/spaces/")) {
    items.push({ label: "Spaces" });
  } else if (pathname === "/academy" || pathname.startsWith("/academy/")) {
    items.push({ label: "Academy" });
  } else if (pathname === "/stock") {
    items.push({ label: "Stock" });
    const stockCategory = searchParams.get("category") || "mixed";
    const stockLabels: Record<string, string> = {
      mixed: "Explore", photos: "Photos", illustrations: "Illustrations",
      vectors: "Vectors", icons: "Icons", mockups: "Mockups", videos: "Videos",
      psds: "PSD's", designs: "Designs", fonts: "Fonts", music: "Music",
      sfx: "Sound Effects",
    };
    items.push({ label: stockLabels[stockCategory] || "Explore" });
  } else if (pathname === "/projects" || pathname.startsWith("/projects/")) {
    items.push({ label: "Work", href: "/projects" });
    
    // Check if we're on a project detail page (e.g., /projects/nike-campaign)
    const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);
    const folderParam = searchParams.get("folder");
    
    if (projectMatch) {
      // On a project detail page - derive project name from URL slug
      const projectSlug = projectMatch[1];
      const projectNameMap: Record<string, string> = {
        "personal": "Personal",
        "product-shots": "Product Shots",
        "nike-campaign": "Nike Campaign",
        "lifestyle": "Lifestyle",
        "road-trip": "Road Trip",
      };
      const projectName = projectNameMap[projectSlug] || projectSlug;
      items.push({ label: projectName, href: `/projects/${projectSlug}` });
      
      // If a folder is selected via URL param, add it to breadcrumb
      if (folderParam) {
        items.push({ label: folderParam });
      }
    } else if (pathname === "/projects") {
      // Work overview page - no subsection needed
    } else if (pathname.startsWith("/projects/")) {
      // Other project routes (all-projects, uploads, etc.)
      const label = folderLabels[pathname];
      if (label) {
        items.push({ label, href: pathname });
      }
    }
  }

  if (items.length === 0) {
    const label = sectionLabels[pathname] || "Page";
    items.push({ label });
  }

  // Truncate if more than 4 items: show first, "...", and last 2
  const shouldTruncate = items.length > 4;
  const truncatedItems = shouldTruncate
    ? items.slice(1, -2).map((item, idx) => ({ ...item, originalIndex: idx + 1 }))
    : []; // Items hidden by ellipsis with their original indices
  const displayItems = shouldTruncate
    ? [
        items[0], // First item
        { label: "...", href: undefined }, // Ellipsis
        ...items.slice(-2), // Last 2 items
      ]
    : items;

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  const handleEllipsisClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleTruncatedItemClick = (itemIndex: number) => {
    // Reconstruct the path up to the clicked item
    const pathUpToItem = items.slice(0, itemIndex + 1);
    // For folders, we need to reconstruct the highlightedFolderKey
    if (pathname === "/projects" || pathname.startsWith("/projects/")) {
      if (pathUpToItem.length > 1) {
        // Skip "Projects" and join the rest
        const folderPath = pathUpToItem.slice(1).map((item) => item.label).join("/");
        setHighlightedFolderKey(folderPath);
      }
    }
    setShowDropdown(false);
  };

  return (
    <nav className="flex items-center gap-2" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === "...";
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span
                  className="text-sm font-normal opacity-50"
                  style={{ color: "var(--surface-foreground-2)" }}
                >
                  ›
                </span>
              )}
              {isEllipsis ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={handleEllipsisClick}
                    className="flex items-center justify-center rounded-md p-1 transition-colors hover:bg-white/10"
                    style={{ color: "var(--surface-foreground-2)" }}
                    aria-label="Show more breadcrumb items"
                    title={items.map((i) => i.label).join(" › ")}
                  >
                    <DotsThree weight="bold" size={16} className="opacity-70" />
                  </button>
                  {showDropdown && truncatedItems.length > 0 && (
                    <div
                      className="absolute top-full left-0 mt-1 z-50 rounded-lg border shadow-lg overflow-hidden"
                      style={{
                        background: "var(--surface-modal)",
                        borderColor: "#1c1c1c",
                      }}
                    >
                      <ul className="py-1">
                        {truncatedItems.map((truncatedItem, truncatedIndex) => {
                          const originalIndex =
                            "originalIndex" in truncatedItem
                              ? truncatedItem.originalIndex
                              : truncatedIndex + 1;
                          return (
                            <li key={truncatedIndex}>
                              <button
                                type="button"
                                onClick={() => handleTruncatedItemClick(originalIndex)}
                                className="w-full px-4 py-2 text-left text-sm font-normal transition-colors hover:bg-white/5"
                                style={{ color: "var(--surface-foreground-0)" }}
                              >
                                {truncatedItem.label}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              ) : isLast ? (
                <span
                  className="text-sm font-normal opacity-50"
                  style={{ color: "var(--surface-foreground-0)" }}
                >
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="text-sm font-normal rounded-md px-2 py-1 opacity-50 transition-all hover:bg-white/5 hover:opacity-80 cursor-pointer"
                  style={{ color: "var(--surface-foreground-0)" }}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  href={item.href || "#"}
                  className="text-sm font-normal rounded-md px-2 py-1 opacity-50 transition-all hover:bg-white/5 hover:opacity-80"
                  style={{ color: "var(--surface-foreground-0)" }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Breadcrumb() {
  return (
    <Suspense fallback={<nav className="flex items-center gap-2" aria-label="Breadcrumb" />}>
      <BreadcrumbInner />
    </Suspense>
  );
}
