"use client";

import React, { useState, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useFolder } from "@/contexts/FolderContext";
import { useSpotlight } from "@/contexts/SpotlightContext";
import { useCreateModal } from "@/contexts/CreateModalContext";
import { Tooltip } from "@/components/Tooltip";
import { useTool } from "@/contexts/ToolContext";
import { usePalette } from "@/contexts/PaletteContext";
import { PaletteEditorModal } from "@/components/PaletteEditorModal";
import { ProjectsPanel } from "./sidebar-panels/ProjectsPanel";
import { AppsPanel } from "./sidebar-panels/AppsPanel";
import { StockPanel } from "./sidebar-panels/StockPanel";
import { HomePanel } from "./sidebar-panels/HomePanel";
import { AssetsPanel } from "./sidebar-panels/AssetsPanel";
import { AcademyPanel } from "./sidebar-panels/AcademyPanel";
import { SpacesPanel } from "./sidebar-panels/SpacesPanel";
import { AiSuitePanel } from "./sidebar-panels/AiSuitePanel";
import { AudioPanel } from "./sidebar-panels/AudioPanel";
import {
  House,
  MagnifyingGlass,
  CardsThree,
  Folders,
  CaretDown,
  Bell,
  DotsThree,
  Plus,
  Users,
  Lightbulb,
  Image,
  PenNib,
  SquaresFour,
  Star,
  TShirt,
  PlayCircle,
  File,
  Layout,
  TextT,
  SpeakerHigh,
  GraduationCap,
  Globe,
  Stack,
  Heart,
  VideoCamera,
  FilmStrip,
  TreeStructure,
  Sidebar as SidebarIcon,
  ArrowsOut,
  Sparkle,
  Cube,
  Book,
  Shapes,
  Camera,
  Smiley,
  Eraser,
  Sun,
  Copy,
  MusicNotes,
  Headphones,
  ArrowsClockwise,
  Microphone,
  DotsNine,
} from "@phosphor-icons/react";

const pinnableTools: Record<string, { icon: typeof Image; label: string; href: string }> = {
  // Image
  "image-generator": { icon: Image, label: "Image Generator", href: "/ai-suite" },
  "image-editor": { icon: PenNib, label: "Image Editor", href: "/ai-suite" },
  "image-upscaler": { icon: ArrowsOut, label: "Image Upscaler", href: "/ai-suite" },
  "cinematic-shot": { icon: FilmStrip, label: "Cinematic Shot", href: "/ai-suite" },
  "variations": { icon: Copy, label: "Variations", href: "/ai-suite" },
  "skin-enhancer": { icon: Smiley, label: "Skin Enhancer", href: "/ai-suite" },
  "change-camera": { icon: Camera, label: "Change Camera", href: "/ai-suite" },
  "mockup-generator": { icon: TShirt, label: "Mockup Generator", href: "/ai-suite" },
  "remove-background": { icon: Eraser, label: "Remove Background", href: "/ai-suite" },
  "batch": { icon: SquaresFour, label: "Batch", href: "/ai-suite" },
  "relight": { icon: Sun, label: "Relight", href: "/ai-suite" },
  // Video
  "video-generator": { icon: VideoCamera, label: "Video Generator", href: "/video" },
  "clip-editor": { icon: FilmStrip, label: "Clip Editor", href: "/video" },
  "video-upscaler": { icon: ArrowsOut, label: "Video Upscaler", href: "/video" },
  "video-project-editor": { icon: PenNib, label: "Video Project Editor", href: "/video" },
  "lip-sync": { icon: Headphones, label: "Lip Sync", href: "/video" },
  "video-face-swap": { icon: Smiley, label: "Video Face Swap", href: "/video" },
  "speak": { icon: Microphone, label: "Speak", href: "/video" },
  // Audio
  "music-generator": { icon: MusicNotes, label: "Music Generator", href: "/audio" },
  "voice-generator": { icon: Microphone, label: "Voice Generator", href: "/audio" },
  "sound-effect-generator": { icon: Sparkle, label: "Sound Effect Generator", href: "/audio" },
  "change-voice": { icon: ArrowsClockwise, label: "Change Voice", href: "/audio" },
  // 3D
  "virtual-scene": { icon: Cube, label: "Virtual Scene", href: "/3d" },
  "3d-generator": { icon: Cube, label: "3D Generator", href: "/3d" },
};

const SIDEBAR_MIN_WIDTH = 280;
const SIDEBAR_MAX_WIDTH = 480;

const iconBtn = "size-8 cursor-pointer"; /* 32px button */
const iconBtnIconSize = 16;

const iconProps = {
  weight: "bold" as const,
  size: iconBtnIconSize,
  className: "shrink-0",
};

function StockAssetsIcon({
  size = 24,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Stock assets icon"
      className={className}
      style={style}
    >
      <path
        d="M15.8906 10.7344H20.3906C21.8119 10.7344 22.9687 9.57797 22.9687 8.15625V3.65625C22.9687 2.23453 21.8119 1.07812 20.3906 1.07812H15.8906C14.4694 1.07812 13.3125 2.23453 13.3125 3.65625V8.15625C13.3125 9.57797 14.4694 10.7344 15.8906 10.7344ZM15.6563 3.65625C15.6563 3.52687 15.7617 3.42187 15.8906 3.42187H20.3906C20.5195 3.42187 20.625 3.52687 20.625 3.65625V8.15625C20.625 8.28562 20.5195 8.39062 20.3906 8.39062H15.8906C15.7617 8.39062 15.6563 8.28562 15.6563 8.15625V3.65625ZM8.10937 13.2656H3.60937C2.18766 13.2656 1.03125 14.422 1.03125 15.8437V20.3437C1.03125 21.7655 2.18766 22.9219 3.60937 22.9219H8.10937C9.53109 22.9219 10.6875 21.7655 10.6875 20.3437V15.8437C10.6875 14.422 9.53109 13.2656 8.10937 13.2656ZM8.34375 20.3437C8.34375 20.4731 8.23875 20.5781 8.10937 20.5781H3.60937C3.48 20.5781 3.375 20.4731 3.375 20.3437V15.8437C3.375 15.7144 3.48 15.6094 3.60937 15.6094H8.10937C8.23875 15.6094 8.34375 15.7144 8.34375 15.8437V20.3437ZM5.95313 0.84375C3.16172 0.84375 0.890625 3.11484 0.890625 5.90625C0.890625 8.69766 3.16172 10.9687 5.95313 10.9687C8.74453 10.9687 11.0156 8.69766 11.0156 5.90625C11.0156 3.11484 8.74453 0.84375 5.95313 0.84375ZM5.95313 8.625C4.45406 8.625 3.23438 7.40531 3.23438 5.90625C3.23438 4.40719 4.45406 3.1875 5.95313 3.1875C7.45219 3.1875 8.67188 4.40719 8.67188 5.90625C8.67188 7.40531 7.45219 8.625 5.95313 8.625ZM23.2636 19.1372L20.1103 14.0606C19.6734 13.3575 18.9197 12.9375 18.0933 12.9375C17.2669 12.9375 16.5131 13.3575 16.0762 14.0606L12.923 19.1372C12.4659 19.8731 12.4434 20.8012 12.8648 21.5592C13.2844 22.3134 14.0794 22.7817 14.94 22.7817H21.2461C22.1067 22.7817 22.9017 22.3134 23.3212 21.5592C23.7431 20.8012 23.7211 19.8731 23.2636 19.1372ZM21.2597 20.4366C21.2597 20.4366 21.2559 20.4375 21.247 20.4375L14.9283 20.4366L14.9156 20.3737L18.0689 15.2972C18.0689 15.2972 18.0712 15.2972 18.075 15.2972C18.0877 15.2972 18.1195 15.2972 18.1205 15.2972L21.2737 20.3737L21.2597 20.4366Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ImageSparkleIcon(props: Record<string, unknown>) {
  const size = (typeof props.size === "number" ? props.size : 16) as number;
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <Image weight="bold" size={size * 0.85} className="relative" />
      <Sparkle weight="fill" size={size * 0.4} className="absolute -top-[1px] -right-[2px]" />
    </span>
  );
}

function VideoSparkleIcon(props: Record<string, unknown>) {
  const size = (typeof props.size === "number" ? props.size : 16) as number;
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <VideoCamera weight="bold" size={size * 0.85} className="relative" />
      <Sparkle weight="fill" size={size * 0.4} className="absolute -top-[1px] -right-[2px]" />
    </span>
  );
}

type NestedFolderItem =
  | string
  | { name: string; items: NestedFolderItem[] };

const myProjects: { name: string; color: string; items: NestedFolderItem[] }[] = [
  {
    name: "Short film",
    color: "bg-emerald-500",
    items: [
      {
        name: "Scenes",
        items: [
          {
            name: "Scene 01 - Intro",
            items: [
              {
                name: "Takes",
                items: [
                  {
                    name: "Raw",
                    items: [
                      "Day 1",
                      "Day 2",
                      "Day 3",
                      "Pickups",
                    ],
                  },
                  "Approved",
                  "Rejected",
                  "Archive",
                ],
              },
              "Selects",
              "Backup",
            ],
          },
          {
            name: "Scene 02 - Kitchen",
            items: [
              { name: "Takes", items: ["Raw", "Selects", "Backup"] },
              "B-roll",
              "Coverage",
            ],
          },
          "Scene 03 - Street",
          "Scene 04 - Park",
          "Scene 05 - Finale",
        ],
      },
      {
        name: "Assets",
        items: [
          {
            name: "Characters",
            items: [
              "Hero",
              {
                name: "Supporting",
                items: ["Lead supporting", "Background", "Crowd"],
              },
              "Extras",
            ],
          },
          {
            name: "Props",
            items: ["On set", "Digital", "Vehicles", "Weapons"],
          },
          {
            name: "Environments",
            items: [
              { name: "Interior", items: ["House", "Office", "Studio"] },
              { name: "Exterior", items: ["Street", "Park", "Location"] },
            ],
          },
        ],
      },
      {
        name: "Rough cuts",
        items: [
          {
            name: "V1 - First pass",
            items: ["Timeline", "Notes", "Export", "Client review"],
          },
          "V2 - Edit notes",
          "V3 - Client review",
        ],
      },
      {
        name: "Audio",
        items: [
          {
            name: "Dialogue",
            items: ["ADR", "Production", "Loops", "Wild lines"],
          },
          {
            name: "Music",
            items: ["Score", "Licensed", "Temp", "Final mix"],
          },
          {
            name: "SFX",
            items: ["Foley", "Library", "Design", "Ambience"],
          },
        ],
      },
      "Storyboards",
      "Scripts",
      "References",
      "B-roll",
      "Archive",
    ],
  },
  {
    name: "Personal",
    color: "bg-amber-500",
    items: ["Documents", "Photos", "Videos"],
  },
];

const sharedProjects = [
  {
    name: "Nike",
    color: "bg-violet-500",
    items: ["Retouched", "Finals", "Characters", "Backgrounds"],
  },
];

const navItems = [
  { href: "/projects", id: "folders", icon: Folders, label: "Work" },
  { href: "/ai-suite", id: "ai-suite", icon: Image, label: "Image" },
  { href: "/video", id: "video", icon: VideoCamera, label: "Video" },
  { href: "/audio", id: "audio", icon: SpeakerHigh, label: "Audio" },
  { href: "/3d", id: "3d", icon: Cube, label: "3D" },
  { href: "/spaces", id: "spaces", icon: TreeStructure, label: "Spaces" },
] as const;

const appsCategories = [
  {
    category: "Image",
    items: [
      { id: "image-generator", label: "Image generator", icon: Image },
      { id: "image-editor", label: "Image editor", icon: PenNib },
      { id: "upscaler", label: "Upscaler", icon: Stack },
      { id: "background-remover", label: "Background remover", icon: Layout },
      { id: "face-swap", label: "Face swap", icon: Users },
    ],
  },
  {
    category: "Video",
    items: [
      { id: "video-generator", label: "Video generator", icon: VideoCamera },
      { id: "video-editor", label: "Video editor", icon: FilmStrip },
    ],
  },
  {
    category: "Audio",
    items: [
      { id: "voiceover", label: "Voiceover", icon: SpeakerHigh },
      { id: "audio-editor", label: "Audio editor", icon: SpeakerHigh },
    ],
  },
];

const stockItems = [
  { id: "featured", label: "Featured", icon: Lightbulb },
  { id: "photos", label: "Photos", icon: Image },
  { id: "illustrations", label: "Illustrations", icon: PenNib },
  { id: "vectors", label: "Vectors", icon: SquaresFour },
  { id: "icons", label: "Icons", icon: Star },
  { id: "mockups", label: "Mockups", icon: TShirt },
  { id: "videos", label: "Videos", icon: PlayCircle },
  { id: "psds", label: "PSD's", icon: File },
  { id: "designs", label: "Designs", icon: Layout },
  { id: "fonts", label: "Fonts", icon: TextT },
  { id: "audio", label: "Audio", icon: SpeakerHigh },
];

const myCollectionsItems = [
  { id: "product-mockups", label: "Product mockups", thumbnail: "bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300" },
  { id: "bw-portraits", label: "Black and white portrai...", thumbnail: "bg-gradient-to-br from-gray-300 to-gray-500" },
  { id: "backgrounds", label: "Backgrounds", thumbnail: "bg-gradient-to-br from-blue-300 via-indigo-300 to-purple-300" },
];

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

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const toolPaths = ["/ai-suite", "/video", "/audio", "/3d"];
  const isOnToolsPage = toolPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const { highlightedFolderKey, setHighlightedFolderKey } = useFolder();
  const { setActiveToolLabel, activeToolId, setActiveToolId, pinnedTools, showToolsPanel, setShowToolsPanel } = useTool();
  const [exitingTools, setExitingTools] = useState<Set<string>>(new Set());
  const prevPinnedRef = useRef<Set<string>>(new Set(pinnedTools));
  const [mounted, setMounted] = useState(false);
  const [expandedNike, setExpandedNike] = useState(true);
  const [expandedMyProjects, setExpandedMyProjects] = useState<Record<string, boolean>>({
    "Short film": false,
    Personal: false,
  });
  const [expandedNestedFolders, setExpandedNestedFolders] = useState<Record<string, boolean>>({});
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const spotlight = useSpotlight();
  const createModal = useCreateModal();
  const { openPaletteEditor, ctaColor, ctaTextColor, surfaceColors: sc } = usePalette();

  const collapsedWidth = 72;

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const prev = prevPinnedRef.current;
    const removed = [...prev].filter(
      (pid) => !pinnedTools.has(pid) && pinnableTools[pid]
    );
    if (removed.length > 0) {
      setExitingTools((s) => new Set([...s, ...removed]));
      removed.forEach((pid) => {
        setTimeout(() => {
          setExitingTools((s) => {
            const next = new Set(s);
            next.delete(pid);
            return next;
          });
        }, 150);
      });
    }
    prevPinnedRef.current = new Set(pinnedTools);
  }, [pinnedTools]);


  const activeNavId = !mounted
    ? "home"
    : (pathname === "/home/get-started" || pathname.startsWith("/home/"))
      ? "home"
      : (pathname === "/academy" || pathname.startsWith("/academy/"))
        ? "academy"
        : (pathname === "/stock" || pathname.startsWith("/stock/"))
          ? "search"
          : (navItems.find(({ href }) =>
                href === "/projects" ? pathname === "/projects" || pathname.startsWith("/projects/") :
                href === "/spaces" ? pathname === "/spaces" || pathname.startsWith("/spaces/") :
                href === "/ai-suite" ? pathname === "/ai-suite" || pathname.startsWith("/ai-suite/") :
                href === "/video" ? pathname === "/video" || pathname.startsWith("/video/") :
                href === "/audio" ? pathname === "/audio" || pathname.startsWith("/audio/") :
                href === "/3d" ? pathname === "/3d" || pathname.startsWith("/3d/") :
                pathname === href
              )?.id ?? "home");

  const toggleMyProject = (name: string) => {
    setExpandedMyProjects((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleNestedFolder = (key: string) => {
    setExpandedNestedFolders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderNestedFolderList = (
    projectName: string,
    items: NestedFolderItem[],
    parentPath: string
  ): ReactNode =>
    items.map((item) => {
      const itemName = typeof item === "string" ? item : item.name;
      const path = parentPath ? `${parentPath}/${itemName}` : itemName;
      const fullKey = `${projectName}/${path}`;
      if (typeof item === "string") {
        const isHighlighted = highlightedFolderKey === fullKey;
        return (
          <li key={path}>
            <button
              type="button"
              onClick={() => setHighlightedFolderKey(fullKey)}
              className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-2 text-left text-[13px] transition-colors hover:bg-fg/5"
              style={{
                color: "var(--surface-foreground-2)",
                background: isHighlighted ? "var(--selected)" : "transparent",
              }}
            >
              <Folders weight="bold" size={14} className="shrink-0 opacity-50" />
              <span className="truncate">{item}</span>
            </button>
          </li>
        );
      }
      const isExpanded = expandedNestedFolders[fullKey];
      const isHighlighted = highlightedFolderKey === fullKey;
      return (
        <li key={path}>
          <div
            className="flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-2 text-left text-[13px] transition-colors"
            style={{
              color: "var(--surface-foreground-2)",
              background: isHighlighted ? "var(--selected)" : "transparent",
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleNestedFolder(fullKey);
              }}
              className="flex shrink-0 cursor-pointer items-center justify-center rounded p-0.5 transition-colors"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <CaretDown
                weight="bold"
                size={14}
                className={`shrink-0 opacity-50 transition-transform ${isExpanded ? "duration-200 ease-in-out rotate-0" : "duration-200 ease-out -rotate-90"}`}
              />
            </button>
            <button
              type="button"
              onClick={() => setHighlightedFolderKey(fullKey)}
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg py-1 pr-1 text-left"
              style={{ color: "inherit" }}
            >
              <Folders weight="bold" size={14} className="shrink-0 opacity-50" />
              <span className="min-w-0 flex-1 truncate">{item.name}</span>
            </button>
          </div>
          <div
            className={isExpanded ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"}
            style={{
              maxHeight: isExpanded ? 400 : 0,
              opacity: isExpanded ? 1 : 0,
              transition: `max-height 0.2s ${isExpanded ? "ease-in-out" : "ease-out"}, opacity 0.2s ${isExpanded ? "ease-in-out" : "ease-out"}`,
            }}
          >
            <ul
              className="ml-2 mt-0.5 space-y-0 border-l pl-2 pb-0.5"
              style={{ borderColor: "transparent" }}
            >
              {renderNestedFolderList(projectName, item.items, path)}
            </ul>
          </div>
        </li>
      );
    });

  return (
    <>
    <div className="flex min-h-0 shrink-0 gap-2">
      <aside
        className="flex min-h-0 min-w-0 flex-1 overflow-visible rounded-2xl"
        style={{ background: "var(--sidebar)" }}
      >
      <div
        className="flex flex-col items-center pt-4 pb-3 rounded-2xl"
        style={{ borderColor: "var(--surface-border-alpha-0)", width: "72px", minWidth: "72px", background: sc.sidebar }}
      >
        <Link href="/home" className={`mb-4 flex shrink-0 items-center justify-center ${iconBtn}`} style={{ color: "var(--surface-foreground-0)" }}>
          <img src="/freepik-logo.png" alt="Freepik" width={28} height={28} className="shrink-0" />
        </Link>

        <Tooltip content="Create new" side="right">
          <button
            type="button"
            onClick={() => createModal?.open()}
            className="mt-2 mb-4 flex h-9 w-10 shrink-0 items-center justify-center rounded-lg border transition-opacity hover:opacity-90"
            style={{ background: ctaColor, borderColor: ctaColor, color: ctaTextColor }}
            aria-label="New"
          >
            <Plus {...iconProps} />
          </button>
        </Tooltip>

        <nav className="flex shrink-0 flex-col gap-1" aria-label="Quick navigation">
          <Tooltip content="Search" side="right">
            <button
              type="button"
              onClick={() => spotlight?.open()}
              className={`flex items-center justify-center rounded-lg transition-colors hover:bg-fg/10 ${iconBtn}`}
              style={{ color: "var(--surface-foreground-0)" }}
              aria-label="Search"
            >
              <MagnifyingGlass {...iconProps} />
            </button>
          </Tooltip>
          <Tooltip content="Home" side="right">
            <Link
              href="/home/get-started"
              className={`flex items-center justify-center rounded-lg transition-colors ${iconBtn} ${activeNavId === "home" ? "" : "hover:bg-fg/10"}`}
              style={{
                color: "var(--surface-foreground-0)",
                background: activeNavId === "home" ? "var(--selected)" : "transparent",
              }}
              aria-label="Home"
            >
              <House {...iconProps} size={iconBtnIconSize} />
            </Link>
          </Tooltip>
          <Tooltip content="Stock" side="right">
            <Link
              href="/stock"
              className={`flex items-center justify-center rounded-lg transition-colors ${iconBtn} ${activeNavId === "search" ? "" : "hover:bg-fg/10"}`}
              style={{
                color: "var(--surface-foreground-0)",
                background: activeNavId === "search" ? "var(--selected)" : "transparent",
              }}
              aria-label="Stock"
            >
              <Shapes {...iconProps} size={iconBtnIconSize} />
            </Link>
          </Tooltip>
          {navItems.map(({ href, id, icon: Icon, label }) => (
            <React.Fragment key={id}>
            {id === "ai-suite" && (
              <div className="mx-auto my-3 h-px w-4" style={{ background: "var(--surface-border-alpha-1)" }} />
            )}
            <Tooltip content={label} side="right">
              <Link
                href={href}
                className={`flex items-center justify-center rounded-lg transition-colors ${iconBtn} ${activeNavId === id && !showToolsPanel ? "" : "hover:bg-fg/10"}`}
                style={{
                  color: "var(--surface-foreground-0)",
                  background: activeNavId === id && !showToolsPanel ? "var(--selected)" : "transparent",
                }}
                aria-label={label}
                aria-current={activeNavId === id && !showToolsPanel ? "true" : undefined}
                onClick={() => {
                  setShowToolsPanel(false);
                  const defaultTools: Record<string, { id: string; label: string }> = {
                    "ai-suite": { id: "image-generator", label: "Image Generator" },
                    "video":    { id: "video-generator", label: "Video Generator" },
                    "audio":    { id: "music-generator", label: "Music Generator" },
                    "3d":       { id: "3d-generator",    label: "3D Generator" },
                  };
                  if (defaultTools[id]) {
                    setActiveToolId(defaultTools[id].id);
                    setActiveToolLabel(defaultTools[id].label);
                  }
                }}
              >
                <Icon {...iconProps} size={iconBtnIconSize} />
              </Link>
            </Tooltip>
            {id === "3d" && (
              <Tooltip content="All tools" side="right">
                <button
                  type="button"
                  onClick={() => {
                    if (isOnToolsPage) {
                      setShowToolsPanel(!showToolsPanel);
                    } else {
                      setShowToolsPanel(true);
                      router.push("/ai-suite");
                    }
                  }}
                  className={`flex items-center justify-center rounded-lg transition-colors ${iconBtn} hover:bg-fg/10`}
                  style={{
                    color: "var(--surface-foreground-0)",
                    background: showToolsPanel ? "var(--selected)" : "transparent",
                  }}
                  aria-label="All tools"
                >
                  <DotsNine {...iconProps} size={iconBtnIconSize} />
                </button>
              </Tooltip>
            )}
            {id === "3d" && ([...pinnedTools].filter((pid) => pinnableTools[pid]).length > 0 || exitingTools.size > 0) && (
              <>
                <div className="mx-auto my-2 h-px w-4" style={{ background: "var(--surface-border-alpha-1)" }} />
                {[...[...pinnedTools].filter((pid) => pinnableTools[pid]), ...[...exitingTools]].filter((pid, i, arr) => arr.indexOf(pid) === i).map((pid) => {
                  const tool = pinnableTools[pid];
                  if (!tool) return null;
                  const PinnedIcon = tool.icon;
                  const isExiting = exitingTools.has(pid);
                  return (
                    <div key={pid} className={isExiting ? "sidebar-pin-outer-exit" : "sidebar-pin-outer-enter"}>
                      <div className={isExiting ? "sidebar-pin-exit" : "sidebar-pin-enter"}>
                        <Tooltip content={tool.label} side="right">
                          <Link
                            href={tool.href}
                            className={`flex items-center justify-center rounded-lg transition-colors ${iconBtn} hover:bg-fg/10`}
                            style={{ color: "var(--surface-foreground-0)" }}
                            aria-label={tool.label}
                            onClick={() => {
                              if (!isExiting) {
                                setActiveToolId(pid);
                                setActiveToolLabel(tool.label);
                                setShowToolsPanel(false);
                              }
                            }}
                          >
                            <PinnedIcon {...iconProps} size={iconBtnIconSize} />
                          </Link>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            </React.Fragment>
          ))}
        </nav>

        <div className="mt-auto flex shrink-0 flex-col gap-2 pt-4">
          <Tooltip content="Academy" side="right">
            <Link
              href="/academy"
              className={`flex items-center justify-center rounded-lg transition-colors ${iconBtn} ${activeNavId === "academy" ? "" : "hover:bg-fg/10"}`}
              style={{
                color: "var(--surface-foreground-0)",
                background: activeNavId === "academy" ? "var(--selected)" : "transparent",
              }}
              aria-label="Academy"
            >
              <GraduationCap {...iconProps} size={iconBtnIconSize} />
            </Link>
          </Tooltip>
          <Tooltip content="Notifications" side="right">
            <button
              type="button"
              className={`flex items-center justify-center rounded-lg transition-colors hover:bg-fg/10 ${iconBtn}`}
              style={{ color: "var(--surface-foreground-0)" }}
              aria-label="Notifications"
            >
              <Bell {...iconProps} />
            </button>
          </Tooltip>
          <Tooltip content="More options" side="right">
            <button
              type="button"
              onClick={openPaletteEditor}
              className={`flex items-center justify-center rounded-lg transition-colors hover:bg-fg/10 ${iconBtn}`}
              style={{ color: "var(--surface-foreground-0)" }}
              aria-label="More options"
            >
              <DotsThree {...iconProps} />
            </button>
          </Tooltip>
        </div>
      </div>

    </aside>

    </div>
    <PaletteEditorModal />
    </>
  );
}
