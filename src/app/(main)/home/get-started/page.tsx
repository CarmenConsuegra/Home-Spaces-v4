"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import NextImage from "next/image";
import localFont from "next/font/local";
import { usePalette } from "@/contexts/PaletteContext";

const klarheit = localFont({ src: "../../../fonts/ESKlarheitPlakat-Xbd.otf" });
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  MagnifyingGlass,
  Image,
  PenNib,
  PencilSimple,
  ArrowsOut,
  CornersOut,
  Copy,
  VideoCamera,
  FilmSlate,
  Scissors,
  Waveform,
  Microphone,
  Sparkle,
  MusicNotes,
  Cube,
  TreeStructure,
  CaretLeft,
  CaretRight,
  PaperPlaneRight,
  Paperclip,
  Plus,
  SpeakerHigh,
  CaretDown,
  Heart,
  GridFour,
  Layout,
  FolderSimple,
  ClockCounterClockwise,
  DotsThreeVertical,
  LockSimple,
  Folders,
  UsersThree,
  Lock,
  PushPin,
  Users,
} from "@phosphor-icons/react";
import { AssistantButton } from "@/components/AssistantButton";
import { AvatarWithProgress } from "@/components/AvatarWithProgress";
import { FreepikButton } from "@/components/FreepikButton";
import { Tooltip } from "@/components/Tooltip";
import { ProjectFolderBreadcrumb } from "@/components/ProjectFolderBreadcrumb";
import { projects } from "@/contexts/FolderContext";
import { useSpotlight } from "@/contexts/SpotlightContext";
import { SpaceCard } from "@/components/SpaceCard";
import { ProjectCard, NewProjectCard } from "@/components/ProjectCard";
import { AssetCard } from "@/components/AssetCard";
import { allSpaces } from "@/data/spaces";
import { getProjectAssets } from "@/data/projectAssets";
import { useRouter } from "next/navigation";



const recentRowImages = [
  "https://images.unsplash.com/photo-1772289093030-bc33ef6d4417?w=400&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
];


const modelCategories = [
  {
    category: "Image",
    models: [
      { id: "nano-banana", name: "Google Nano Banana", author: "Google" },
      { id: "sdxl", name: "SDXL", author: "Stability AI" },
      { id: "flux-schnell", name: "Flux Schnell", author: "Black Forest Labs" },
      { id: "ideogram-v2", name: "Ideogram v2", author: "Ideogram" },
      { id: "recraft-v3", name: "Recraft v3", author: "Recraft" },
      { id: "playground-v3", name: "Playground v3", author: "Playground" },
    ],
  },
  {
    category: "Video",
    models: [
      { id: "kling-v2", name: "Kling v2", author: "Kuaishou" },
      { id: "minimax-video", name: "Minimax Video-01", author: "MiniMax" },
      { id: "luma-ray2", name: "Luma Ray2", author: "Luma AI" },
      { id: "wan-2.1", name: "Wan 2.1", author: "Alibaba" },
      { id: "ltx-video", name: "LTX Video", author: "Lightricks" },
    ],
  },
  {
    category: "Audio",
    models: [
      { id: "voiceover", name: "Voiceover", author: "" },
      { id: "music", name: "Music", author: "" },
      { id: "sound-effects", name: "Sound Effects", author: "" },
    ],
  },
];

function slugify(title: string) {
  return title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getToolCategories(blueSolid: string, greenSolid: string, orangeSolid: string, yellowSolid: string) { return [
  {
    category: "Image",
    bgGradient: blueSolid,
    borderColor: blueSolid,
    subtleBg: `${blueSolid}33`,
    tools: [
      { label: "Image Generator", icon: Image, desc: "Create stunning images from text prompts" },
      { label: "Image Editor", icon: PenNib, desc: "Edit and retouch photos with AI precision" },
      { label: "Image Upscaler", icon: ArrowsOut, desc: "Enhance resolution without losing quality" },
      { label: "Image Extender", icon: CornersOut, desc: "Expand any image beyond its original bounds" },
      { label: "Variations", icon: Copy, desc: "Generate multiple creative variations of an image" },
    ],
  },
  {
    category: "Video",
    bgGradient: greenSolid,
    borderColor: greenSolid,
    subtleBg: `${greenSolid}33`,
    tools: [
      { label: "Video Generator", icon: VideoCamera, desc: "Turn text or images into cinematic video clips" },
      { label: "Video Timeline", icon: FilmSlate, desc: "Compose and arrange clips on a visual timeline" },
      { label: "Clip Editor", icon: Scissors, desc: "Trim, cut, and refine video footage" },
      { label: "Video Upscaler", icon: ArrowsOut, desc: "Upscale video resolution with AI enhancement" },
      { label: "Lip Sync", icon: Waveform, desc: "Sync audio to video for realistic lip movement" },
    ],
  },
  {
    category: "Audio",
    bgGradient: orangeSolid,
    borderColor: orangeSolid,
    subtleBg: `${orangeSolid}33`,
    tools: [
      { label: "Voice Generator", icon: Microphone, desc: "Generate natural-sounding voiceovers from text" },
      { label: "Voiceover", icon: Microphone, desc: "Add professional voiceover narration to content" },
      { label: "Voice Cloning", icon: Microphone, desc: "Clone any voice with just a short sample" },
      { label: "Sound Effects", icon: Sparkle, desc: "Create custom sound effects on demand" },
      { label: "Music Generator", icon: MusicNotes, desc: "Compose original music in any style or mood" },
    ],
  },
  {
    category: "3D",
    bgGradient: yellowSolid,
    borderColor: yellowSolid,
    subtleBg: `${yellowSolid}33`,
    tools: [
      { label: "3D Generator", icon: Cube, desc: "Generate 3D models from text or image input" },
      { label: "3D Objects", icon: Cube, desc: "Create detailed 3D objects from references" },
      { label: "3D Worlds", icon: Cube, desc: "Build immersive 3D environments and scenes" },
    ],
  },
]; }

const templateSections = [
  {
    title: "New",
    templates: [
      { id: "new-0", title: "Create an AI influencer", desc: "Generate a realistic AI persona for social content" },
      { id: "new-1", title: "Product in lifestyle scene", desc: "Place your product in a natural everyday setting" },
      { id: "new-2", title: "Mock up branded packaging", desc: "Visualize your design on realistic packaging" },
      { id: "new-3", title: "Change your background", desc: "Swap the background of any photo instantly" },
      { id: "new-4", title: "Change your product", desc: "Replace or modify products in existing photos" },
      { id: "new-5", title: "Create a close-up confession", desc: "Generate an intimate close-up portrait scene" },
      { id: "new-6", title: "Capture an epic wide shot", desc: "Create dramatic landscape and wide-angle imagery" },
      { id: "new-7", title: "Capture a VHS POV moment", desc: "Apply a retro VHS camcorder aesthetic to any scene" },
      { id: "new-8", title: "Create cinematic portrait", desc: "Generate movie-quality portrait photography" },
      { id: "new-9", title: "Generate product mockup", desc: "Create realistic mockups for any product type" },
      { id: "new-10", title: "Design a poster layout", desc: "Build eye-catching poster compositions" },
      { id: "new-11", title: "Build a mood board", desc: "Curate visual references into a cohesive board" },
      { id: "new-12", title: "Create fashion lookbook", desc: "Style and compose editorial fashion spreads" },
      { id: "new-13", title: "Render 3D product view", desc: "Generate photorealistic 3D product renders" },
      { id: "new-14", title: "Generate stock photo", desc: "Produce royalty-free images on demand" },
    ],
  },
  {
    title: "Popular",
    templates: [
      { id: "feat-0", title: "Create a hero shot", desc: "Craft a bold hero image for landing pages" },
      { id: "feat-1", title: "Create flat lay composition", desc: "Arrange objects in stylish overhead layouts" },
      { id: "feat-2", title: "Generate social ad", desc: "Create scroll-stopping ad creatives" },
      { id: "feat-3", title: "Create video thumbnail", desc: "Design clickable thumbnails for video content" },
      { id: "feat-4", title: "Design event flyer", desc: "Build promotional flyers for any occasion" },
      { id: "feat-5", title: "Make a logo concept", desc: "Explore logo ideas and visual marks" },
      { id: "feat-6", title: "Create brand identity", desc: "Develop a cohesive visual brand system" },
      { id: "feat-7", title: "Generate travel content", desc: "Create stunning travel destination imagery" },
      { id: "feat-8", title: "Create editorial portrait", desc: "Generate magazine-quality portrait photography" },
      { id: "feat-9", title: "Generate food photography", desc: "Create appetizing food imagery" },
      { id: "feat-10", title: "Make before & after", desc: "Create side-by-side comparison graphics" },
      { id: "feat-11", title: "Generate lifestyle scene", desc: "Create authentic lifestyle moments" },
      { id: "feat-12", title: "Create product unboxing", desc: "Simulate unboxing experience shots" },
      { id: "feat-13", title: "Change scene and mood", desc: "Transform the atmosphere and tone of a photo" },
      { id: "feat-14", title: "Create fitness post", desc: "Generate workout and wellness content" },
    ],
  },
  {
    title: "Branding",
    templates: [
      { id: "brand-0", title: "Create 3D icon of an object", desc: "Turn any object into a stylized 3D icon" },
      { id: "brand-1", title: "Create packaging design", desc: "Design packaging for physical products" },
      { id: "brand-2", title: "Translate visual design", desc: "Adapt a design across formats and mediums" },
      { id: "brand-3", title: "Design typographic poster", desc: "Create bold type-driven poster artwork" },
      { id: "brand-4", title: "Transfer color palette to your image", desc: "Apply a custom palette to any image" },
      { id: "brand-5", title: "Create brand guidelines", desc: "Build a comprehensive brand guide document" },
      { id: "brand-6", title: "Design business card", desc: "Generate professional business card layouts" },
      { id: "brand-7", title: "Generate logo variations", desc: "Explore multiple logo concepts quickly" },
      { id: "brand-8", title: "Design letterhead", desc: "Create branded stationery and letterhead" },
      { id: "brand-9", title: "Build brand mood board", desc: "Assemble visual direction for a brand" },
      { id: "brand-10", title: "Create social media kit", desc: "Design a set of branded social templates" },
      { id: "brand-11", title: "Design merchandise", desc: "Mockup branded merch and apparel" },
      { id: "brand-12", title: "Build style guide", desc: "Document visual styles and usage rules" },
      { id: "brand-13", title: "Create billboard mockup", desc: "Preview designs on large-format displays" },
    ],
  },
  {
    title: "Social media",
    templates: [
      { id: "social-0", title: "Get a new haircut", desc: "Preview different hairstyles on any portrait" },
      { id: "social-1", title: "Try on new outfits", desc: "Virtually try clothing on any person" },
      { id: "social-2", title: "Create restaurant tabletop scene", desc: "Style food and drink flat lays" },
      { id: "social-3", title: "Design quote card", desc: "Create shareable quote graphics" },
      { id: "social-4", title: "Make carousel post", desc: "Design multi-slide carousel content" },
      { id: "social-5", title: "Create story template", desc: "Build reusable story layouts" },
      { id: "social-6", title: "Generate reel cover", desc: "Design eye-catching covers for short-form video" },
      { id: "social-7", title: "Design profile banner", desc: "Create on-brand headers for social profiles" },
      { id: "social-8", title: "Create event promotion", desc: "Build promotional graphics for events" },
      { id: "social-9", title: "Design infographic", desc: "Build data-driven visual stories" },
      { id: "social-10", title: "Design email template", desc: "Build responsive email layouts" },
      { id: "social-11", title: "Generate icon set", desc: "Create a consistent set of custom icons" },
      { id: "social-12", title: "Create presentation deck", desc: "Design polished slide presentations" },
      { id: "social-13", title: "Design storefront signage", desc: "Visualize branded signs and displays" },
    ],
  },
];

function useHorizontalScroll(scrollAmount = 600) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  }, [scrollAmount]);

  return { scrollRef, canScrollLeft, canScrollRight, updateScrollState, scroll };
}

function ScrollArrows({ canScrollLeft, canScrollRight, scroll }: { canScrollLeft: boolean; canScrollRight: boolean; scroll: (dir: "left" | "right") => void }) {
  return (
    <>
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 z-10 flex h-full w-12 cursor-pointer items-center justify-start pl-1 opacity-0 transition-opacity group-hover/row:opacity-100"
          aria-label="Scroll left"
        >
          <span className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-black">
            <CaretLeft weight="bold" size={16} className="text-fg" />
          </span>
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 z-10 flex h-full w-12 cursor-pointer items-center justify-end pr-1 opacity-0 transition-opacity group-hover/row:opacity-100"
          aria-label="Scroll right"
        >
          <span className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-black">
            <CaretRight weight="bold" size={16} className="text-fg" />
          </span>
        </button>
      )}
    </>
  );
}

function ScrollRow({ title, templates }: { title: string; templates: { id: string; title: string; desc: string }[] }) {
  const { scrollRef, canScrollLeft, canScrollRight, updateScrollState, scroll } = useHorizontalScroll();

  return (
    <div className="group/row relative flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2
          className="text-xl font-medium"
          style={{ color: "var(--surface-foreground-0)" }}
        >
          {title}
        </h2>
        <button
          type="button"
          className="cursor-pointer text-xs font-medium opacity-50 transition-opacity hover:opacity-80"
          style={{ color: "var(--surface-foreground-0)" }}
        >
          See all &rsaquo;
        </button>
      </div>
      <div className="relative -mr-6">
        <ScrollArrows canScrollLeft={canScrollLeft} canScrollRight={canScrollRight} scroll={scroll} />
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          onMouseEnter={updateScrollState}
          className="flex gap-6 overflow-x-auto pr-6 scrollbar-hide"
        >
          {templates.map(({ id, title: tTitle, desc }) => (
            <button
              key={id}
              type="button"
              className="flex w-[356px] shrink-0 cursor-pointer flex-col gap-2.5 overflow-hidden text-left transition-opacity hover:opacity-80"
            >
              <div
                className="aspect-video w-full shrink-0 overflow-hidden rounded-xl border"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                <img
                  src={`/templates/${slugify(tTitle)}.webp`}
                  alt={tTitle}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex w-full flex-col gap-0.5">
                <p
                  className="text-sm"
                  style={{ color: "var(--surface-foreground-0)" }}
                >
                  {tTitle}
                </p>
                <p
                  className="line-clamp-2 text-sm"
                  style={{ color: "var(--surface-foreground-2)" }}
                >
                  {desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Sort spaces most recent first
function parseDaysAgo(s: string): number {
  const m = s.match(/(\d+)\s+days?\s+ago/);
  return m ? parseInt(m[1], 10) : 999;
}

// List item row used inside the 3-column cards
function ListItem({ thumb, name, date, href }: { thumb?: string; name: string; date: string; href: string }) {
  return (
    <Link href={href} className="flex gap-4 items-start w-full transition-colors rounded-xl hover:bg-white/5 -mx-2 px-2 py-1">
      <div className="size-12 shrink-0 overflow-hidden rounded-lg" style={{ background: "#424242" }}>
        {thumb && <NextImage src={thumb} alt={name} width={48} height={48} unoptimized className="size-full object-cover" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col leading-[1.6]">
        <span className="truncate text-[14px]" style={{ color: "#f5f5f5" }}>{name}</span>
        <span className="text-[12px] opacity-50" style={{ color: "#737373" }}>{date}</span>
      </div>
    </Link>
  );
}

function RecentWorkTab() {
  const sortedSpaces = [...allSpaces].sort((a, b) => parseDaysAgo(a.editedAt) - parseDaysAgo(b.editedAt));
  const recentAssets = getProjectAssets("").slice(0, 3);

  return (
    <div className="mx-auto flex w-full gap-6" style={{ maxWidth: 1200 }}>
      {/* Projects */}
      <section
        className="flex min-w-0 flex-1 flex-col gap-4 rounded-2xl px-6 py-4"
        style={{ background: "#1a1a1a" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium" style={{ color: "#f5f5f5" }}>Projects</span>
          <button type="button" className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-white/5" style={{ color: "#f5f5f5" }}>
            <Plus weight="regular" size={12} />
          </button>
        </div>
        {projects.slice(0, 3).map((p) => (
          <ListItem
            key={p.name}
            href={`/projects/${p.name.toLowerCase().replace(/\s+/g, "-")}`}
            thumb={p.cover}
            name={p.name}
            date="Today"
          />
        ))}
        <Link href="/projects/all-projects" className="text-[12px] font-medium transition-colors hover:opacity-70" style={{ color: "#e3e3e3" }}>
          View all
        </Link>
      </section>

      {/* Spaces */}
      <section
        className="flex min-w-0 flex-1 flex-col gap-4 rounded-2xl px-6 py-4"
        style={{ background: "#1a1a1a" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium" style={{ color: "#f5f5f5" }}>Spaces</span>
          <button type="button" className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-white/5" style={{ color: "#f5f5f5" }}>
            <Plus weight="regular" size={12} />
          </button>
        </div>
        {sortedSpaces.slice(0, 3).map((space) => (
          <ListItem
            key={space.id}
            href="/spaces"
            thumb={space.thumbnails[0]}
            name={space.name}
            date={space.editedAt}
          />
        ))}
        <Link href="/spaces" className="text-[12px] font-medium transition-colors hover:opacity-70" style={{ color: "#e3e3e3" }}>
          View all
        </Link>
      </section>

      {/* Assets */}
      <section
        className="flex min-w-0 flex-1 flex-col gap-4 rounded-2xl px-6 py-4"
        style={{ background: "#1a1a1a" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium" style={{ color: "#f5f5f5" }}>Assets</span>
          <span className="size-6" />
        </div>
        {recentAssets.map((asset, i) => (
          <ListItem
            key={i}
            href="/projects/all-assets"
            thumb={asset.src}
            name={asset.projectName || "Untitled asset"}
            date="Today"
          />
        ))}
        <Link href="/projects/all-assets" className="text-[12px] font-medium transition-colors hover:opacity-70" style={{ color: "#e3e3e3" }}>
          View all
        </Link>
      </section>
    </div>
  );
}

export default function GetStartedPage() {
  const spotlight = useSpotlight();
  const [bottomTab, setBottomTab] = useState("For you");
  const [selectedTool, setSelectedTool] = useState("Find Stock");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [generationCount, setGenerationCount] = useState(1);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [selectorPos, setSelectorPos] = useState<{ top: number; bottom: number; right: number; openAbove: boolean } | null>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  const modelBtnTriggerRef = useRef<HTMLButtonElement>(null);
  const [showAllTools, setShowAllTools] = useState(false);
  const heroScroll = useHorizontalScroll();
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const topSectionRef = useRef<HTMLDivElement>(null);
  const [topFade, setTopFade] = useState(1);
  const [topSectionHeight, setTopSectionHeight] = useState(0);

  const updateSelectorPos = useCallback(() => {
    if (modelBtnTriggerRef.current) {
      const rect = modelBtnTriggerRef.current.getBoundingClientRect();
      setSelectorPos({
        top: rect.top,
        bottom: rect.bottom,
        right: window.innerWidth - rect.right,
        openAbove: rect.top > window.innerHeight / 2,
      });
    }
  }, []);

  useEffect(() => {
    if (!modelSelectorOpen) return;
    window.addEventListener("resize", updateSelectorPos);
    return () => window.removeEventListener("resize", updateSelectorPos);
  }, [modelSelectorOpen, updateSelectorPos]);

  useEffect(() => {
    const el = topSectionRef.current;
    if (!el) return;
    setTopSectionHeight(el.offsetHeight);
    const ro = new ResizeObserver(() => setTopSectionHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleMainScroll = useCallback(() => {
    const scrollEl = mainScrollRef.current;
    if (!scrollEl || !topSectionHeight) return;
    const scrollY = scrollEl.scrollTop;
    const fade = Math.max(0, 1 - scrollY / (topSectionHeight * 0.6));
    setTopFade(fade);
  }, [topSectionHeight]);

  const { colors: paletteColors, surfaceColors: sc } = usePalette();
  const purpleSolid = paletteColors.spaces.bg;
  const blueSolid = paletteColors.image.bg;
  const greenSolid = paletteColors.video.bg;
  const orangeSolid = paletteColors.audio.bg;
  const yellowSolid = paletteColors["3d"].bg;
  const graySolid = paletteColors.stock.bg;
  const toolCategories = getToolCategories(blueSolid, greenSolid, orangeSolid, yellowSolid);

  const toolToCategory: Record<string, string> = {
    Image: "Image", Video: "Video", "3D Object": "3D",
    Voiceover: "Audio", Music: "Audio", "Sound Effects": "Audio",
    "Find Stock": "Stock",
  };
  const selectedCategory = toolToCategory[selectedTool] ?? "Image";
  const categoryGradients: Record<string, string> = {
    Image: blueSolid,
    Video: greenSolid,
    Audio: orangeSolid,
    "3D": yellowSolid,
    Stock: graySolid,
  };

  return (
    <main
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl"
      style={{ background: "#161616" }}
    >
      <header className="flex h-[60px] shrink-0 items-center justify-between px-6">
        <Breadcrumb />
        <div className="flex items-center gap-3">
          <FreepikButton />
          <AssistantButton />
          <AvatarWithProgress />
        </div>
      </header>

      <div className="relative min-h-0 flex-1 px-1 pb-1">
        <div
          ref={topSectionRef}
          className="absolute inset-x-1 top-0 px-6"
          style={{
            opacity: topFade,
            transform: `scale(${0.97 + 0.03 * topFade})`,
            transformOrigin: "top center",
            filter: `blur(${(1 - topFade) * 8}px)`,
          }}
          onWheel={(e) => {
            if (mainScrollRef.current) {
              mainScrollRef.current.scrollTop += e.deltaY;
            }
          }}
        >
          {/* Chat Box */}
          <div className="mx-auto flex w-full flex-col items-center gap-6 pt-10" style={{ maxWidth: 1200 }}>
            <h1
              className="text-center tracking-[-0.32px]"
              style={{ fontFamily: klarheit.style.fontFamily, fontSize: 32, lineHeight: 1.375, color: "#f5f5f5" }}
            >
              Good morning, start creating!
            </h1>
            <div
              className="flex h-12 w-full cursor-pointer items-center overflow-hidden rounded-2xl border pl-1.5 pr-4"
              style={{ maxWidth: 672, background: "#1a1a1a", borderColor: "rgba(255,255,255,0.1)" }}
              onClick={() => spotlight?.open()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); spotlight?.open(); } }}
            >
              <div className="flex size-10 shrink-0 items-center justify-center">
                <MagnifyingGlass weight="regular" size={14} style={{ color: "#737373" }} />
              </div>
              <span className="flex-1 text-[15px]" style={{ color: "#737373" }}>Search projects, assets and more</span>
            </div>
          </div>

          {/* Tools row — single line of 6, pixel-perfect from Figma */}
          <div className="mx-auto flex w-full gap-4" style={{ maxWidth: 1200 }}>
            {[
              { label: "Create a Space", icon: "/icons/tool-spaces.svg", desc: "Build creative workflows on an infinite canvas", bg: "rgba(192,129,222,0.1)", href: "/spaces" },
              { label: "Generate Image", icon: "/icons/tool-image.svg", desc: "Build creative workflows on an infinite canvas", bg: "rgba(131,115,255,0.1)", href: "/ai-suite" },
              { label: "Generate Video", icon: "/icons/tool-video.svg", desc: "Build creative workflows on an infinite canvas", bg: "rgba(16,201,141,0.1)", href: "/video" },
              { label: "Generate Audio", icon: "/icons/tool-audio.svg", desc: "Build creative workflows on an infinite canvas", bg: "rgba(121,209,219,0.1)", href: "/audio" },
              { label: "Generate 3D", icon: "/icons/tool-3d.svg", desc: "Build creative workflows on an infinite canvas", bg: "rgba(231,173,22,0.1)", href: "/3d" },
              { label: "Find stock", icon: "/icons/tool-stock.svg", desc: "Build creative workflows on an infinite canvas", bg: "rgba(255,255,255,0.05)", href: "/stock" },
            ].map(({ label, icon, desc, bg, href }) => (
              <Link
                key={label}
                href={href}
                className="flex min-w-0 flex-1 cursor-pointer flex-col rounded-2xl p-4 transition-colors hover:bg-white/5"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg" style={{ background: bg }}>
                    <img src={icon} alt="" className="size-5" />
                  </div>
                  <div className="flex flex-col leading-[1.6]">
                    <span className="text-[16px] font-medium" style={{ color: "#f5f5f5" }}>{label}</span>
                    <span className="text-[12px]" style={{ color: "#424242" }}>{desc}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div
          ref={mainScrollRef}
          onScroll={handleMainScroll}
          className="relative z-10 h-full overflow-y-auto rounded-2xl pointer-events-none"
          style={{ opacity: topSectionHeight ? 1 : 0 }}
        >
          <div style={{ height: topSectionHeight }} />
          <div
            className="pointer-events-auto flex flex-col gap-10 px-6 py-4"
            style={{ background: "#161616", minHeight: "100%" }}
          >
          {/* Projects / Spaces / Assets — 3 columns */}
          <RecentWorkTab />

          {/* Chips: For you / Templates / Tutorials */}
          <div className="mx-auto flex w-full items-center gap-2" style={{ maxWidth: 1200 }}>
            {["For you", "Templates", "Tutorials"].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setBottomTab(chip)}
                className="cursor-pointer rounded-lg px-4 py-2 text-[14px] font-medium transition-colors"
                style={{
                  background: bottomTab === chip ? "#2b2b2b" : "transparent",
                  color: bottomTab === chip ? "#f5f5f5" : "#737373",
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {bottomTab === "For you" && (
          <>
          {/* Hero */}
          <div className="group/row relative -mr-6" style={{ minHeight: 200 }}>
            <ScrollArrows canScrollLeft={heroScroll.canScrollLeft} canScrollRight={heroScroll.canScrollRight} scroll={heroScroll.scroll} />
            <div
              ref={heroScroll.scrollRef}
              onScroll={heroScroll.updateScrollState}
              onMouseEnter={heroScroll.updateScrollState}
              className="flex gap-6 overflow-x-auto pr-6 scrollbar-hide"
            >
                {[
                  {
                    title: "Image Upscaler",
                    desc: "Enhance resolution and recover fine detail with AI",
                    tag: "New",
                    gradient: blueSolid,
                    image: "/promo-image-upscaler-2.png",
                  },
                  {
                    title: "Clip Editor",
                    desc: "Trim and refine your video clips with precision",
                    tag: "New",
                    gradient: blueSolid,
                    image: "/promo-clip-editor.png",
                  },
                  {
                    title: "Color Grading",
                    desc: "Set the mood with cinematic color grading",
                    tag: "New",
                    gradient: blueSolid,
                    image: "/promo-color-grading.png",
                  },
                  {
                    title: "Cinematic Shot",
                    desc: "Generate stunning cinematic compositions with full camera control",
                    tag: "New",
                    gradient: blueSolid,
                    image: "/promo-cinematic-shot.png",
                  },
                  {
                    title: "High-res Products with Seedream 4.5",
                    desc: "Generate photorealistic high-resolution product imagery",
                    tag: "New",
                    gradient: blueSolid,
                    image: "/promo-seedream-45.png",
                  },
                  {
                    title: "Relight",
                    desc: "Transform lighting and mood of any portrait",
                    tag: "New",
                    gradient: blueSolid,
                    image: "/promo-relight-new.png",
                  },
                  {
                    title: "Kling 3.0",
                    desc: "Next-gen video creation with cinematic realism",
                    tag: "New",
                    gradient: greenSolid,
                    image: "/promo-kling3-new.png",
                  },
                  {
                    title: "360° Camera Control",
                    desc: "Full camera orbit and angle control for video",
                    tag: "New",
                    gradient: greenSolid,
                    image: "/promo-camera-control-new.png",
                  },
                  {
                    title: "World Generator",
                    desc: "Build immersive 3D environments and scenes",
                    tag: "New",
                    gradient: yellowSolid,
                    image: "/promo-world-generator-new.png",
                  },
                  {
                    title: "Unlimited Generations with Nano Banana",
                    desc: "Create without limits using Google's Nano Banana model",
                    tag: "New",
                    gradient: blueSolid,
                    image: "/promo-nano-banana-unlimited.png",
                  },
                  {
                    title: "Time of Day",
                    desc: "Transform the time of day in any scene or environment",
                    tag: "New",
                    gradient: blueSolid,
                    image: "/promo-time-of-day.png",
                  },
                ].map((card) => (
                  <button
                    key={card.title}
                    type="button"
                    className="group/card relative flex h-[200px] aspect-video shrink-0 cursor-pointer flex-col justify-end gap-4 overflow-hidden rounded-xl p-5 text-left"
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </button>
                ))}
            </div>
          </div>

          </>
          )}

          {bottomTab === "Templates" && (
          <>
          {/* Template sections */}
          {templateSections.map(({ title, templates }) => (
            <ScrollRow key={title} title={title} templates={templates} />
          ))}
          </>
          )}

          {bottomTab === "Tutorials" && (
            <div className="mx-auto flex w-full items-center justify-center py-16" style={{ maxWidth: 1200 }}>
              <span className="text-[14px]" style={{ color: "#737373" }}>Tutorials coming soon</span>
            </div>
          )}

          <div className="h-6" />
        </div>
        </div>
      </div>

      {modelSelectorOpen && (
        <>
          <div className="fixed inset-0 z-[999]" onClick={() => setModelSelectorOpen(false)} />
          <div
            className="fixed z-[1000] overflow-hidden overflow-y-auto rounded-xl border p-2"
            style={{
              background: "#252525",
              borderColor: "rgba(255,255,255,0.08)",
              right: selectorPos?.right,
              ...(selectorPos?.openAbove
                ? { bottom: window.innerHeight - selectorPos.top + 8, maxHeight: selectorPos.top - 16 }
                : { top: selectorPos ? selectorPos.bottom + 8 : undefined, maxHeight: selectorPos ? window.innerHeight - selectorPos.bottom - 16 : undefined }),
            }}
          >
            <div className="flex flex-col gap-0.5">
              {[
                { id: "Image", icon: Image, label: "Image" },
                { id: "Video", icon: VideoCamera, label: "Video" },
                { id: "Voiceover", icon: Microphone, label: "Voiceover" },
                { id: "Music", icon: MusicNotes, label: "Music" },
                { id: "Sound Effects", icon: Waveform, label: "Sound Effects" },
                { id: "3D Object", icon: Cube, label: "3D Object" },
                { id: "Find Stock", icon: MagnifyingGlass, label: "Find Stock" },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setSelectedTool(id); setModelSelectorOpen(false); }}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-fg/5"
                  style={{
                    background: selectedTool === id ? "rgba(255,255,255,0.08)" : "transparent",
                  }}
                >
                  <Icon weight="bold" size={14} className="text-fg/50" />
                  <span className="text-xs font-medium text-fg/80">{label}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-white/5 pt-2 mt-1 px-1">
              <div className="px-2 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-fg/30">
                Generations
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setGenerationCount(count)}
                    className="flex h-7 cursor-pointer items-center justify-center rounded-md px-2.5 text-[11px] font-medium transition-colors hover:bg-fg/5"
                    style={{
                      background: generationCount === count ? "rgba(255,255,255,0.1)" : "transparent",
                      color: generationCount === count ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    x{count}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
