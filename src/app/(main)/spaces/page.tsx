"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import localFont from "next/font/local";

const klarheit = localFont({ src: "../../fonts/ESKlarheitPlakat-Xbd.otf" });
import { Breadcrumb } from "@/components/Breadcrumb";
import { Plus } from "@phosphor-icons/react";
import { AssistantButton } from "@/components/AssistantButton";
import { AvatarWithProgress } from "@/components/AvatarWithProgress";
import { FreepikButton } from "@/components/FreepikButton";
import { usePalette } from "@/contexts/PaletteContext";
import { useFolder } from "@/contexts/FolderContext";
import { SpacesFilterBar } from "@/components/SpacesFilterBar";
import { SpaceCard } from "@/components/SpaceCard";
import { useAssetsFilter } from "@/contexts/AssetsFilterContext";
import { allSpaces } from "@/data/spaces";


export default function SpacesPage() {
  const router = useRouter();
  const { surfaceColors: sc, ctaColor, ctaTextColor } = usePalette();
  const { activeProject } = useFolder();
  const { selectedProject, selectedOwner } = useAssetsFilter();

  // Filter spaces based on selected project and owner
  const filteredSpaces = useMemo(() => {
    let spaces = allSpaces;
    
    if (selectedProject !== "All") {
      spaces = spaces.filter(space => space.projectName === selectedProject);
    }
    
    if (selectedOwner !== "Anyone") {
      spaces = spaces.filter(space => space.owner === selectedOwner);
    }
    
    return spaces;
  }, [selectedProject, selectedOwner]);

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
          style={{ background: sc.panel }}
        >
          {/* Hero */}
          <div className="relative overflow-hidden rounded-2xl p-8" style={{ background: sc.card, minHeight: 300 }}>
              <img
                src="/spaces-hero-bg.png"
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-3xl"
              />

              {/* Node-graph — coords derived from reference DOM canvas transform
                  translate(-2190px, 48.5px), all screen-space values × 0.78 */}
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 h-full w-auto"
                viewBox="0 0 700 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="sg-fade" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"  stopColor="white" stopOpacity="0" />
                    <stop offset="20%" stopColor="white" stopOpacity="1" />
                  </linearGradient>
                  <mask id="sg-mask">
                    <rect width="700" height="280" fill="url(#sg-fade)" />
                  </mask>
                  {/* Gradient card borders matching --render-c1/--render-c2 from reference */}
                  <linearGradient id="gb-green" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(68,182,120,0.5)"  />
                    <stop offset="100%" stopColor="rgba(68,182,120,0.25)" />
                  </linearGradient>
                  <linearGradient id="gb-purple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(101,105,189,0.55)" />
                    <stop offset="100%" stopColor="rgba(176,124,198,0.4)"  />
                  </linearGradient>
                  {/* Image clip paths */}
                  <clipPath id="sg-c1"><rect x="223" y="125" width="78" height="78" rx="12.5" /></clipPath>
                  <clipPath id="sg-c2"><rect x="446" y="175" width="78" height="78" rx="12.5" /></clipPath>
                  <clipPath id="sg-c3"><rect x="601" y="67"  width="78" height="78" rx="12.5" /></clipPath>
                  {/* Prompt card text clip paths */}
                  <clipPath id="sg-p1"><rect x="-19" y="23"  width="137" height="62" rx="12.5" /></clipPath>
                  <clipPath id="sg-p2"><rect x="335" y="50"  width="137" height="53" rx="12.5" /></clipPath>
                </defs>

                <g mask="url(#sg-mask)">
                  {/* ── PATHS (exact bezier from reference DOM × 0.78) ── */}
                  {/* Green:  Prompt1 right-edge  →  ImageGen left-edge  */}
                  <path d="M 136.5 37.1 C 175.5 37.1, 165.3 189.8, 204.3 189.8"
                        stroke="rgba(68,182,120,0.75)"  strokeWidth="2" strokeLinecap="round" />
                  {/* Purple: ImageGen right-edge  →  Upscaler left-edge */}
                  <path d="M 319.8 138.4 C 368.2 138.4, 379.0 239.9, 427.4 239.9"
                        stroke="rgba(101,105,189,0.75)" strokeWidth="2" strokeLinecap="round" />
                  {/* Purple: Upscaler right-edge  →  VideoGen left-edge (purple, bottom:8) */}
                  <path d="M 542.9 188.4 C 581.9 188.4, 543.7 131.4, 582.7 131.4"
                        stroke="rgba(101,105,189,0.75)" strokeWidth="2" strokeLinecap="round" />
                  {/* Green:  Prompt2 right-edge   →  VideoGen left-edge (green, bottom:34) */}
                  <path d="M 489.8 62.8 C 531.6 62.8, 540.9 111.2, 582.7 111.2"
                        stroke="rgba(68,182,120,0.75)"  strokeWidth="2" strokeLinecap="round" />

                  {/* ── IMAGE NODES ── */}

                  {/* Image Generator — screen (286, 130) → svg (223, 102), card (223,125,78×78) */}
                  <text x="231" y="119" fontFamily="system-ui,sans-serif" fontSize="8" fill="white" fillOpacity="0.3" fontWeight="500">Image Generator</text>
                  <image href="https://pikaso.cdnpk.net/public/media/spaces/onboarding-assets/04-image.png?preview=1&width=200"
                         x="223" y="125" width="78" height="78" clipPath="url(#sg-c1)" preserveAspectRatio="xMidYMid slice" />
                  <rect  x="223" y="125" width="78" height="78" rx="12.5" stroke="url(#gb-purple)" strokeWidth="1" fill="none" />
                  {/* left:-24 bottom:8  → center (211, 190) */}
                  <circle cx="211.4" cy="189.8" r="7" fill="#1e1e1e" stroke="rgba(68,182,120,0.9)"  strokeWidth="2" />
                  {/* right:-24 top:8   → center (313, 138) */}
                  <circle cx="312.8" cy="138.4" r="7" fill="#1e1e1e" stroke="rgba(101,105,189,0.9)" strokeWidth="2" />

                  {/* Upscaler — screen (572, 195) → svg (446, 152), card (446,175,78×78) */}
                  <text x="454" y="169" fontFamily="system-ui,sans-serif" fontSize="8" fill="white" fillOpacity="0.3" fontWeight="500">Upscaler</text>
                  <image href="https://pikaso.cdnpk.net/public/media/spaces/onboarding-assets/04-image.png?preview=1&width=200"
                         x="446" y="175" width="78" height="78" clipPath="url(#sg-c2)" preserveAspectRatio="xMidYMid slice" />
                  <rect  x="446" y="175" width="78" height="78" rx="12.5" stroke="url(#gb-purple)" strokeWidth="1" fill="none" />
                  {/* left:-24 bottom:8  → center (435, 240) */}
                  <circle cx="434.5" cy="239.9" r="7" fill="#1e1e1e" stroke="rgba(101,105,189,0.9)" strokeWidth="2" />
                  {/* right:-24 top:8   → center (536, 188) */}
                  <circle cx="535.9" cy="188.4" r="7" fill="#1e1e1e" stroke="rgba(101,105,189,0.9)" strokeWidth="2" />

                  {/* Video Generator — screen (771, 56) → svg (601, 43), card (601,67,78×78) */}
                  <text x="609" y="61" fontFamily="system-ui,sans-serif" fontSize="8" fill="white" fillOpacity="0.3" fontWeight="500">Video Generator</text>
                  <foreignObject x="601" y="67" width="78" height="78" clipPath="url(#sg-c3)">
                    <video
                      src="/04-video.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </foreignObject>
                  <rect  x="601" y="67" width="78" height="78" rx="12.5" stroke="url(#gb-purple)" strokeWidth="1" fill="none" />
                  {/* left:-24 bottom:34 → center (590, 111) */}
                  <circle cx="589.7" cy="111.2" r="7" fill="#1e1e1e" stroke="rgba(68,182,120,0.9)"  strokeWidth="2" />
                  {/* left:-24 bottom:8  → center (590, 131) */}
                  <circle cx="589.7" cy="131.4" r="7" fill="#1e1e1e" stroke="rgba(101,105,189,0.9)" strokeWidth="2" />

                  {/* ── PROMPT NODES ── */}

                  {/* Prompt 1 — screen (-24, 0.5) → svg (-19, 0), card (-19,23,137×62) */}
                  <text x="-11" y="17" fontFamily="system-ui,sans-serif" fontSize="8" fill="white" fillOpacity="0.3" fontWeight="500">Prompt</text>
                  <rect x="-19" y="23" width="137" height="62" rx="12.5" fill="#161616" />
                  <rect x="-19" y="23" width="137" height="62" rx="12.5" stroke="url(#gb-green)" strokeWidth="1" fill="none" />
                  <g clipPath="url(#sg-p1)">
                    <text fontFamily="system-ui,sans-serif" fontSize="8" fill="white" fillOpacity="0.8">
                      <tspan x="-8" y="39">Dreamy full-body portrait</tspan>
                      <tspan x="-8" dy="12">of a silhouetted figure</tspan>
                      <tspan x="-8" dy="12">in motion against a soft,</tspan>
                      <tspan x="-8" dy="12">cool blue backdrop.</tspan>
                    </text>
                  </g>
                  {/* right:-24 top:8 → center (130, 37) */}
                  <circle cx="129.5" cy="37.1" r="7" fill="#1e1e1e" stroke="rgba(68,182,120,0.9)" strokeWidth="2" />

                  {/* Prompt 2 — screen (429, 33.5) → svg (335, 26), card (335,50,137×53) */}
                  <text x="343" y="44" fontFamily="system-ui,sans-serif" fontSize="8" fill="white" fillOpacity="0.3" fontWeight="500">Prompt</text>
                  <rect x="335" y="50" width="137" height="53" rx="12.5" fill="#161616" />
                  <rect x="335" y="50" width="137" height="53" rx="12.5" stroke="url(#gb-green)" strokeWidth="1" fill="none" />
                  <g clipPath="url(#sg-p2)">
                    <text fontFamily="system-ui,sans-serif" fontSize="8" fill="white" fillOpacity="0.8">
                      <tspan x="346" y="66">Slowly and cinematically</tspan>
                      <tspan x="346" dy="12">zoom out of the scene,</tspan>
                      <tspan x="346" dy="12">focusing on the subject</tspan>
                    </text>
                  </g>
                  {/* right:-24 top:8 ��� center (483, 63) */}
                  <circle cx="482.8" cy="62.8" r="7" fill="#1e1e1e" stroke="rgba(68,182,120,0.9)" strokeWidth="2" />
                </g>
              </svg>

              <h1 className="relative text-[48px] font-normal leading-tight text-fg" style={{ fontFamily: klarheit.style.fontFamily }}>
                Spaces
              </h1>
              <p className="relative mt-2.5 text-[14px] text-fg/70">
                An infinite canvas for node-based generative creation
              </p>
              <button
                type="button"
                onClick={() => router.push("/spaces/new")}
                className="relative mt-5 flex h-9 w-fit cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: ctaColor, color: ctaTextColor }}
              >
                <Plus weight="bold" size={15} />
                Create a new Space
              </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-fg">
              Spaces
              <span className="ml-2 text-sm text-fg-muted">({filteredSpaces.length})</span>
            </h2>
            <SpacesFilterBar />
          </div>

          {/* Spaces Grid */}
          {filteredSpaces.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
              {filteredSpaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  name={space.name}
                  editedAt={space.editedAt}
                  thumbnails={space.thumbnails}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-fg-muted">No spaces found matching your filters</p>
            </div>
          )}

          <div className="h-6" />
        </div>
      </div>
    </main>
  );
}
