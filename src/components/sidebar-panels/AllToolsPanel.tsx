"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTool } from "@/contexts/ToolContext";
import { usePalette, PaletteColors } from "@/contexts/PaletteContext";
import { PushPin, Image, PenNib, ArrowsOut, FilmStrip, Copy, Smiley, Camera, TShirt, Eraser, SquaresFour, Sun, VideoCamera, Headphones, Microphone, MusicNotes, Sparkle, ArrowsClockwise, Cube, X, UserCircle, Stack, Star, Palette, House, SlidersHorizontal, TreeStructure, AppWindow, Layout, GitBranch, Blueprint } from "@phosphor-icons/react";

export function getSections(c: PaletteColors) { return [
  {
    id: "image",
    label: "Image",
    href: "/ai-suite",
    accent: c.image.bg,
    iconColor: c.image.icon,
    tools: [
      { id: "image-generator", label: "Image Generator", icon: Image, desc: "Create images from text prompts" },
      { id: "image-editor", label: "Image Editor", icon: PenNib, desc: "Edit and modify existing images" },
      { id: "image-upscaler", label: "Image Upscaler", icon: ArrowsOut, desc: "Enhance resolution and detail" },
      { id: "cinematic-shot", label: "Cinematic Shot", icon: FilmStrip, desc: "Generate cinematic compositions" },
      { id: "variations", label: "Variations", icon: Copy, desc: "Create variations of an image" },
      { id: "skin-enhancer", label: "Skin Enhancer", icon: Smiley, desc: "Retouch and enhance skin details" },
      { id: "change-camera", label: "Change Camera", icon: Camera, desc: "Adjust camera angle and lens" },
      { id: "mockup-generator", label: "Mockup Generator", icon: TShirt, desc: "Place designs on product mockups" },
      { id: "remove-background", label: "Remove Background", icon: Eraser, desc: "Isolate subjects from backgrounds" },
      { id: "batch", label: "Batch", icon: SquaresFour, desc: "Process multiple images at once" },
      { id: "relight", label: "Relight", icon: Sun, desc: "Change lighting and atmosphere" },
    ],
  },
  {
    id: "video",
    label: "Video",
    href: "/video",
    accent: c.video.bg,
    iconColor: c.video.icon,
    tools: [
      { id: "video-generator", label: "Video Generator", icon: VideoCamera, desc: "Create videos from text prompts" },
      { id: "clip-editor", label: "Clip Editor", icon: FilmStrip, desc: "Trim, cut, and edit video clips" },
      { id: "video-upscaler", label: "Video Upscaler", icon: ArrowsOut, desc: "Enhance video resolution" },
      { id: "video-project-editor", label: "Video Project Editor", icon: PenNib, desc: "Edit multi-clip video projects" },
      { id: "lip-sync", label: "Lip Sync", icon: Headphones, desc: "Sync lip movements to audio" },
      { id: "video-face-swap", label: "Video Face Swap", icon: Smiley, desc: "Swap faces in video content" },
      { id: "speak", label: "Speak", icon: Microphone, desc: "Generate speech for video" },
    ],
  },
  {
    id: "audio",
    label: "Audio",
    href: "/audio",
    accent: c.audio.bg,
    iconColor: c.audio.icon,
    tools: [
      { id: "music-generator", label: "Music Generator", icon: MusicNotes, desc: "Create music from text prompts" },
      { id: "voice-generator", label: "Voice Generator", icon: Microphone, desc: "Generate realistic voiceovers" },
      { id: "sound-effect-generator", label: "Sound Effect Generator", icon: Sparkle, desc: "Create custom sound effects" },
      { id: "change-voice", label: "Change Voice", icon: ArrowsClockwise, desc: "Transform voice characteristics" },
    ],
  },
  {
    id: "3d",
    label: "3D",
    href: "/3d",
    accent: c["3d"].bg,
    iconColor: c["3d"].icon,
    tools: [
      { id: "virtual-scene", label: "Virtual Scene", icon: Cube, desc: "Build immersive 3D environments" },
      { id: "3d-generator", label: "3D Generator", icon: Cube, desc: "Generate 3D models from prompts" },
    ],
  },
  {
    id: "spaces",
    label: "Spaces",
    href: "/spaces",
    accent: c.spaces.bg,
    iconColor: c.spaces.icon,
    tools: [
      { id: "new-space", label: "Spaces", icon: TreeStructure, desc: "Create an infinite canvas workspace" },
      { id: "build-app", label: "App Builder", icon: AppWindow, desc: "Design and build interactive apps" },
      { id: "templates", label: "Templates", icon: Layout, desc: "Start from a pre-built space template" },
    ],
  },
  {
    id: "apps",
    label: "Apps",
    href: "",
    accent: c.spaces.bg,
    iconColor: c.spaces.icon,
    tools: [
      { id: "selfie-with-me", label: "Selfie With Me", icon: UserCircle, desc: "Take AI selfies with any style or character" },
      { id: "batch-upscale", label: "Batch Upscale", icon: Stack, desc: "Upscale hundreds of images at once" },
      { id: "rate-my-fit", label: "Rate My Fit", icon: Star, desc: "Get AI feedback on your outfit" },
      { id: "style-transfer", label: "Style Transfer", icon: Palette, desc: "Apply any artistic style to your photos" },
      { id: "room-redesign", label: "Room Redesign", icon: House, desc: "Redecorate any room with AI" },
      { id: "prompt-tuner", label: "Prompt Tuner", icon: SlidersHorizontal, desc: "Optimize and refine your prompts" },
    ],
  },
]; }

export function AllToolsPanel({ onClose, initialTab }: { onClose: () => void; initialTab?: string }) {
  const { pinnedTools, togglePinTool, setActiveToolId, setActiveToolLabel, setShowToolsPanel, allToolsTab } = useTool();
  const { colors: paletteColors } = usePalette();
  const sections = getSections(paletteColors);
  const [activeTab, setActiveTab] = useState(initialTab ?? allToolsTab);

  // When used as the sidebar panel (no initialTab), sync active tab from context
  useEffect(() => {
    if (!initialTab) setActiveTab(allToolsTab);
  }, [allToolsTab, initialTab]);

  const section = sections.find((s) => s.id === activeTab)!;

  return (
    <div className="flex flex-col gap-3 px-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-fg">All tools</span>
        <button
          type="button"
          onClick={onClose}
          className="flex size-7 cursor-pointer items-center justify-center rounded-md text-fg/40 transition-colors hover:bg-white/10 hover:text-fg"
        >
          <X weight="bold" size={14} />
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveTab(s.id)}
            className="cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium transition-colors"
            style={{
              background: activeTab === s.id ? "var(--selected)" : "transparent",
              color: activeTab === s.id ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-0.5">
        {section.tools.map(({ id, label, icon: Icon, desc }) => (
          <div key={id} className="group relative">
            {section.href ? (
            <Link
              href={section.href}
              className="group/tool flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
              onClick={() => {
                setActiveToolId(id);
                setActiveToolLabel(label);
                setShowToolsPanel(false);
              }}
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                style={{ background: section.accent }}
              >
                <Icon weight="regular" size={20} style={{ color: section.iconColor }} className="transition-colors group-hover/tool:opacity-100 opacity-80" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-xs font-medium text-fg/80 transition-colors group-hover/tool:text-fg">{label}</span>
                <span className="text-[11px] leading-snug text-fg/40">{desc}</span>
              </div>
            </Link>
            ) : (
            <button
              type="button"
              className="group/tool flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                style={{ background: section.accent }}
              >
                <Icon weight="regular" size={20} style={{ color: section.iconColor }} className="transition-colors group-hover/tool:opacity-100 opacity-80" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                <span className="text-xs font-medium text-fg/80 transition-colors group-hover/tool:text-fg">{label}</span>
                <span className="text-[11px] leading-snug text-fg/40">{desc}</span>
              </div>
            </button>
            )}
            <button
              type="button"
              onClick={() => togglePinTool(id)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 flex size-7 cursor-pointer items-center justify-center rounded-md transition-all ${pinnedTools.has(id) ? "text-fg/50 opacity-100 hover:text-fg" : "text-fg/30 opacity-0 hover:text-fg group-hover:opacity-100"}`}
            >
              <PushPin weight={pinnedTools.has(id) ? "fill" : "regular"} size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
