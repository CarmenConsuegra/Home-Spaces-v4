"use client";

import { useState, useRef, useCallback } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  MagnifyingGlass,
  Image,
  PenNib,
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
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { AssistantButton } from "@/components/AssistantButton";
import { AvatarWithProgress } from "@/components/AvatarWithProgress";
import { FreepikButton } from "@/components/FreepikButton";

const filterTabs = ["For you", "Image", "Video", "Audio", "3D"];

function slugify(title: string) {
  return title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const blueSolid = "#032a99";
const greenSolid = "#0f7c36";
const orangeSolid = "#b85a10";
const yellowSolid = "#b89a10";

const toolCategories = [
  {
    category: "Image",
    bgGradient: blueSolid,
    borderColor: blueSolid,
    subtleBg: "rgba(3,42,153,0.2)",
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
    subtleBg: "rgba(15,124,54,0.2)",
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
    subtleBg: "rgba(184,90,16,0.2)",
    tools: [
      { label: "Voice Generator", icon: Microphone, desc: "Generate natural-sounding voiceovers from text" },
      { label: "Voice Cloning", icon: Microphone, desc: "Clone any voice with just a short sample" },
      { label: "Sound Effects", icon: Sparkle, desc: "Create custom sound effects on demand" },
      { label: "Music Generator", icon: MusicNotes, desc: "Compose original music in any style or mood" },
    ],
  },
  {
    category: "3D",
    bgGradient: yellowSolid,
    borderColor: yellowSolid,
    subtleBg: "rgba(184,154,16,0.2)",
    tools: [
      { label: "3D Generator", icon: Cube, desc: "Generate 3D models from text or image input" },
      { label: "3D Worlds", icon: Cube, desc: "Build immersive 3D environments and scenes" },
    ],
  },
];

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

function ScrollRow({ title, templates }: { title: string; templates: { id: string; title: string; desc: string }[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -600 : 600, behavior: "smooth" });
  };

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
              className="flex w-[280px] shrink-0 cursor-pointer flex-col gap-2.5 overflow-hidden text-left transition-opacity hover:opacity-80"
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
                  className="line-clamp-2 text-sm opacity-50"
                  style={{ color: "var(--surface-foreground-4, #b1b1b1)" }}
                >
                  {desc}
                </p>
              </div>
            </button>
          ))}
        </div>
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
      </div>
    </div>
  );
}

export default function AppsPage() {
  const [activeTab, setActiveTab] = useState("For you");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  return (
    <main
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl"
      style={{ background: "var(--surface-modal)" }}
    >
      <header className="flex h-[60px] shrink-0 items-center justify-between px-6">
        <Breadcrumb />
        <div className="flex items-center gap-3">
          <FreepikButton />
          <AssistantButton />
          <AvatarWithProgress />
        </div>
      </header>

      <div className="min-h-0 flex-1 px-1 pb-1">
        <div
          className="flex h-full flex-col gap-8 overflow-y-auto rounded-2xl px-6 py-4"
          style={{ background: "#1c1c1c" }}
        >
          {/* Hero */}
          <div className="rounded-2xl p-8" style={{ background: "#202020" }}>
            <h1 className="text-[36px] font-normal leading-tight tracking-tight text-fg">
              AI Suite
            </h1>
            <p className="mt-2.5 text-sm text-fg/70">
              Tools and templates for any creative project
            </p>
          </div>

          {/* Tabs + Search */}
          <div className="flex items-center gap-6 pb-4">
            <div className="flex flex-1 items-center gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className="flex h-8 cursor-pointer items-center justify-center rounded-lg px-4 text-xs font-medium transition-colors"
                  style={{
                    background: activeTab === tab ? "rgba(255,255,255,0.15)" : "transparent",
                    color: "var(--surface-foreground-0)",
                    opacity: activeTab === tab ? 1 : 0.5,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div
              className="flex h-8 w-[200px] items-center gap-2 rounded-lg border px-2"
              style={{
                background: "#1c1c1c",
                borderColor: "rgba(255,255,255,0.05)",
              }}
            >
              <MagnifyingGlass
                weight="bold"
                size={16}
                className="shrink-0 opacity-50"
                style={{ color: "var(--surface-foreground-0)" }}
              />
              <input
                type="text"
                placeholder="Search"
                className="flex-1 border-0 bg-transparent text-xs outline-none"
                style={{ color: "var(--surface-foreground-0)" }}
              />
            </div>
          </div>

          {/* Tool categories */}
          <div className="grid grid-cols-4 gap-4">
            {toolCategories.map(({ category, bgGradient, subtleBg, tools }) => {
              const isExpanded = expandedCategories.has(category);
              const visibleTools = isExpanded ? tools : tools.slice(0, 3);
              const hasMore = tools.length > 3;
              return (
                <div key={category} className="flex flex-col gap-2 rounded-2xl p-4" style={{ background: "#202020" }}>
                  <div className="mb-1 flex items-center px-1">
                    <h2 className="text-sm font-medium text-fg/60">{category}</h2>
                  </div>
                  {visibleTools.map(({ label, icon: Icon, desc }, idx) => (
                    <button
                      key={label}
                      type="button"
                      className="flex cursor-pointer items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-white/5"
                      style={idx === 0 ? { background: subtleBg } : undefined}
                    >
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: bgGradient }}
                      >
                        <Icon weight="bold" size={18} className="text-fg" />
                      </div>
                      <div className="min-w-0 flex flex-col gap-0.5">
                        <span className="text-xs font-medium leading-tight text-fg">{label}</span>
                        <span className="text-[11px] leading-tight text-fg/40 line-clamp-2">{desc}</span>
                      </div>
                    </button>
                  ))}
                  {hasMore && (
                    <button
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="mt-1 cursor-pointer px-1 text-left text-[11px] font-medium text-fg/30 transition-colors hover:text-fg/60"
                    >
                      {isExpanded ? "Show less" : "Show all"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Template sections */}
          {templateSections.map(({ title, templates }) => (
            <ScrollRow key={title} title={title} templates={templates} />
          ))}

          <div className="h-6" />
        </div>
      </div>
    </main>
  );
}
